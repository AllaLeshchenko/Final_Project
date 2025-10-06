import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice"; 
import postReducer from "./slices/postSlice";
import commentReducer from "./slices/commentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    comments: commentReducer,
  },
});

export default store;
