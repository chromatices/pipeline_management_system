import { Col, Row } from "reactstrap";
import Feeds from "../components/dashboard/Feeds";
import SalesChart from "../components/dashboard/SalesChart";
import PipelineTable from "../components/dashboard/WorkflowTable";
import { Card, CardBody} from "reactstrap";

const Starter = () => {
  return (
    <div>
      {/***Sales & Feed***/}
      <Row>
        <Col lg="12"> 
        <div>
          <Card>
            <CardBody>
              test
            </CardBody>
          </Card>
        </div>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <PipelineTable />
        </Col>
      </Row>     
    </div>
  );
};

export default Starter;
