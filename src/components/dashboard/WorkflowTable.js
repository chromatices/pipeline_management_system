import { Link } from 'react-router-dom'
import { Card, CardBody, CardTitle, CardSubtitle, Table , Button} from "reactstrap";


const tableData = [
  {
    name: "MNIST Example",
    status: "pending",
    duration: "35h",
  },
  {
    name: "ChatGPT Deployment",
    status: "Succeed",
    duration: "12h",
  },
  {
    name: "[Bert] Review Data Analysis",
    status: "Running",
    duration: "1m",
  },
];

const WorkflowTable = () => {
  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Pipeline List</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of the pipeline
          </CardSubtitle>
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pipeline Name</th>
                <th>Status</th>
                <th>Duration</th>

              </tr>
            </thead>
            <tbody>
              {tableData.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <h6>{tdata.name}</h6>
                    </td>
                  <td>
                    {tdata.status === "Succeed" ? (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    ) : tdata.status === "Running" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>
                    <h6>{tdata.duration}</h6>
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

export default WorkflowTable;
