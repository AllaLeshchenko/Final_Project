import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/posts";

// Получить все посты (главная лента)
export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data; // сервер уже отдаёт посты с isLiked, lastComments, isFollowed
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load posts"
      );
    }
  }
);

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

// Лайк / анлайк поста
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const state = thunkAPI.getState();
      const post = state.posts.posts.find((p) => p._id === postId);
      if (!post) throw new Error("Post not found");

      const url = `/api/likes/${postId}/${post.isLiked ? "unlike" : "like"}`;
      const method = post.isLiked ? "DELETE" : "POST";

      await axios({
        url,
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Возвращаем обновлённое состояние
      return {
        postId,
        isLiked: !post.isLiked,
        likesCount: post.likesCount + (post.isLiked ? -1 : 1),
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// Добавить комментарий
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        `/api/comments/${postId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { postId, comment: data.comment };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchAllPosts ---
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;

        // Приводим полученные посты к ожидаемому виду
        const formattedPosts = action.payload.map((p) => ({
          ...p,
          author: {
            userName: p.author?.userName || "Unknown User",
            profileImage: p.author?.profileImage || "/default-avatar.png",
            bio: p.author?.bio || "",
          },
          likesCount: p.likesCount ?? 0,
          commentsCount: p.commentsCount ?? (p.lastComments?.length || 0),
          content: p.content || "",
          image: p.image || null,
        }));
      
        // Перемешиваем (опционально)
        state.posts = formattedPosts.sort(() => Math.random() - 0.5);
      })

      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- fetchUserPosts ---
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- toggleLike ---
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, isLiked, likesCount } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.isLiked = isLiked;
          post.likesCount = likesCount;
        }
      })

      // --- addComment ---
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.commentsCount += 1;
          if (post.lastComments) {
            post.lastComments.unshift(comment);
            if (post.lastComments.length > 2)
              post.lastComments = post.lastComments.slice(0, 2);
          } else {
            post.lastComments = [comment];
          }
        }
      });
  },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer;


