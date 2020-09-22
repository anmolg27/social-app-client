import { SET_OPENED_USER } from "../types";
const initialState = {
  credentials: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_OPENED_USER:
      return {
        ...state,
        credentials: action.payload,
      };
    default:
      return state;
  }
}
