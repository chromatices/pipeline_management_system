import React, { useEffect, useState } from 'react';
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
    const [description,setdescription] = useState("")
    const [file, isfile] = useState("")
    const [name,setname] = useState("")
    const navigate = useNavigate();

    const Next = () => {
      navigate("/pipeline/create/resource", { state: { file, name, description } });
    };

    const handleFileChange = (event) => {
      let file = event.target.files[0];
      const reader = new FileReader();
      reader.onload=()=>{
        let context=reader.result;
        isfile(context)
      };
      reader.readAsText(file);
    };

    const handleNameChange = (event) => {
      const regExp = /[^0-9a-zA-Z-]/g;
      const ele = event.target;
      if (regExp.test(ele.value)) {
        ele.value = ele.value.replace(regExp, '');
      }
      setname(ele.value)
    };
    
    const handleDescChange = (event) => {
      setdescription(event.target.value);
    };

    // 여기서 file이 왜 document.getElementById("File").value랑 동등한 역할을 하는거지? -> isfile에 context를 할당해서 그런것 같다 [240223]
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
                  <Input id="File" type="file" onChange={handleFileChange} accept=".yaml" />
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
                  <FormText>
                  Pipeline names can only contain alphabetic characters, including -.
                  </FormText>
                </FormGroup>

                <FormGroup>
                  <Label for="exampleText">3. Description</Label>
                  <Input 
                    id="Description" 
                    name="Description" 
                    placeholder="Pipeline Description"
                    type="Text" 
                    onChange={handleDescChange}
                  />
                  <FormText>
                  Write Pipeline Description (Pipeline Role, Parameter information).
                  </FormText>
                </FormGroup>
                <Button type="button" className="btn" color="primary" size="sm" outline onClick={Next} disabled={ Vaild_input }>Next</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };
  
  export default Forms; 