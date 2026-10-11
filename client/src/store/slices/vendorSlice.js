import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosClient';

// Fetch all vendors (Admin & Buyer) with query filter
export const fetchVendors = createAsyncThunk(
  'vendor/fetchVendors',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/vendors?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }
);

// Fetch current logged-in vendor's own profile
export const fetchMyVendorProfile = createAsyncThunk(
  'vendor/fetchMyVendorProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/vendors/me');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor profile');
    }
  }
);

// Self-register vendor profile
export const registerVendor = createAsyncThunk(
  'vendor/registerVendor',
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await api.post('/vendors', vendorData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register vendor profile');
    }
  }
);

// Upload KYC compliance document
export const uploadKYCDocument = createAsyncThunk(
  'vendor/uploadKYCDocument',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/vendors/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Document upload failed');
    }
  }
);

// Admin: Update vendor approval status
export const updateVendorStatus = createAsyncThunk(
  'vendor/updateVendorStatus',
  async ({ vendorId, status, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/vendors/${vendorId}/status`, {
        status,
        reason,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Status update failed');
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendors: [],
    currentProfile: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearVendorFeedback: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    // Optimistic UI status update action
    setVendorStatusOptimistic: (state, action) => {
      const { vendorId, status, reason } = action.payload;
      const index = state.vendors.findIndex((v) => v._id === vendorId);
      if (index !== -1) {
        state.vendors[index].status = status;
        state.vendors[index].statusReason = reason;
      }
      if (state.currentProfile && state.currentProfile._id === vendorId) {
        state.currentProfile.status = status;
        state.currentProfile.statusReason = reason;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Profile
      .addCase(fetchMyVendorProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchMyVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Vendor
      .addCase(registerVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
        state.successMessage = 'Vendor profile submitted for review!';
      })
      .addCase(registerVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Document
      .addCase(uploadKYCDocument.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.documents.push(action.payload.document);
          state.currentProfile.complianceScore = action.payload.complianceScore;
        }
        state.successMessage = 'Compliance document uploaded!';
      })

      // Update Status (Server Confirmation)
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.vendors.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.vendors[index] = updated;
        }
        if (state.currentProfile && state.currentProfile._id === updated._id) {
          state.currentProfile = updated;
        }
      });
  },
});

export const { clearVendorFeedback, setVendorStatusOptimistic } = vendorSlice.actions;
export default vendorSlice.reducer;
