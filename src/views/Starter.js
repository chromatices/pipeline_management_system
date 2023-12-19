import { Col, Row } from "reactstrap";
import WorkflowInfo from "../components/dashboard/NewWorkflowTable";
import { Card, CardBody, CardSubtitle} from "reactstrap";

const Starter = () => {

  return (
    <div>
      {/***Sales & Feed***/}
      <Row>
        <Col lg="12"> 
        <div>
          <Card>
            <CardBody tag="h5">
              Pipeline Management System
            </CardBody>
          </Card>
        </div>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          {/* <PipelineTable /> */}
          <WorkflowInfo />
        </Col>
      </Row>     
      <Row>
        <Col lg="14">
          {/* <ArgoComponent /> */}
        </Col>
      </Row>
    </div>
  );
};

export default Starter;
