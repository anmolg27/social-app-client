import { ADD_IMAGE } from "../types";
const initialState = {
  images: [],
};
export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_IMAGE:
      const tempArr = state.images;
      const index = tempArr.findIndex(
        (avatar) => avatar.userId === action.payload.userId
      );
      if (tempArr.length === 0 || index === -1) {
        tempArr.push(action.payload);
      } else {
        tempArr.splice(index, 1, action.payload);
      }

      return {
        ...state,
        images: tempArr,
      };
    default:
      return state;
  }
}
