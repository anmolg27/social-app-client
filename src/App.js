import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

// Redux
import { connect } from "react-redux";
// import store from "./redux/store";
// import { SET_AUTHENTICATED } from "./redux/types";
// import { getUserData } from "./redux/actions/userActions";

// components
import Home from "./components/home/home";
import SignUp from "./components/signUp/signUp";
import SignIn from "./components/signIn/signIn";
import NavBar from "./components/navBar/NavBar";

// utils
import AuthRoute from "./util/AuthRoute";
import AuthRouteSignUpOrIn from "./util/AuthRouteSignUpOrIn";

// const token = localStorage.IdToken;
// if (token) {
//   const decodedToken = jwtDecode(token);
//   // store.dispatch({ type: SET_AUTHENTICATED });
//   axios.defaults.headers.common["Authorization"] = token;
//   store.dispatch(getUserData());
// }
const END_POINT = "http://localhost:4000";
let socket;
socket = io(END_POINT);
function App(props) {
  const { authenticated, name, _id } = props;
  useEffect(() => {
    if (authenticated === true) {
      socket.emit("isOnline", { name, id: _id }, (error) => {
        if (error) alert(error.message);
      });
      console.log(localStorage.IdToken);
    }
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [END_POINT, name, authenticated]);
  return (
    <div className="App">
      <NavBar socket={socket} />
      <Switch>
        <AuthRoute exact path="/" component={() => <Home socket={socket} />} />
        <AuthRouteSignUpOrIn exact path="/signup" component={SignUp} />
        <AuthRouteSignUpOrIn exact path="/signin" component={SignIn} />
      </Switch>
    </div>
  );
}
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  name: state.user.credentials.name,
  _id: state.user.credentials._id,
});
export default connect(mapStateToProps)(App);
