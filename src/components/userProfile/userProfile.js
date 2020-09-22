import React, { useState, useEffect } from "react";
import axios from "axios";
// import { connect } from "react-redux";
import SideNav from "../home/sideNav";
import { Row, Col } from "reactstrap";
import Wall from "./wall";
import Profile from "./profile";

import { connect } from "react-redux";

import { getAvatar } from "../../redux/actions/userActions";

function UserProfile(props) {
  const [user, setUser] = useState({ credentials: null });
  useEffect(() => {
    axios.get(`/users/${props.paramUserId}`).then((res) => {
      setUser({ credentials: res.data });
    });
    props.getAvatar(props.paramUserId);
  }, []);
  // console.log(props.match.params);

  return (
    <div className="home-container">
      <Row>
        <div className="px-0  container col-md-2 order-md-1 d-md-block d-none">
          <div className="side-nav-container">
            <SideNav />
          </div>
        </div>
        {/* <div className="pl-0 container col-md-2 d-md-block d-none"></div> */}
        <div className="mt-3 pl-4 col-md-7 col-12 order-md-2 order-2">
          <Wall paramUserId={props.paramUserId} socket={props.socket} />
        </div>
        <div className="mt-3 col-md-3 d-12 d-md-block order-md-3 order-1">
          <Profile user={user} paramUserId={props.paramUserId} />
          {/* proflie */}
        </div>
      </Row>
    </div>
  );
}

export default connect(null, {
  getAvatar,
})(UserProfile);
