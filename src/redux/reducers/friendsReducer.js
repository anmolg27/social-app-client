import {
  GET_FRIENDS,
  FRIENDS_LOADING,
  SEND_REQUEST_LOADING,
  STOP_SEND_REQUEST_LOADING,
} from "../types";
const initialState = {
  loading: true,
  friends: {},
  sendRequestLoading: false,
};
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FRIENDS:
      return {
        ...state,
        loading: false,
        friends: { ...action.payload },
      };
    case SEND_REQUEST_LOADING:
      return {
        ...state,
        sendRequestLoading: true,
      };
    case STOP_SEND_REQUEST_LOADING:
      return {
        ...state,
        sendRequestLoading: false,
      };
    case FRIENDS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
