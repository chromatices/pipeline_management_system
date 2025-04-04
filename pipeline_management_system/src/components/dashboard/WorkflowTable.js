import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Table, Button } from "reactstrap";

function WorkflowInfo() {
  const [ArgoTable, setArgoTable] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 정렬 상태 관리
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // duration 문자열을 초 단위로 변환
  const parseDuration = (duration) => {
    const parts = duration.split(' '); // 문자열을 공백으로 분리
    let seconds = 0;
    parts.forEach(part => {
      if (part.includes('h')) {
        seconds += parseInt(part.replace('h', ''), 10) * 3600;
      } else if (part.includes('m')) {
        seconds += parseInt(part.replace('m', ''), 10) * 60;
      } else if (part.includes('s')) {
        seconds += parseInt(part.replace('s', ''), 10);
      }
    });
    return seconds;
  };

  // 데이터를 정렬하는 함수
  const sortArgoTable = (data, order) => {
    return [...data].sort((a, b) => {
      const durationA = parseDuration(a.duration);
      const durationB = parseDuration(b.duration);
      return order === 'asc' ? durationA - durationB : durationB - durationA;
    });
  };

  const getPipelineInfo = async () => {
    const envVars = process.env;
    const instanceConfigs = [];

    // 환경 변수에서 REACT_APP_ARGO{n}_* 패턴으로 인스턴스 탐지
    Object.keys(envVars).forEach(key => {
      const match = key.match(/^REACT_APP_ARGO(\d+)_/);
      if (match) {
        const instance = match[1]; // 인스턴스 번호
        instanceConfigs[instance] = instanceConfigs[instance] || {};
        const subKey = key.replace(`REACT_APP_ARGO${instance}_`, "").toLowerCase();
        instanceConfigs[instance][subKey] = envVars[key];
      }
    });

    const requests = instanceConfigs
      .filter(Boolean)
      .map((config, index) => {
        const { ip, port, namespace } = config;
        const url = `/api/v1/info?ip=${ip}&port=${port}&namespace=${namespace}`;

        return axios.get(url)
          .then(response => response.data.status.toLowerCase() === 'succeeded' ? response.data.items : [])
          .catch(error => {
            console.error(`Instance ${index + 1}: Error fetching data`, error);
            return [];
          });
      });

    const results = await Promise.all(requests);
    const mergedResults = results.reduce((acc, current) => {
      const values = Object.values(current);
      return acc.concat(values);
    }, []);

    // 정렬된 결과를 설정
    setArgoTable(sortArgoTable(mergedResults, sortOrder));
    setLastUpdate(Date.now());
  };

  useEffect(() => {
    getPipelineInfo();
    const intervalId = setInterval(() => {
      getPipelineInfo();
    }, 10 * 1000);

    return () => clearInterval(intervalId);
  }, [sortOrder]); // 정렬 순서가 변경될 때도 실행

  // 정렬 순서를 토글하는 함수
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag='h5'>Pipeline List</CardTitle>
          <CardSubtitle className='mb-2 text-muted' tag="h6">
            Overview of the pipeline
          </CardSubtitle>

          <Button onClick={getPipelineInfo} className="btn" color="primary" size="sm" outline style={{ marginRight: '10px' }}> 
            Reload Data
          </Button>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pipeline Name</th>
                <th>Status</th>
                <th onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                  Duration ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </th>
              </tr>
            </thead>
            <Link to='/pipeline/create'>
              <Button className="btn" color="primary" size="sm" outline>
                Upload Pipeline
              </Button>
            </Link>
            <tbody>
              {ArgoTable.map((data, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <h6>{data.name}</h6>
                  </td>
                  <td>
                    {data.status === "Succeeded" ? (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    ) : data.status === "Running" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>
                    <h6>{data.duration}</h6>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

export default WorkflowInfo;