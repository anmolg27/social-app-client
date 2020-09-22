import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Field, reduxForm } from "redux-form";
import "./styles.css";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

// redux
import { connect } from "react-redux";
import { signupUser, clearErrors } from "../../redux/actions/userActions";

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required Field!";
  } else if (values.name.length > 15) {
    errors.name = "Name should be less than 15 chracters!";
  } else if (values.name.length < 4) {
    errors.name = "Name should atleast contain 4 characters!";
  }
  if (!values.password || values.password.length < 8) {
    errors.password = "Password must contain atleast 8 characters!";
  }
  if (!values.email) {
    errors.email = "Required Field!";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address!";
  }
  if (!values.confirmPassword || values.confirmPassword !== values.password) {
    errors.confirmPassword = "Password is not matching!";
  }
  if (!values.age) {
    errors.age = "Required Field!";
  } else if (
    values.age < 1 ||
    parseFloat(values.age) !== Math.round(values.age) ||
    values.age > 120
  ) {
    errors.age = "invalid Age!";
  }
  return errors;
};
const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
  required,
}) => (
  <Fragment>
    <FormGroup className="mb-0 py-1" row>
      <Label sm={3}>{label}</Label>
      <Col sm={9}>
        {touched ? (
          error ? (
            <>
              <Input
                invalid
                {...input}
                type={type}
                placeholder={label}
                required={required}
              />
              <FormFeedback>{error}</FormFeedback>
            </>
          ) : (
            <>
              <Input
                valid
                {...input}
                type={type}
                placeholder={label}
                required={required}
              />
              <FormFeedback valid></FormFeedback>
            </>
          )
        ) : (
          <Input
            {...input}
            type={type}
            placeholder={label}
            required={required}
          />
        )}
      </Col>
    </FormGroup>
    {/* {touched && error && (
      <div className="row">
        <Col sm={{ size: 9, offset: 3 }}>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </Col>
      </div>
    )} */}
  </Fragment>
);

class SignUp extends Component {
  handleGenderSelect = (event) => {
    // document.querySelector("").classList.toggle;
    // console.log(event.target.parentElement.classList);
    event.target.parentElement.classList.add("gender-checked");
    const length = event.target.parentElement.parentElement.children.length;
    const dom = event.target.parentElement.parentElement.children;
    for (let i = 0; i < length; i++) {
      if (dom[i].children[0].checked === false) {
        if (
          dom[i].children[0].parentElement.classList.value.includes(
            "gender-checked"
          )
        ) {
          dom[i].children[0].parentElement.classList.remove("gender-checked");
        }
        // console.log(dom[i].children[0].parentElement.classList.value);
      }
      // console.log(dom[i].children[0].checked);
    }
  };
  onSubmit = (formValues) => {
    // console.log(formValues);
    // event.preventDefault();
    this.props.signupUser(formValues, this.props.history);
  };
  componentWillUnmount() {
    this.props.clearErrors();
  }
  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <div className="signup-container">
        <h2 className="signup-heading">SignUp</h2>
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            id="name"
            name="name"
            type="text"
            component={renderField}
            label="User name"
          />
          <Field
            id="email"
            name="email"
            type="email"
            component={renderField}
            label="Email"
          />
          <Field
            id="password"
            name="password"
            type="password"
            component={renderField}
            label="Password"
          />
          <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            component={renderField}
            label="Confirm password"
          />
          <Field
            id="age"
            name="age"
            type="number"
            component={renderField}
            label="Age"
          />
          <FormGroup className="mb-0 py-1" row>
            <Label sm={3}>Sex</Label>
            <Col sm={4} className="btn-group btn-group-toggle">
              <label className="btn btn-primary btn-radio">
                <Field
                  required
                  onClick={this.handleGenderSelect}
                  // className="radio-gender"
                  name="sex"
                  component="input"
                  type="radio"
                  value="male"
                />{" "}
                Male
              </label>
              <label className="btn btn-danger btn-radio">
                <Field
                  required
                  onClick={this.handleGenderSelect}
                  // className="radio-gender"
                  // className="button"
                  name="sex"
                  component="input"
                  type="radio"
                  value="female"
                />{" "}
                Female
              </label>
              <label className="btn btn-success btn-radio">
                <Field
                  required
                  onClick={this.handleGenderSelect}
                  name="sex"
                  component="input"
                  type="radio"
                  value="other"
                />{" "}
                Other
              </label>
            </Col>
          </FormGroup>

          {/* <Field
            id="dob"
            name="dob"
            type="date"
            component={renderField}
            label="Date of birth"
            required={true}
          /> */}
          {/* <FormGroup className="mb-0 py-1" row>
            <Label sm={3}>Gender</Label>
            <Col sm={9}>
              <select name="gender" className="form-control">
                <option value="none">none</option>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
            </Col>
          </FormGroup> */}
          <FormGroup check row>
            <Col className="px-0" sm={{ size: 9, offset: 3 }}>
              <Button
                className="signup-button"
                disabled={this.props.UI.loading}
              >
                {this.props.UI.loading === true ? (
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "LogIn"
                )}
              </Button>
            </Col>
          </FormGroup>
          {this.props.UI.errors && (
            <div className="row">
              <Col sm={{ size: 9, offset: 3 }}>
                <div className="alert alert-danger" role="alert">
                  {this.props.UI.errors}
                </div>
              </Col>
            </div>
          )}
        </Form>
        <span>
          Already have an account? Log In <Link to="/signin">here</Link>
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, { signupUser, clearErrors })(
  reduxForm({
    form: "signUpForm",
    validate,
  })(SignUp)
);
