import React from "react";
import { connect } from "react-redux";
function SideNav(props) {
  return (
    <div className="side-nav">
      <h3 className="pl-2 pt-3" style={{ color: "rgb(2, 99, 99)" }}>
        Welcome
      </h3>

      <div
        style={{ marginLeft: "5px", paddingTop: "20px", paddingLeft: "0px" }}
      >
        <a className="nav-link side-nav-link" href="/">
          <i className="fa fa-home" aria-hidden="true"></i>
          <span>Home</span>
        </a>
        <a
          className="nav-link side-nav-link mt-2"
          href={`/user/${props.user.credentials._id}`}
        >
          <i className="fa fa-user" aria-hidden="true"></i>
          <span>Profile</span>
        </a>
        <a className="nav-link side-nav-link mt-2" href="/friends">
          <i className="fa fa-users" aria-hidden="true"></i>
          <span>Friends</span>
        </a>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(SideNav);
