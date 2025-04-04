import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import imgfile from "../assets/images/logos/strato.png";
import user1 from "../assets/images/users/user1.jpg";

const Header = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <Navbar className="title-wrapper" color="header" dark expand="lg">
      {/* 데스크톱에서는 기본 Logo, 모바일에서는 다른 로고 사용 */}
      <div className="title-wrapper">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={imgfile} className="logo-image" alt="Logo" />
          <span className="title-text">ML Workload Portal</span>
        </Link>
      </div>
      {/* <div className="d-lg-none">
        <NavbarBrand href="/">
          <Link to="/">
            <img src={imgfile} width="50px" height="34px" alt="Logo"></img>
          </Link>
        </NavbarBrand>
      </div> */}

      {/* 모바일에서 Sidebar 토글 버튼 */}
      <div className="d-flex align-items-center">
        <Button
          color="header"
          className="d-lg-none"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>

      {/* 프로필 및 기타 버튼 */}
      <div className="hstack gap-2">
        <Button
          color="header"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={toggleNavbar}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          {/* <NavItem>
            <Link to="/starter" className="nav-link">
              Dashboards
            </Link>
          </NavItem> */}
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle color="header">
            <img
              src={user1}
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <DropdownItem>My Account</DropdownItem>
            <DropdownItem>Edit Profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>My Balance</DropdownItem>
            <DropdownItem>Inbox</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>
    </Navbar>
  );
};

export default Header;