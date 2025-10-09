import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Начальное состояние
const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// Получить все уведомления
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications", { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Ошибка при загрузке уведомлений");
    }
  }
);

// Пометить уведомление как прочитанное
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async ({ userId, notificationId }, { rejectWithValue }) => {
    if (!userId || !notificationId)
      return rejectWithValue("Не переданы данные для обновления");
    try {
      const res = await api.put(
        `/notifications/${userId}/read/${notificationId}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Ошибка при обновлении уведомления"
      );
    }
  }
);

// Удалить одно уведомление
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${notificationId}`, { withCredentials: true });
      return notificationId; // возвращаем id для удаления из стейта
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Ошибка при удалении уведомления");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Получить все уведомления
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Пометить как прочитанное
      .addCase(markAsRead.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.notifications[idx] = action.payload;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Удалить уведомление
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;


