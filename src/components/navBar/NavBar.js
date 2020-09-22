import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Notifications from "./notifications";
import axios from "axios";
import history from "../../history";
import "./styles.css";
import {
  Collapse,
  CardBody,
  Card,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Button,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from "reactstrap";
// redux
import { connect } from "react-redux";
import { logOutUser } from "../../redux/actions/userActions";

const NavBar = (props) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unseenNotificationsCount, setUnseenNotificationsCount] = useState(0);
  const [deviceWidth, setDeviceWidth] = useState(
    document.querySelector("body").clientWidth
  );
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  useEffect(() => {
    axios
      .get("/unseenNotificationsCount")
      .then((res) => {
        setUnseenNotificationsCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
        // alert("Something went wrong. Please refresh or try again later");
      });
  }, []);
  useEffect(() => {
    document.querySelector("body").addEventListener("click", (event) => {
      if (!event.target.className.includes("inside-notification")) {
        setIsNotificationOpen(false);
      }
    });
  }, []);

  const toggleNotification = () => {
    if (isNotificationOpen === false) {
      setLoading(true);
      axios
        .get("/notifications")
        .then((res) => {
          setNotifications(res.data.reverse());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          // alert("Something went wrong. Please refresh or try again later");
        });
    }

    setIsNotificationOpen(!isNotificationOpen);
  };
  const handleSearch = () => {
    let text = document.querySelector(".nav-search-input").value;
    history.push(`/search?q=${text}`);
  };
  useEffect(() => {
    if (document.querySelector(".nav-search-input")) {
      document
        .querySelector(".nav-search-input")
        .addEventListener("keyup", (event) => {
          if (event.keyCode === 13) {
            handleSearch();
          }
        });
    }
  });

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const toggle = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    history.push("/signin");
    // console.log("logout clicked");
    props.logOutUser(history);

    props.socket.emit("logOut", {}, (error) => {
      if (error) alert(error.message);
    });
    history.push("/signin");
  };
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });
  useEffect(() => {
    window.addEventListener("resize", () => {
      setDeviceWidth(document.querySelector("body").clientWidth);
    });
  });
  const navBarClasses = ["nav-bar"];
  if (scrolled) {
    navBarClasses.push("scrolled");
  }

  return (
    <Navbar className={navBarClasses.join(" ")} dark expand="md">
      <a className="navbar-brand " style={{ padding: "0px" }} href="/">
        <img src="/images/my_logo.png" height={40} />
      </a>

      {props.user.authenticated && deviceWidth < 768 ? (
        <>
          <InputGroup
            style={{
              width: "fit-content",
              // transform: "translateX(-60px)",
              position: "absolute",
              left: "60px",
              top: "10px",
            }}
          >
            <input
              className="form-control nav-search-input"
              placeholder="Can also do blank search!"
            />
            <InputGroupAddon addonType="append">
              <InputGroupText
                onClick={handleSearch}
                style={{ cursor: "pointer", backgroundColor: "white" }}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <>
            <button
              style={{ position: "absolute", right: "80px", top: "7px" }}
              onClick={toggleNotification}
              className="inside-notification notification-icon px-3"
            >
              {unseenNotificationsCount === 0 ? (
                <i
                  className="inside-notification fa fa-bell-o"
                  aria-hidden="true"
                ></i>
              ) : (
                <i
                  style={{ color: "rgb(255, 89, 38)" }}
                  className="inside-notification fa fa-bell-o "
                  aria-hidden="true"
                >
                  <span className="inside-notification notification-number">
                    {unseenNotificationsCount}
                  </span>
                </i>
              )}
            </button>
            <Collapse
              className="inside-notification"
              isOpen={isNotificationOpen}
              style={{
                position: "absolute",
                top: "55px",
                right: "0px",
                zIndex: "8",
                width: "100vw",
              }}
            >
              <div className="inside-notification notifications-container">
                <>
                  {isNotificationOpen === true ? (
                    <Notifications
                      setIsNotificationOpen={setIsNotificationOpen}
                      setUnseenNotificationsCount={setUnseenNotificationsCount}
                      notifications={notifications}
                      loading={loading}
                      socket={props.socket}
                    />
                  ) : null}
                </>
              </div>
            </Collapse>
          </>
        </>
      ) : null}
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          {props.user.authenticated && deviceWidth < 768 ? (
            <>
              <a
                style={{ backgroundColor: "rgba(0,0,0,0)" }}
                className="nav-link side-nav-link"
                href="/"
              >
                <i className="fa fa-home" aria-hidden="true"></i>
                <span>Home</span>
              </a>
              <a
                style={{ backgroundColor: "rgba(0,0,0,0)" }}
                className="nav-link side-nav-link mt-2"
                href={`/user/${props.user.credentials._id}`}
              >
                <i className="fa fa-user" aria-hidden="true"></i>
                <span>Profile</span>
              </a>
              <a
                style={{ backgroundColor: "rgba(0,0,0,0)" }}
                className="nav-link side-nav-link mt-2"
                href="/friends"
              >
                <i className="fa fa-users" aria-hidden="true"></i>
                <span>Friends</span>
              </a>
              <DropdownItem divider />
              <NavItem>
                <Button
                  onClick={handleLogout}
                  className="nav-link log-out-button"
                >
                  Log Out
                </Button>
              </NavItem>
            </>
          ) : null}
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
        </Nav>
        {props.user.authenticated ? (
          deviceWidth >= 768 ? (
            <>
              <InputGroup style={{ width: "50%", position: "absolute" }}>
                <input
                  className="form-control nav-search-input"
                  placeholder="Can also do blank search!"
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText
                    onClick={handleSearch}
                    style={{ cursor: "pointer", backgroundColor: "white" }}
                  >
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <button
                onClick={toggleNotification}
                className="inside-notification notification-icon nav-item px-3"
              >
                {unseenNotificationsCount === 0 ? (
                  <i
                    className="inside-notification fa fa-bell-o "
                    aria-hidden="true"
                  ></i>
                ) : (
                  <i
                    style={{ color: "rgb(255, 89, 38)" }}
                    className="inside-notification fa fa-bell-o "
                    aria-hidden="true"
                  >
                    <span className="inside-notification notification-number">
                      {unseenNotificationsCount}
                    </span>
                  </i>
                )}
              </button>
              <Collapse
                className="inside-notification"
                isOpen={isNotificationOpen}
                style={{
                  position: "absolute",
                  top: "55px",
                  right: "0px",
                  zIndex: "8",
                  width: "35vw",
                }}
              >
                <div className="inside-notification notifications-container">
                  <>
                    {isNotificationOpen === true ? (
                      <Notifications
                        setIsNotificationOpen={setIsNotificationOpen}
                        setUnseenNotificationsCount={
                          setUnseenNotificationsCount
                        }
                        notifications={notifications}
                        loading={loading}
                        socket={props.socket}
                      />
                    ) : null}
                  </>
                </div>
              </Collapse>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle
                  className="nav-bar-dropdown-button"
                  tag="button"
                  data-toggle="dropdown"
                  aria-expanded={dropdownOpen}
                >
                  <i
                    className="fa fa-cogs settings-icon"
                    aria-hidden="true"
                  ></i>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem header>Header</DropdownItem>
                  <DropdownItem>Some Action</DropdownItem>
                  <DropdownItem disabled>Action (disabled)</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Foo Action</DropdownItem>
                  <DropdownItem>Bar Action</DropdownItem>
                  <DropdownItem>
                    <Button
                      onClick={handleLogout}
                      className="nav-link log-out-button"
                    >
                      Log Out
                    </Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : null
        ) : null}
      </Collapse>
    </Navbar>
  );
};
const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { logOutUser })(NavBar);
