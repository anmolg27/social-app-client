import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Profile from "./profile";
import Wall from "./wall";
import SideNav from "./sideNav";
import "./styles.css";
// redux
import { getFriends } from "../../redux/actions/friendsActions";
import { connect } from "react-redux";
class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <Row>
          <div className="px-0  container col-md-2 d-md-block d-none order-md-1">
            <div className="side-nav-container">
              <SideNav />
            </div>
          </div>
          <div className="mt-3 pl-4 col-md-7 col-12 order-md-2 order-2">
            <Wall socket={this.props.socket} />
          </div>
          <div className="mt-3 col-md-3 d-md-block order-md-3 order-1">
            <Profile user={this.props.user} />
          </div>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { getFriends })(Home);
