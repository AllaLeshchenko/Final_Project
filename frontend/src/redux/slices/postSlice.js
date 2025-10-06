import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Получить посты конкретного пользователя
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/posts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
