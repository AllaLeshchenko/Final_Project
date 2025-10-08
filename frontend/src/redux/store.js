import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice"; 
import postReducer from "./slices/postSlice";
import commentReducer from "./slices/commentSlice";
import searchReducer from "./slices/searchSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    comments: commentReducer,
    search: searchReducer,
  },
});

export default store;
