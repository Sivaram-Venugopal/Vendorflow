import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosClient';

// Poll/fetch notifications for current user
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      );
    }
  }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      );
    }
  }
);

// Fetch recent Ethereal emails
export const fetchRecentEmails = createAsyncThunk(
  'notifications/fetchRecentEmails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications/recent-emails');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recent emails'
      );
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    recentEmails: [],
    loading: false,
    activeToast: null,
  },
  reducers: {
    dismissToast: (state) => {
      state.activeToast = null;
    },
    setActiveToast: (state, action) => {
      state.activeToast = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const newItems = action.payload.data;
        // Detect if there's a new unread notification to trigger a toast
        if (state.notifications.length > 0 && newItems.length > 0) {
          const latestItem = newItems[0];
          const prevLatestId = state.notifications[0]?._id;
          if (latestItem._id !== prevLatestId && !latestItem.isRead) {
            state.activeToast = latestItem;
          }
        }
        state.notifications = newItems;
        state.unreadCount = action.payload.unreadCount;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const item = state.notifications.find((n) => n._id === id);
        if (item && !item.isRead) {
          item.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      .addCase(fetchRecentEmails.fulfilled, (state, action) => {
        state.recentEmails = action.payload;
      });
  },
});

export const { dismissToast, setActiveToast } = notificationSlice.actions;
export default notificationSlice.reducer;
