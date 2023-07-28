import {useState} from 'react';
import {  useNavigate } from 'react-router-dom';
import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
  } from "reactstrap";
  
const Forms = () => {
    const [resources, isResources] = useState("")
    const [Parameters, isParameters] = useState("")
    const navigate = useNavigate();
    
    // Main page에서 업로드 한거면 Main으로 이동해야하고, Pipeline 페이지에서 업로드한거면 Pipeline으로 이동해야 함
    const Submit = () => {
      navigate("/workflows")
    }

    const handlerResource = (event) => {
      isResources(event.target.value);
    };

    const handlerParameter = (event) => {
      isParameters(event.target.value);
    };

    const Constraint = !(resources.length !==0 && Parameters.length !==0)
    return (
      <Row>
        <Col>
          {/* --------------------------------------------------------------------------------*/}
          {/* Card-1*/}
          {/* --------------------------------------------------------------------------------*/}
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-bezier me-2"> </i>
              Create Workflow
            </CardTitle>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for="exampleEmail">4. Set Cluster Resource</Label>
                  <Input
                    id="example Pipeline Name"
                    name="Name"
                    placeholder="Pipeline Name"
                    type="Name"
                    onChange={handlerResource}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="exampleEmail">5. Set Pipeline Parameters</Label>
                  <Input
                    id="example Pipeline Name"
                    name="Name"
                    placeholder="Pipeline Name"
                    type="Name"
                    onChange={handlerParameter}
                  />
                </FormGroup>
                <Button className="mt-2" onClick={Submit} disabled={Constraint}>Create Run</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };
  
  export default Forms;