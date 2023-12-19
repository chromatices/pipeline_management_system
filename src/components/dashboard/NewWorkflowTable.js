import axios from 'axios';
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Table , Button} from "reactstrap";

function WorkflowInfo() {
  const [ArgoTable, setArgoTable] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchData = async () => {
      console.log('fetching data from server');
      try {       
        const response = await axios.get('http://10.0.2.141:30101/api/v1/info');
        if (response.data.status.toLowerCase() === 'succeeded') {
          setArgoTable(response.data.items);
          setLastUpdate(Date.now()); // 데이터를 마지막으로 업데이트한 시간 업데이트
        }else{  
          throw new Error('Something went wrong... :< ');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  useEffect(() => {
    // fetch data on mount
    fetchData();
    // 5분마다 데이터를 가져오기 위한 간격 설정 (필요에 따라 조절)
    const intervalId = setInterval(() => {
      fetchData();
    }, 1 * 1000);

    // 컴포넌트가 언마운트될 때 간격 정리
    return () => clearInterval(intervalId);
  }, []); // 의존성 배열이 비어 있으므로 효과는 마운트 및 언마운트 시에만 실행됨

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag='h5'>Pipeline List</CardTitle>
          <CardSubtitle className='mb-2 text-muted' tag="h6">
            Overview of the pipeline
          </CardSubtitle>
          <Button color="primary" size="sm" onClick={() => fetchData() }>Reload Data</Button>
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pipeline Name</th>
                <th>Status</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ArgoTable).map((data, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <h6>{ArgoTable[data].name}</h6>
                    </td>
                  <td>
                    {ArgoTable[data].status === "Succeeded" ? (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    ) : ArgoTable[data].status === "Running" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>
                    <h6>{ArgoTable[data].duration}</h6>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Link to='/workflows/create'>
            <Button className="btn" color="primary" size="sm">
              Create Pipeline
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
};

export default WorkflowInfo;