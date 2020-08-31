import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import history from "../../history";
import "./styles.css";
// redux
import { connect } from "react-redux";
import { logInUser, clearErrors } from "../../redux/actions/userActions";

const SignIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogIn = (event) => {
    event.preventDefault();
    props.logInUser({ email, password }, history);
  };
  useEffect(() => {
    return () => {
      props.clearErrors();
    };
  }, []);
  return (
    <div className="signin-container ">
      <h2 className="signin-heading">LogIn</h2>
      <Form onSubmit={handleLogIn}>
        <FormGroup row>
          <Label for="email" sm={2}>
            Email
          </Label>
          <Col sm={10}>
            <Input
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              name="email"
              id="email"
              placeholder="example@example.com"
              required
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="password" sm={2}>
            Password
          </Label>
          <Col sm={10}>
            <Input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              name="password"
              id="password"
              placeholder="password"
              required
            />
          </Col>
        </FormGroup>

        <FormGroup check row>
          <Col className="px-0" sm={{ size: 10, offset: 2 }}>
            <Button className="signin-button" disabled={props.UI.loading}>
              {props.UI.loading === true ? (
                <div className="spinner-border text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "LogIn"
              )}
            </Button>
          </Col>
        </FormGroup>
        {props.UI.errors && (
          <div className="row">
            <Col className="mt-2" sm={{ size: 10, offset: 2 }}>
              <div className="alert alert-danger" role="alert">
                {props.UI.errors}
              </div>
            </Col>
          </div>
        )}
      </Form>
      <span>
        New user? SignUp <Link to="/signup">here</Link>
      </span>
    </div>
  );
};
const mapStateToProps = (state) => ({
  UI: state.UI,
});

export default connect(mapStateToProps, { logInUser, clearErrors })(SignIn);
