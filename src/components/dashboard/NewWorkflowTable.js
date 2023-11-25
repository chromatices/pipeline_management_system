import axios from 'axios';
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Table , Button} from "reactstrap";

function WorkflowInfo() {
  const [ArgoTable, setArgoTable] = useState([]);

  const fetchData = async () => {
      console.log('fetching data from server');
      try {       
        const response = await axios.get('http://10.0.2.141:30101/api/v1/info');
        if (response.data.status.toLowerCase() === 'succeeded') {
          setArgoTable(response.data.items);
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
  }, []);

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