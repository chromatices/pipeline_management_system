import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    FormText,
  } from "reactstrap";
  
  const Forms = () => {
    const [file, isfile] = useState("")
    const [name,isname] = useState("")
    const navigate = useNavigate();
    const Next = () => {
      navigate("/workflows/create/resources", {state: {  }})
    }
    const handleFileChange = (event) => {
      isfile(event.target.value);
    };
    const handleNameChange = (event) => {
      isname(event.target.value);
    };
    
    // 여기서 file이 왜 document.getElementById("File").value랑 동등한 역할을 하는거지?
    const Vaild_input = !( name.length !== 0 && file !=='');
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
              <Form onsubmit='return false'>
              <FormGroup>
                  <Label for="File">1. Upload Pipeline</Label>
                  <Input id="File" type="File" onChange={handleFileChange} accept=".yaml" />
                  <FormText>
                    Upload your pipeline yaml file.
                  </FormText>
                </FormGroup>

                <FormGroup>
                  <Label for="Name">2. Set Pipeline Name</Label>
                  <Input
                    id="Pipeline_Name"
                    name="Pipeline Name"
                    placeholder="Pipeline Name"
                    type="Text"
                    onChange={handleNameChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="exampleText">3. Description</Label>
                  <Input id="exampleText" name="text" type="textarea" />
                </FormGroup>
                <Button type="button" className="mt-2" onClick={Next} disabled={ Vaild_input }>Next</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };
  
  export default Forms; 