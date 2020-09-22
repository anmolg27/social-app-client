import {
  GET_FRIENDS,
  SEND_REQUEST_LOADING,
  STOP_SEND_REQUEST_LOADING,
} from "../types";
import axios from "axios";
export const getFriends = () => (dispatch) => {
  // dispatch({ type: FRIENDS_LOADING });
  axios
    .get(`https://anmolg27-social-app-server.herokuapp.com/friends`)
    .then((res) => {
      dispatch({ type: GET_FRIENDS, payload: res.data });
    })
    .catch((err) => {
      // alert("can't fetch friends");
      // dispatch({ type: FRIENDS_LOADING });
    });
};

export const sendFriendRequest = (friendId) => (dispatch) => {
  dispatch({ type: SEND_REQUEST_LOADING });
  axios
    .post(
      `https://anmolg27-social-app-server.herokuapp.com/${friendId}/sendFriendRequest`
    )
    .then((res) => {
      dispatch({ type: GET_FRIENDS, payload: res.data });
      dispatch({ type: STOP_SEND_REQUEST_LOADING });
    })
    .catch((err) => console.log(err));
};
export const respondToRequest = (friendId, response) => (dispatch) => {
  axios
    .post(
      `https://anmolg27-social-app-server.herokuapp.com/friends/${friendId}/respond?accept=${response}`
    )
    .then((res) => {
      dispatch({ type: GET_FRIENDS, payload: res.data });
    })
    .catch((err) => console.log(err));
};
export const unfriend = (friendId) => (dispatch) => {
  axios
    .post(
      `https://anmolg27-social-app-server.herokuapp.com/friends/${friendId}/unfriend`
    )
    .then((res) => {
      dispatch({ type: GET_FRIENDS, payload: res.data });
    });
};
export const setFriends = (data) => (dispatch) => {
  dispatch({ type: GET_FRIENDS, payload: data });
};
