import { Col, Row } from "reactstrap";
import PipelineTable from "../components/dashboard/WorkflowTable";
import { Card, CardBody, CardSubtitle} from "reactstrap";

const Starter = () => {
  // const ArgoWorkflowComponent = () => {
  //   return (
  //     <div>
  //       <iframe src="https://10.0.1.102:30100/workflows" width="100%" height="600" />
  //     </div>
  //   );
  // };

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
          <PipelineTable />
        </Col>
      </Row>     
      <Row>
        <Col lg="14">
          {/* <ArgoWorkflowComponent /> */}
        </Col>
      </Row>
    </div>
  );
};

export default Starter;
