import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosClient';

export const fetchAdminDashboard = createAsyncThunk(
  'dashboard/fetchAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/admin');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch admin dashboard analytics'
      );
    }
  }
);

export const fetchBuyerDashboard = createAsyncThunk(
  'dashboard/fetchBuyerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/buyer');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch buyer dashboard analytics'
      );
    }
  }
);

export const fetchVendorDashboard = createAsyncThunk(
  'dashboard/fetchVendorDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/vendor');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch vendor dashboard analytics'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    adminData: null,
    buyerData: null,
    vendorData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboardErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Buyer
      .addCase(fetchBuyerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.buyerData = action.payload;
      })
      .addCase(fetchBuyerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Vendor
      .addCase(fetchVendorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorData = action.payload;
      })
      .addCase(fetchVendorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardErrors } = dashboardSlice.actions;
export default dashboardSlice.reducer;
