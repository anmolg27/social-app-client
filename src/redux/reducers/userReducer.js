import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  SET_AVATAR,
  UNSET_AVATAR,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
  avatar: undefined,
};

export default function (state = initialState, action) {
  // console.log("inside user reducer");
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        credentials: { ...action.payload },
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case SET_AVATAR:
      return {
        ...state,
        avatar: action.payload,
      };
    case UNSET_AVATAR:
      return {
        ...state,
        avatar: undefined,
      };
    default:
      return state;
  }
}
