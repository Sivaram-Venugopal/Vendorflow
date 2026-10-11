import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosClient';

export const fetchHealthStatus = createAsyncThunk(
  'health/fetchHealthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { status: 'offline', message: error.message }
      );
    }
  }
);

const healthSlice = createSlice({
  name: 'health',
  state: {
    data: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastChecked: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHealthStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
        state.lastChecked = new Date().toISOString();
      })
      .addCase(fetchHealthStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.data = null;
        state.error = action.payload || { message: 'Connection failed' };
        state.lastChecked = new Date().toISOString();
      });
  },
});

export default healthSlice.reducer;
