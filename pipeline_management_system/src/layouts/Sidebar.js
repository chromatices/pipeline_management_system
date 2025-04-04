import { Button, Nav, NavItem } from "reactstrap";
import { NavLink, useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Dashboards",
    href: "/starter",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Pipeline",
    href: "/pipeline",
    icon: "bi bi-bezier2",
  },
];

const Sidebar = ({ toggleSidebar }) => {
  let location = useLocation();

  return (
    <div className="p-40">
      <div className="d-flex align-items-center">
        <span className="ms-auto d-lg-none">
          <Button
            color="white"
            size="sm"
            className="ms-auto d-lg-none"
            onClick={toggleSidebar}
          >
            <i className="bi bi-door-closed"></i>
          </Button>
        </span>
      </div>
      <div className="pt-1 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
            <NavLink
              to={navi.href}
              className={
                location.pathname.split("/")[1] === navi.href.split("/")[1]
                  ? "text-secondary nav-link py-3 active-link" // 반전된 색상
                  : "text-non-active nav-link py-3"
              }
            >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};
export default Sidebar;