import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPostComments = createAsyncThunk(
  "comments/fetchPostComments",
  async (postId, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: { comments: [], loading: false, error: null },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
