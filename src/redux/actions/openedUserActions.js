import { SET_OPENED_USER } from "../types";

export const setOpenedUser = (user) => (dispatch) => {
  dispatch({ type: SET_OPENED_USER, payload: user });
};
