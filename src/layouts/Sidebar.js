import Logo from "./Logo";
import { Button, Nav, NavItem } from "reactstrap";
import { NavLink, useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Dashboards",
    href: "/starter",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Workflows",
    href: "/workflows",
    icon: "bi bi-bezier2",
  },
];

const Sidebar = () => {

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar")
    ;
  };
  let location = useLocation();

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <span className="ms-auto d-lg-none">
        <Button
          color='white'
          size="sm"
          className="ms-auto d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i class="bi bi-door-closed"></i>
        </Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <NavLink
                to={navi.href}
                className={
                  location.pathname.split('/')[1] === navi.href.split('/')[1]
                    ? "text-primary nav-link py-3"
                    : "nav-link text-secondary py-3"
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