import React from "react";
import ReactDOM from "react-dom";
// import "./styles.css";

import jwtDecode from "jwt-decode";
import axios from "axios";

import { Router } from "react-router-dom";
import App from "./App";
import history from "./history";
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { getUserData } from "./redux/actions/userActions";

const token = localStorage.IdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  // store.dispatch({ type: SET_AUTHENTICATED });
  axios.defaults.headers.common["Authorization"] = token;
  store.dispatch(getUserData());
}

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById("root")
);
