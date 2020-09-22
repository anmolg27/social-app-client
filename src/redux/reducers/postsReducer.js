import {
  SET_POSTS,
  DELETE_POST,
  CLEAR_POSTS,
  UPDATE_COMMENTS_COUNT,
  OLD_POSTS,
  OLD_POSTS_LOADING,
  OLD_POST_ERROR,
  STOP_OLD_POSTS_LOADING,
  SET_LAST_POST_ID,
  CREATE_POST_LOADING,
  CREATE_POST_ERROR,
  POSTS_LOADING,
  POSTS_ERROR,
  INITIALIZE_POSTS,
  UPDATE_LIKES,
} from "../types";
const initialState = {
  postsList: [],
  lastPostId: null,
  createPostLoading: false,
  createPostError: null,
  postsLoading: false,
  postsError: null,
  oldPostsLoading: false,
  oldPostsError: null,
};
export default function (state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_POSTS:
      console.log("initialising posts");
      // console.log(initialState);
      return initialState;
    case POSTS_LOADING:
      return {
        ...state,
        postsLoading: true,
        postsError: null,
      };
    case POSTS_ERROR:
      return {
        ...state,
        postsLoading: false,
        postsError: action.payload,
      };
    case SET_POSTS:
      return {
        ...state,
        postsList: action.payload,
        createPostLoading: false,
        postsLoading: false,
        createPostError: null,
        postsError: null,
      };
    case OLD_POSTS_LOADING:
      return {
        ...state,
        oldPostsLoading: true,
      };
    case OLD_POSTS:
      return {
        ...state,
        postsList: state.postsList.concat(action.payload),
        oldPostsLoading: false,
        oldPostsError: null,
      };
    case OLD_POST_ERROR:
      return {
        ...state,
        oldPostsLoading: false,
        oldPostsError: action.payload,
      };
    case STOP_OLD_POSTS_LOADING:
      return {
        ...state,
        oldPostsLoading: false,
      };
    case SET_LAST_POST_ID:
      return {
        ...state,
        lastPostId: action.payload,
      };
    case CREATE_POST_LOADING:
      return {
        ...state,
        createPostLoading: true,
        createPostError: null,
      };
    case CREATE_POST_ERROR:
      return {
        ...state,
        createPostError: action.payload,
        createPostLoading: false,
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
        return post;
      });
      return {
        ...state,
        postsList: temp,
      };
    case UPDATE_LIKES:
      // console.log("post id is " + action.payload.postId);
      const templikes = state.postsList.map((post) => {
        if (post._id === action.payload.postId) {
          post.likes = action.payload.likes;
        }
        return post;
      });
      return {
        ...state,
        postsList: templikes,
      };
    default:
      return state;
  }
}
