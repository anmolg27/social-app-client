import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

// Redux
import { connect } from "react-redux";
import { getFriends } from "./redux/actions/friendsActions";
// components
import Home from "./components/home/home";
import SignUp from "./components/signUp/signUp";
import SignIn from "./components/signIn/signIn";
import NavBar from "./components/navBar/NavBar";
import SearchRes from "./components/searchResults/searchRes";
import UserProfile from "./components/userProfile/userProfile";
import Post from "./components/post/post";
import Friends from "./components/friends/friends";

// utils
import AuthRoute from "./util/AuthRoute";
import AuthRouteSignUpOrIn from "./util/AuthRouteSignUpOrIn";

const END_POINT = "http://localhost:4000";
let socket;
socket = io(END_POINT);
function App(props) {
  const { authenticated, name, _id } = props;
  useEffect(() => {
    if (authenticated === true) {
      socket.emit(
        "isOnline",
        { name, id: _id, token: localStorage.IdToken },
        (error) => {
          if (error) alert(error.message);
        }
      );
    }
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [END_POINT, name, authenticated]);
  useEffect(() => {
    if (authenticated) {
      props.getFriends();
    }
  }, [authenticated]);
  return (
    <div className="App">
      <NavBar socket={socket} />
      <Switch>
        <Route path="/search" component={SearchRes} />
        <Route
          path="/post/:postId"
          component={(props) => (
            <Post socket={socket} paramPostId={props.match.params.postId} />
          )}
        />
        <AuthRoute
          path="/user/:userId"
          component={(props) => (
            <UserProfile
              socket={socket}
              paramUserId={props.match.params.userId}
            />
          )}
        />
        <AuthRoute
          exact
          path="/friends"
          component={() => <Friends socket={socket} />}
        />

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
export default connect(mapStateToProps, { getFriends })(App);
