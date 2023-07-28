import { Link } from 'react-router-dom'
import { Card, CardBody, CardTitle, CardSubtitle, Table , Button} from "reactstrap";

const tableData = [
  {
    name: "MNIST Example",
    status: "pending",
    weeks: "35h",
  },
  {
    name: "ChatGPT Deployment",
    status: "done",
    weeks: "12h",
  },
  {
    name: "[Bert] Review Data Analysis",
    status: "holt",
    weeks: "1m",
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
                <th>Times</th>

              </tr>
            </thead>
            <tbody>
              {tableData.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <h6>{tdata.name}</h6>
                    </td>
                  <td>
                    {tdata.status === "pending" ? (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    ) : tdata.status === "holt" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>
                    <h6>{tdata.weeks}</h6>
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
