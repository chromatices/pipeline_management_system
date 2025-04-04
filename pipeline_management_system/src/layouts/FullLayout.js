import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container, Row, Col } from "reactstrap";
import Sidebar from "./Sidebar"; // Sidebar를 Outlet 내부에서 사용

const FullLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (sidebarRef.current) {
      sidebarRef.current.classList.toggle("showSidebar");
    }
  };

  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        {/********Content Area**********/}
        <div className="contentArea">
          {/********Header**********/}
          <Header toggleSidebar={toggleSidebar} />
          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <Row>
              {/* Sidebar를 Outlet 내부에 포함하고, 기존 sidebar 스타일 유지 */}
              <Col lg="3" className={`sidebarArea ${isSidebarOpen ? "showSidebar" : ""}`} ref={sidebarRef}>
                <Sidebar toggleSidebar={toggleSidebar} />
              </Col>
              <Col lg="9">
                <Outlet />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;