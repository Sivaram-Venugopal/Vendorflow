import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosClient';

// Fetch POs (Scoped by role: Buyer, Vendor, or Admin)
export const fetchPurchaseOrders = createAsyncThunk(
  'po/fetchPurchaseOrders',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/purchase-orders?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch purchase orders');
    }
  }
);

// Fetch Single PO by ID with full timeline
export const fetchPODetails = createAsyncThunk(
  'po/fetchPODetails',
  async (poId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/purchase-orders/${poId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch PO details');
    }
  }
);

// Create new PO (Draft)
export const createPO = createAsyncThunk(
  'po/createPO',
  async (poData, { rejectWithValue }) => {
    try {
      const response = await api.post('/purchase-orders', poData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create PO');
    }
  }
);

// Transition PO Status (FSM + Role gated)
export const updatePOStatus = createAsyncThunk(
  'po/updatePOStatus',
  async ({ poId, status, remarks }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/purchase-orders/${poId}/status`, {
        status,
        remarks,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Transition rejected');
    }
  }
);

const purchaseOrderSlice = createSlice({
  name: 'po',
  initialState: {
    orders: [],
    currentPO: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearPOFeedback: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    // Optimistic status update for responsive UI feedback
    setPOStatusOptimistic: (state, action) => {
      const { poId, status, remarks, actorName, actorRole } = action.payload;
      const index = state.orders.findIndex((p) => p._id === poId);
      if (index !== -1) {
        state.orders[index].status = status;
      }
      if (state.currentPO && state.currentPO._id === poId) {
        state.currentPO.status = status;
        state.currentPO.history.push({
          fromStatus: state.currentPO.status,
          toStatus: status,
          actorName: actorName || 'Current User',
          actorRole: actorRole || '',
          remarks: remarks || '',
          timestamp: new Date().toISOString(),
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch POs
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Details
      .addCase(fetchPODetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPODetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPO = action.payload;
      })
      .addCase(fetchPODetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create PO
      .addCase(createPO.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPO.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.successMessage = `Purchase Order ${action.payload.poNumber} created successfully!`;
      })
      .addCase(createPO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Status (Server Confirmation)
      .addCase(updatePOStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.orders.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.orders[index] = updated;
        }
        if (state.currentPO && state.currentPO._id === updated._id) {
          state.currentPO = updated;
        }
        state.successMessage = `Purchase Order ${updated.poNumber} updated to '${updated.status}'`;
      })
      .addCase(updatePOStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearPOFeedback, setPOStatusOptimistic } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
