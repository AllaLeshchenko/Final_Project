import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios"; // твой экземпляр axios с baseURL

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Асинхронная регистрация
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", formData, { withCredentials: true });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Ошибка регистрации");
    }
  }
);

// Асинхронный логин
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", formData, { withCredentials: true });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Ошибка логина");
    }
  }
);

// Получение профиля пользователя
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/profile/${userId}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Ошибка получения профиля");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- регистрация ---
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // --- логин ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // --- профиль ---
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;




// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/axios";

// const initialState = {
//   user: null,
//   loading: false,
//   error: null,
//   isAuthenticated: false,
// };

// // Асинхронный login
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/auth/login", formData, { withCredentials: true });
//       return res.data.user;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Ошибка логина");
//     }
//   }
// );

// // Асинхронная регистрация
// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/auth/register", formData, { withCredentials: true });
//       return res.data.user;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Ошибка регистрации");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = !!action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//       })

//       .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//       });
//   },
// });

// export const { logout, setUser } = authSlice.actions;
// export default authSlice.reducer;
