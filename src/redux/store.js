import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { reducer as formReducer } from "redux-form";

import userReducer from "./reducers/userReducer";
import uiReducer from "./reducers/uiReducer";
import postsReducer from "./reducers/postsReducer";
import imagesReducer from "./reducers/imagesReducer";
import friendsReducer from "./reducers/friendsReducer";
import openedUserReducer from "./reducers/openedUserReducer";

const initialState = {};
const middleware = [thunk];
const reducers = combineReducers({
  user: userReducer,
  UI: uiReducer,
  posts: postsReducer,
  form: formReducer,
  images: imagesReducer,
  friendsData: friendsReducer,
  openedUser: openedUserReducer,
});

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(...middleware)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
export default store;
