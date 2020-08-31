import axios from "axios";
import {
  ADD_POST,
  SET_POSTS,
  LOADING_POSTS,
  DELETE_POST,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  UPDATE_COMMENTS_COUNT,
} from "../types";
import { getAvatar } from "./userActions";
export const createPost = (content) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/posts", { content })
    .then((res) => {
      // console.log(res.data);
      dispatch(getPosts());
      // dispatch({ type: ADD_POST, payload: res.data });
    })
    .catch((err) => {
      if (err.response.status === 500) {
        dispatch({
          type: SET_ERRORS,
          payload: "Server is down. Please try again later :(",
        });
      }
    });
};
export const getPosts = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get("/myAndFriendsPosts/?sortBy=createdAt:desc")
    .then((res) => {
      dispatch({ type: SET_POSTS, payload: res.data });
      res.data.forEach((post) => {
        dispatch(getAvatar(post.ownerId));
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 500) {
        dispatch({
          type: SET_ERRORS,
          payload: "Server is down. Please try again later :(",
        });
      }
    });
};

export const deletePost = (postId) => (dispatch) => {
  axios
    .delete(`/posts/${postId}`)
    .then((res) => {
      // console.log(res.data);
      dispatch({ type: DELETE_POST, payload: postId });
    })
    .catch((err) => alert("Something went wrong. please refresh your page"));
};

export const updateCommentsCount = (postId, commentsCount) => (dispatch) => {
  dispatch({ type: UPDATE_COMMENTS_COUNT, payload: { postId, commentsCount } });
};
