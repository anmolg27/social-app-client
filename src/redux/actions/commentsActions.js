import { LOADING_UI } from "../types";

export const getComments = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
};
