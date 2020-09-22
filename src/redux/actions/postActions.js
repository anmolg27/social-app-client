import axios from "axios";
import {
  SET_POSTS,
  DELETE_POST,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  UPDATE_COMMENTS_COUNT,
  OLD_POSTS,
  SET_LAST_POST_ID,
  CREATE_POST_LOADING,
  CREATE_POST_ERROR,
  OLD_POSTS_LOADING,
  OLD_POST_ERROR,
  STOP_OLD_POSTS_LOADING,
  POSTS_LOADING,
  POSTS_ERROR,
  INITIALIZE_POSTS,
  UPDATE_LIKES,
} from "../types";
import { getAvatar } from "./userActions";
export const createPost = (content) => (dispatch) => {
  dispatch({ type: CREATE_POST_LOADING });
  axios
    .post("/posts", { content })
    .then((res) => {
      dispatch(getPosts());
    })
    .catch((err) => {
      if (err.response && err.response.status === 500) {
        dispatch({
          type: CREATE_POST_ERROR,
          payload: "Server is down. Please try again later :(",
        });
      }
    });
};
export const getPosts = () => (dispatch, getState) => {
  dispatch({ type: POSTS_LOADING });
  axios
    .get(`/allposts`)
    .then((res) => {
      dispatch({ type: SET_POSTS, payload: res.data });
      // res.data.forEach((post) => {
      //   dispatch(getAvatar(post.ownerId));
      // });
      if (res.data.length === 10) {
        dispatch({ type: SET_LAST_POST_ID, payload: res.data[9]._id });
      } else {
        dispatch({ type: SET_LAST_POST_ID, payload: null });
      }
      // dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
      if (err.response && err.response.status === 500) {
        dispatch({
          type: POSTS_ERROR,
          payload: "Server is down. Please try again later :(",
        });
      }
    });
};

export const getOldPosts = (postId) => (dispatch, getState) => {
  if (postId !== null) {
    dispatch({ type: OLD_POSTS_LOADING });
    axios
      .get(`/allposts?postId=${postId}`)
      .then((res) => {
        if (
          res.data.length !== 0 &&
          getState().posts.postsList.findIndex(
            (post) => post._id === res.data[0]._id
          ) === -1
        ) {
          dispatch({ type: OLD_POSTS, payload: res.data });
          // res.data.forEach((post) => {
          //   dispatch(getAvatar(post.ownerId));
          // });
        } else {
          dispatch({ type: STOP_OLD_POSTS_LOADING });
        }

        if (res.data.length === 10) {
          dispatch({ type: SET_LAST_POST_ID, payload: res.data[9]._id });
        } else {
          dispatch({ type: SET_LAST_POST_ID, payload: null });
        }
        // dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 500) {
          dispatch({
            type: OLD_POST_ERROR,
            payload: "Server is down. Please try again later :(",
          });
        }
      });
  }
};
export const getUserPosts = (userId) => (dispatch, getState) => {
  dispatch({ type: POSTS_LOADING });

  axios
    .get(`/posts/${userId}`)
    .then((res) => {
      dispatch({ type: SET_POSTS, payload: res.data });

      if (res.data.length === 10) {
        // console.log(res.data[9]._id);
        dispatch({ type: SET_LAST_POST_ID, payload: res.data[9]._id });
      } else {
        dispatch({ type: SET_LAST_POST_ID, payload: null });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.response && err.response.status === 500) {
        dispatch({
          type: POSTS_ERROR,
          payload: "Server is down. Please try again later :(",
        });
      }
    });
};
export const getOldUserPosts = (userId, postId) => (dispatch, getState) => {
  if (postId !== null && userId) {
    // console.log(getState().posts);

    if (
      postId ===
      getState().posts.postsList[getState().posts.postsList.length - 1]._id
    ) {
      dispatch({ type: OLD_POSTS_LOADING });
      axios
        .get(`/posts/${userId}?postId=${postId}`)
        .then((res) => {
          console.log("old posts loading");
          console.log(
            "length is " + res.data.length + " and lastid is " + postId
          );
          if (
            res.data.length !== 0 &&
            getState().posts.postsList.findIndex(
              (post) => post._id === res.data[0]._id
            ) === -1
          ) {
            dispatch({ type: OLD_POSTS, payload: res.data });
            // res.data.forEach((post) => {
            //   dispatch(getAvatar(post.ownerId));
            // });
          } else {
            dispatch({ type: STOP_OLD_POSTS_LOADING });
          }

          if (res.data.length === 10) {
            dispatch({ type: SET_LAST_POST_ID, payload: res.data[9]._id });
          } else {
            dispatch({ type: SET_LAST_POST_ID, payload: null });
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 500) {
            dispatch({
              type: OLD_POST_ERROR,
              payload: "Server is down. Please try again later :(",
            });
          }
        });
    }
  }
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
export const updateLikes = (postId, likes) => (dispatch) => {
  dispatch({ type: UPDATE_LIKES, payload: { postId, likes } });
};

export const initializePosts = () => (dispatch) => {
  dispatch({ type: INITIALIZE_POSTS });
};
