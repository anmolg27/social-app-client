import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
const AuthRoute = ({
  component: Component,
  authenticated,
  loading,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        loading === false && authenticated === false ? (
          <Redirect to="/signin" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

const mapStateToProps = (state) => ({
  loading: state.user.loading,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(AuthRoute);
