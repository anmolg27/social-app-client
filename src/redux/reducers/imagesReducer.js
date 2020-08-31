import { ADD_IMAGE } from "../types";

export default function (state = [], action) {
  switch (action.type) {
    case ADD_IMAGE:
      const tempArr = state;
      const index = tempArr.findIndex(
        (avatar) => avatar.userId === action.payload.userId
      );
      if (tempArr.length === 0 || index === -1) {
        tempArr.push(action.payload);
      } else {
        tempArr.splice(index, 1, action.payload);
      }

      return [...tempArr];
    default:
      return state;
  }
}
