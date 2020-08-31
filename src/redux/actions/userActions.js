import {
  SET_USER,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_USER,
  SET_UNAUTHENTICATED,
  SET_AVATAR,
  UNSET_AVATAR,
  CLEAR_POSTS,
  ADD_IMAGE,
} from "../types";
import axios from "axios";
export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/users", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch({ type: SET_USER, payload: res.data.user });
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      if (err.response.status === 500) {
        dispatch({
          type: SET_ERRORS,
          payload: "Server is down. Please try again later :(",
        });
      } else if (
        err.response.data.error &&
        err.response.data.error.startsWith("E11000")
      ) {
        dispatch({
          type: SET_ERRORS,
          payload: "email is already taken. Try signing up with another email!",
        });
      }
    });
};

export const logInUser = (data, history) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  dispatch({ type: LOADING_UI });
  axios
    .post("/users/login", data)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getAvatar(res.data.user._id));
      dispatch({ type: SET_USER, payload: res.data.user });
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      if (err.response.status === 500) {
        dispatch({
          type: SET_ERRORS,
          payload: "There is an internal server error. Please try again :(",
        });
      } else if (err.response.status === 400) {
        dispatch({
          type: SET_ERRORS,
          payload: "Wrong credentials. Please try again :(",
        });
      }
    });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/users/me")
    .then((res) => {
      dispatch(getAvatar(res.data._id));
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch((err) => {
      // console.log(err.response.status);
      console.log(err);
      if (err.response.status === 401) {
        dispatch(unsetAuthorizationHeader());
      } else if (err.response.status === 500) {
        alert("Internal server error! Please try again later :(");
      }
    });
};

export const getAvatar = (id) => (dispatch) => {
  axios
    .get(`/users/${id}/avatar`)
    .then((res) => {
      // dispatch({ type: SET_AVATAR, payload: res.data });
      dispatch({ type: ADD_IMAGE, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: UNSET_AVATAR });
    });
};
export const clearErrors = () => ({ type: CLEAR_ERRORS });
export const uploadAvatar = (formData) => (dispatch) => {
  // dispatch({ type: CLEAR_ERRORS });
  dispatch({ type: LOADING_UI });
  axios
    .post("/users/me/avatar", formData)
    .then((res) => {
      dispatch({ type: SET_AVATAR, payload: res.data });
      dispatch({ type: ADD_IMAGE, payload: res.data });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data.error,
      });
    });
};

export const logOutUser = () => (dispatch) => {
  axios.post("users/logout").then((res) => {
    // console.log(res.data);
    // localStorage.removeItem("IdToken");
    // delete axios.defaults.headers.common["Authorization"];
    // dispatch({ type: SET_UNAUTHENTICATED });
    dispatch(unsetAuthorizationHeader());
    dispatch({ type: CLEAR_POSTS });
  });
};

const unsetAuthorizationHeader = () => (dispatch) => {
  localStorage.removeItem("IdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

const setAuthorizationHeader = (token) => {
  const IdToken = `Bearer ${token}`;
  localStorage.setItem("IdToken", IdToken);
  // console.log(axios.defaults.headers);
  axios.defaults.headers.common["Authorization"] = IdToken;
};
