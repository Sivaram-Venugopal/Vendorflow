import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosClient';

// Fetch audit logs with optional filters & pagination
export const fetchAuditLogs = createAsyncThunk(
  'auditLog/fetchAuditLogs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.entityType && filters.entityType !== 'All') {
        params.append('entityType', filters.entityType);
      }
      if (filters.action && filters.action !== 'All') {
        params.append('action', filters.action);
      }
      if (filters.actor) {
        params.append('actor', filters.actor);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }

      const response = await api.get(`/audit-logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch audit activity logs'
      );
    }
  }
);

// Fetch single audit log entry
export const fetchAuditLogById = createAsyncThunk(
  'auditLog/fetchAuditLogById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/audit-logs/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch audit log detail'
      );
    }
  }
);

const auditLogSlice = createSlice({
  name: 'auditLog',
  initialState: {
    logs: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
    selectedLog: null,
  },
  reducers: {
    setSelectedLog: (state, action) => {
      state.selectedLog = action.payload;
    },
    clearSelectedLog: (state) => {
      state.selectedLog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAuditLogById.fulfilled, (state, action) => {
        state.selectedLog = action.payload;
      });
  },
});

export const { setSelectedLog, clearSelectedLog } = auditLogSlice.actions;
export default auditLogSlice.reducer;
