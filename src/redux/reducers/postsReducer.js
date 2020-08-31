import {
  SET_POSTS,
  ADD_POST,
  DELETE_POST,
  LOADING_POSTS,
  CLEAR_POSTS,
  UPDATE_COMMENTS_COUNT,
} from "../types";
const initialState = {
  postsList: [],
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_POSTS:
      return {
        ...state,
        postsList: action.payload,
      };
    case ADD_POST:
      const tempList = state.postsList;
      tempList.unshift(action.payload);
      return {
        ...state,
        postsList: tempList,
      };
    case CLEAR_POSTS:
      return initialState;
    case DELETE_POST:
      return {
        ...state,
        postsList: state.postsList.filter(
          (post) => post._id !== action.payload
        ),
      };
    case UPDATE_COMMENTS_COUNT:
      const temp = state.postsList.map((post) => {
        if (post._id === action.payload.postId) {
          post.commentsCount = action.payload.commentsCount;
        }
        // console.log(post);
        return post;
      });
      // console.log(temp);
      return {
        ...state,
        postsList: temp,
      };
    default:
      return state;
  }
}
