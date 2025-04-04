import YAML from "yamljs";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Modal,
  ModalHeader,
  ModalBody,
  Table
} from "reactstrap";



const Forms = () => {

  const [Resources, setResources] = useState([]);
  const [recommend, setrecommend] = useState([]);
  const [adjustedrecommend, setAdjustedrecommend] = useState([]); // 조정된 recommend 상태 추가
  const [adjustedrecommendMap, setAdjustedrecommendMap] = useState({}); // feature별 저장된 조정 값
  const originalrecommend = useRef([]); // 원본 recommend 저장

  
  const [Pipeline, setPipeline] = useState({});
  const [Parameters, setParameters] = useState([]);
  const [checkItems, setCheckItems] = useState(false);
  const [featureList, setFeatureList] = useState([]);
  const [selected, setSelected] = useState("None");
  const [feature, setFeature] = useState("0"); // ID로 사용하기 위해 문자열 "0"으로 초기화
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedResources, setSubmittedResources] = useState([]);

  const toggleModal = () => setIsOpen(!isOpen);

  const typeList = [
    { value: "None", name: "None" },
    { value: "ML", name: "Machine Learning" },
    { value: "DL", name: "Deep Learning" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const { file, name, description } = location.state;

  // YAML to JSON 변환
  const yaml_obj = YAML.parse(file);
  const yaml_to_json = JSON.stringify(yaml_obj);

  useEffect(() => {
    getMlFeature();
    initializerecommend(yaml_to_json);
  }, []);

  // feature 변경 시 조정된 recommend 업데이트
  useEffect(() => {
    adjustrecommendBasedOnFeature();
  }, [feature, recommend]);

  const initializerecommend = async (json_str) => {
    setIsLoading(true); // 로딩 시작
    const resource_post_url = '/api/v1/predict';
    try {
      const receivedJson = JSON.parse(json_str);
      const response = await axios.post(resource_post_url, receivedJson.spec.templates, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Content-Type": "application/json",
        },
      });
      const predict_resource = response.data.items;
      setrecommend(predict_resource);
      console.log(predict_resource);
    } catch (error) {
      console.error("Error processing the pipeline data:", error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  const getMlFeature = async () => {
    const ml_feature_url = process.env.REACT_APP_FEATURE_REQUEST;
    const response = await axios.get(ml_feature_url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json",
      },
    });
    const ml_feature = response.data;
    const featureList = ml_feature.message === "success" && Array.isArray(ml_feature.result)
      ? ml_feature.result.map(item => ({ level: item.id, name: item.name }))
      : [];
    const updatedFeatureList = [{ level: "0", name: "None" }, ...featureList];
    setFeatureList(updatedFeatureList);
  };

  // CPU와 메모리 값을 파싱하고 조정하는 유틸리티 함수
  const adjustResourceValue = (value, featureId) => {
  if (featureId === "0" || value == null) return value; // id가 0이거나 null이면 원래 값 유지

  const isMemory = value.endsWith("M") || value.endsWith("G");
  const unit = isMemory ? value.slice(-1) : "";
  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return value; // 숫자로 변환 불가 시 원래 값 유지
  }

  const adjustment = numValue * (Math.random() * 0.5 - 0.25);
  const adjustedValue = numValue + adjustment;

  return isMemory
    ? `${Math.round(adjustedValue)}${unit}`
    : `${adjustedValue.toFixed(2)}`;
};

  const adjustrecommendBasedOnFeature = () => {
    if (!originalrecommend.current.length) {
      originalrecommend.current = JSON.parse(JSON.stringify(recommend)); // 깊은 복사하여 원본 저장
    }
    if (feature === "0") {
      setAdjustedrecommend(JSON.parse(JSON.stringify(originalrecommend.current))); // 원본 복사 후 할당
    } else {
      // 이미 feature에 대한 조정 값이 있다면 사용, 없으면 새로 계산
      if (adjustedrecommendMap[feature]) {
        setAdjustedrecommend(JSON.parse(JSON.stringify(adjustedrecommendMap[feature])));
        return;
      }
      const adjusted = originalrecommend.current.map(item => {
        if (!item.container?.resources) return { ...item }; // 객체 복사
        const newResources = JSON.parse(JSON.stringify(item.container.resources)); // 깊은 복사
        Object.keys(newResources).forEach(specName => {
          const resourceObj = newResources[specName];
          Object.keys(resourceObj).forEach(fieldName => {
            if (fieldName !== "nvidia.com/gpu") {
              resourceObj[fieldName] = adjustResourceValue(resourceObj[fieldName], feature);
            }
          });
        });
        return { ...item, container: { ...item.container, resources: newResources } };
      });

      // feature별 조정된 값 저장 (깊은 복사)
      setAdjustedrecommendMap(prev => ({ ...prev, [feature]: JSON.parse(JSON.stringify(adjusted)) }));
      setAdjustedrecommend(adjusted);
    }
  };

  useEffect(() => {
    updatePipeline(yaml_to_json);
  }, []);

  const updatePipeline = async (json_str) => {
    try {
      const receivedJson = JSON.parse(json_str);

      // ...... post_pipeline ............ setrecommend ......
      var str_obj = receivedJson.metadata.annotations["pipelines.kubeflow.org/pipeline_spec"];
      var json_obj = JSON.parse(str_obj.replace(/\n+/g, " "));
      receivedJson.metadata.annotations["pipelines.kubeflow.org/pipeline_spec"] = json_obj;

      const ensureResourceField = (resource, field, defaultValues) => {
        if (!resource[field]) {
          resource[field] = { ...defaultValues };
        } else {
          Object.keys(defaultValues).forEach((key) => {
            if (!resource[field][key]) {
              resource[field][key] = defaultValues[key];
            }
          });
        }
      };

  const updatedTemplates = receivedJson.spec.templates.map((item) => {
    if (item.container) {
      // Ensure container resources exist and initialize them
      if (!item.container.resources) {
        item.container.resources = { limits: { cpu: "0", memory: "0M" }, requests: { cpu: "0", memory: "0M" } };
      }
      ensureResourceField(item.container.resources, "limits", { cpu: "0", memory: "0M" });
      ensureResourceField(item.container.resources, "requests", { cpu: "0", memory: "0M" });

      // .................. ...... ......... ............ ......... ............ ... ......... ......
      if (!item.metadata.labels['ml.workload.group']) {
        item.metadata.labels['ml.workload.group'] = name; // name: PMS .................. ...... ......... ............... ......
      }
    }
    return item;
    });

      setResources(receivedJson.spec.templates)
      receivedJson.metadata.annotations["pipelines.kubeflow.org/pipeline_spec"].description = description;
      receivedJson.metadata.annotations["pipelines.kubeflow.org/pipeline_spec"].name = name;
      receivedJson.metadata.generateName = name + "-";

      receivedJson.metadata.annotations["pipelines.kubeflow.org/pipeline_spec"] = JSON.stringify(
        receivedJson.metadata.annotations["pipelines.kubeflow.org/pipeline_spec"]
      );

      if (receivedJson.spec?.arguments?.parameters?.length > 0) {
        setParameters(receivedJson.spec.arguments.parameters[0]);
      } else {
        setParameters([]);
      }

      setPipeline(receivedJson);
    } catch (error) {
      console.error("Error updating the pipeline data:", error);
    }
  };

  const handlerResource = (key, value, index, specName) => {
    setResources((prevResources) => {
      const updatedResources = [...prevResources];
      updatedResources[index].container.resources[specName][key] = value;
      return updatedResources;
    });
  };

  const handlerParameter = (key, value) => {
    setParameters((prevParameters) => {
      const updatedParameters = { ...prevParameters, [key]: value };
      return updatedParameters;
    });
  };

  const handlerCheckItem = (isChecked) => setCheckItems(isChecked);
  const handleSelect = (isSelected) => setSelected(isSelected);
  const handleFeature = (isFeature) => setFeature(isFeature);

  const Submit = async ({ pipeline }) => {
    if (isLoading) return; // 로딩 중이면 실행 방지
    setSubmittedResources(Resources);
    toggleModal();
  };

  const confirmSubmit = async () => {
    const submit_url = "/submit";
    try {
      const base64Pipeline = btoa(JSON.stringify(Pipeline));
      const postData = {
        yaml: base64Pipeline,
        metadata: { name, description, checkpoint: checkItems, workloadType: selected, workloadFeature: feature },
      };
      const response = await axios.post(submit_url, postData, { headers: { "Content-Type": "application/json" } });

      if (response.data.message.toLowerCase() === "success") {
        toggleModal(); // 모달 닫기
        navigate(location.pathname.includes("pipeline") ? "/pipeline" : "/starter");
      }
    } catch (error) {
      console.error("Error posting pipeline: ", error);
    }
  };

  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-bezier me-2"> </i>
            Create Workflow
          </CardTitle>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="Set-Resource">4. Set Workload Features</Label>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Input
                    type="checkbox"
                    checked={checkItems}
                    onChange={(e) => handlerCheckItem(e.target.checked)}
                    style={{ marginLeft: '10px', marginRight: '10px' }}
                  />
                  <span>Checkpoint Usage</span>
                </div>
                <div>
                  <span style={{ marginLeft: '10px', marginRight: '10px', width: '200px' }}>ML Workload Type</span>
                  <select
                    className="form-select"
                    onChange={(e) => handleSelect(e.target.value)}
                    value={selected}
                    style={{ marginLeft: '10px', marginRight: '10px', width: '200px' }}
                  >
                    {typeList.map((item) => (
                      <option value={item.value} key={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormText style={{ marginLeft: '10px', marginRight: '10px', width: '200px' }}>
                    Choose Workload Type [ML, DL, None].
                  </FormText>
                </div>
                <div>
                  <span style={{ marginLeft: '10px', marginRight: '10px', width: '200px' }}>Workload Feature</span>
                  <select
                    className="form-select"
                    onChange={(e) => handleFeature(e.target.value)}
                    value={feature}
                    style={{ marginLeft: '10px', marginRight: '10px', width: '200px' }}
                  >
                    {featureList.map((item) => (
                      <option value={item.level} key={item.level}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormText style={{ marginLeft: '10px', marginRight: '10px', width: '200px' }}>
                    Choose Workload Feature.
                  </FormText>
                </div>
                <div>
                  <Label for="Set-Resource">5. Set Cluster Resource</Label>
                  {Resources?.length > 0 &&
                    Resources.map((resourceItem, index) => {
                      const recommendItem = adjustedrecommend[index] || recommend[index]; // 조정된 값 사용
                      return (
                        <div key={`resource-${index}`}>
                          {resourceItem.container && (
                            <b style={{ color: 'RoyalBlue', fontWeight: 'bold' }}>{resourceItem.name}</b>
                          )}
                          {resourceItem.container?.resources &&
                            Object.entries(resourceItem.container.resources).map(([specName, resourceObj]) => (
                              <div key={`${index}-${specName}`}>
                                <b>{specName}:</b>
                                <br />
                                {Object.entries(resourceObj)
                                  .sort(([a], [b]) => {
                                    const order = ["cpu", "memory"];
                                    return order.indexOf(a) - order.indexOf(b);
                                  })
                                  .map(([fieldName, fieldValue]) => {
                                    const recommendValue = recommendItem?.container?.resources?.[specName]?.[fieldName] || 'No Recommend';
                                    return (
                                      <div key={`${index}-${specName}-${fieldName}`} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>{fieldName}:</label>
                                        <Input
                                          type="text"
                                          defaultValue={fieldValue}
                                          onChange={(e) =>
                                            handlerResource(fieldName, e.target.value, index, specName)
                                          }
                                          style={{
                                            width: '180px',
                                            height: '30px',
                                            display: 'block',
                                            marginBottom: '0px',
                                          }}
                                        />
                                        <span
                                          style={{
                                            color: 'OrangeRed',
                                            fontWeight: 'bold',
                                            display: 'block',
                                            marginTop: '0px',
                                          }}
                                        >
                                          recommend: {recommendValue}
                                        </span>
                                      </div>
                                    );
                                  })}
                              </div>
                            ))}
                        </div>
                      );
                    })}
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="Set-Parameter">6. Set Pipeline Parameters</Label>
                <div>
                  {Object.keys(Parameters).length > 0 ? (
                    Object.keys(Parameters).map((item, index) => (
                      <div key={index}>
                        <label>{item}:</label>
                        <Input
                          type="text"
                          defaultValue={Parameters[item]}
                          onChange={(e) => handlerParameter(item, e.target.value)}
                          style={{ width: '230px', height: '40px' }}
                        />
                      </div>
                    ))
                  ) : (
                    <p>There is no parameters in pipeline</p>
                  )}
                </div>
              </FormGroup>
              <div>
                <Button 
                  color="primary" 
                  onClick={() => Submit({ pipeline: Pipeline })} 
                  disabled={isLoading} // 로딩 중 비활성화
                >
                  {isLoading ? "Loading..." : "Create Run"}
                </Button>
                <Modal isOpen={isOpen} toggle={toggleModal} size="xl" centered>
                  <ModalHeader toggle={toggleModal} style={{ backgroundColor: '#344A63', color: 'white'}}> Workload Information</ModalHeader>
                  <ModalBody>
                    <h5>Workload Metadata</h5>
                    <div style={{ marginBottom: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                      <p style={{ marginBottom: '1px' }}><strong>Name:</strong> {name}</p>
                      <p style={{ marginBottom: '3px' }}><strong>Description:</strong> {description}</p>
                      <p style={{ marginBottom: '3px' }}><strong>Checkpoint Usage:</strong> {checkItems ? "Yes" : "No"}</p>
                      <p style={{ marginBottom: '3px' }}><strong>Workload Type:</strong> {typeList.find(item => item.value === selected)?.name || "N/A"}</p>
                      <p style={{ marginBottom: '3px' }}><strong>Workload Feature:</strong> {featureList.find(item => item.level === feature)?.name || "N/A"}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 20, fontWeight: "bolder" }}>Requests</span>
                      <span style={{ color: "red", fontStyle: "italic" }}>* recommended resources</span>
                    </div>
                    {/* <div style={{textAlign:"right"}}>
                      <span style={{ color: "red", textAlign:"right"}}> * recommended resources</span>
                    </div> */}
                    
                    <Table bordered>
                      <thead>
                        <tr>
                          <th>Container</th>
                          <th>CPU</th>
                          <th>Memory</th>
                          <th>GPU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submittedResources.map((resource, index) => {
                          const containerName = resource.name;
                          const recommendItem = adjustedrecommend[index] || recommend[index];
                          if (resource.container) {
                            const current_requests = resource.container.resources?.requests || {};
                            const recommend_requests = recommendItem.container.resources?.requests;
                            return (
                              <tr key={index}>
                                <td>{containerName}</td>
                                <td>
                                  {current_requests.cpu || "-"}{" "}
                                  {recommend_requests.cpu && (
                                    <span style={{ color: "red"}}>({recommend_requests.cpu})</span>
                                  )}
                                </td>
                                <td>
                                  {current_requests.memory || "-"}{" "}
                                  {recommend_requests.memory && (
                                    <span style={{ color: "red"}}>({recommend_requests.memory})</span>
                                  )}
                                </td>
                                <td>{current_requests["nvidia.com/gpu"] || "-"}</td>
                              </tr>
                            );
                          }
                          return null; // container가 없을 경우, 아무것도 렌더링하지 않음
                        })}
                      </tbody>
                    </Table>
                    <span style={{ fontSize: 20, fontWeight: 'bolder' }}>
                      Limits
                    </span>
                    <Table bordered>
                      <thead>
                        <tr>
                          <th>Container</th>
                          <th>CPU</th>
                          <th>Memory</th>
                          <th>GPU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submittedResources.map((resource, index) => {
                          const containerName = resource.name;
                          const recommendItem = adjustedrecommend[index] || recommend[index];
                          if (resource.container) {
                            const current_limits = resource.container.resources?.limits || {};
                            const recommend_limits = recommendItem.container.resources?.limits;
                            return (
                              <tr key={index}>
                                <td>{containerName}</td>
                                <td>
                                  {current_limits.cpu || "-"}{" "}
                                  {recommend_limits.cpu && (
                                    <span style={{ color: "red"}}>({recommend_limits.cpu})</span>
                                  )}
                                </td>
                                <td>{current_limits.memory || "-"}{" "}
                                  {recommend_limits.memory && (
                                    <span style={{ color: "red"}}>({recommend_limits.memory})</span>
                                  )}</td>
                                <td>{current_limits["nvidia.com/gpu"] || "-"}{" "}
                                  {recommend_limits["nvidia.com/gpu"] && (
                                    <span style={{ color: "red"}}>({recommend_limits["nvidia.com/gpu"]})</span>
                                  )}</td>
                              </tr>
                            );
                          }
                          return null; // container가 없을 경우, 아무것도 렌더링하지 않음
                        })}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-end">
                      <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                      <Button color="primary" className="ms-2" onClick={confirmSubmit}>Confirm Submit</Button>
                    </div>
                  </ModalBody>
                </Modal>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Forms;