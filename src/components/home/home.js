import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Profile from "./profile";
import Wall from "./wall";
import "./styles.css";
// redux
import { connect } from "react-redux";
class Home extends Component {
  render() {
    console.log("in home");
    return (
      <div className="home-container ">
        <Row>
          <div className="mt-3 col-sm-8 col-12">
            <Wall socket={this.props.socket} />
          </div>
          <div className="mt-3 col-sm-4 d-none d-md-block">
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

export default connect(mapStateToProps)(Home);
