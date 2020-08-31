import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import history from "../../history";
import "./styles.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Button,
} from "reactstrap";
// redux
import { connect } from "react-redux";
import { logOutUser } from "../../redux/actions/userActions";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    props.logOutUser();
    // history.push("/signin");
    props.socket.emit("logOut", {}, (error) => {
      if (error) alert(error.message);
    });
  };
  // props.socket.emit("bro", { message: "helloooooo" });
  return (
    <div>
      <Navbar className="nav-bar" dark expand="md">
        <NavLink className="navbar-brand" to="/">
          Social App
        </NavLink>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              {props.user.authenticated ? null : (
                <NavLink className="nav-link" to="/signin">
                  SignIn
                </NavLink>
              )}
            </NavItem>
            <NavItem>
              {props.user.authenticated ? null : (
                <NavLink className="nav-link" to="/signup">
                  SignUp
                </NavLink>
              )}
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {props.user.authenticated ? (
            <Button onClick={handleLogout} className="nav-link log-out-button">
              Log Out
            </Button>
          ) : null}
        </Collapse>
      </Navbar>
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { logOutUser })(NavBar);
