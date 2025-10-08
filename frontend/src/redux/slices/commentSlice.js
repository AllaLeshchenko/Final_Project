import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/comments";

// ---------------------------
// Получить комментарии поста
// ---------------------------
export const fetchPostComments = createAsyncThunk(
  "comments/fetchPostComments",
  async (postId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_URL}/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data; // массив комментариев
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Не удалось загрузить комментарии"
      );
    }
  }
);

// Добавить комментарий к посту
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, text }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/${postId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data.comment; // возвращаем созданный комментарий
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Ошибка при добавлении комментария"
      );
    }
  }
);

// Удалить комментарий
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return commentId; // возвращаем ID удалённого комментария
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Ошибка при удалении комментария"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearComments(state) {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Загрузка комментариев
      .addCase(fetchPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Добавление комментария
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        // добавляем новый комментарий в начало списка
        state.comments.unshift(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Удаление комментария
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => c._id !== action.payload
        );
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchPostComments = createAsyncThunk(
//   "comments/fetchPostComments",
//   async (postId, thunkAPI) => {
//     try {
//       const { data } = await axios.get(`/api/comments/${postId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to fetch comments"
//       );
//     }
//   }
// );

// const commentSlice = createSlice({
//   name: "comments",
//   initialState: { comments: [], loading: false, error: null },
//   reducers: {
//     clearComments: (state) => {
//       state.comments = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPostComments.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchPostComments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.comments = action.payload;
//       })
//       .addCase(fetchPostComments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearComments } = commentSlice.actions;
// export default commentSlice.reducer;
