import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosClient';

// Submit new evaluation (Buyer or Admin)
export const submitEvaluation = createAsyncThunk(
  'evaluation/submitEvaluation',
  async (evaluationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/evaluations', evaluationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit evaluation');
    }
  }
);

// Fetch evaluation history for a specific vendor
export const fetchVendorEvaluations = createAsyncThunk(
  'evaluation/fetchVendorEvaluations',
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/vendors/${vendorId}/evaluations`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor scorecard');
    }
  }
);

// Fetch vendor comparison matrix (Admin)
export const fetchVendorsComparison = createAsyncThunk(
  'evaluation/fetchVendorsComparison',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/evaluations/comparison');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comparison');
    }
  }
);

const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState: {
    history: [],
    selectedVendor: null,
    comparisonList: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearEvaluationFeedback: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Evaluation
      .addCase(submitEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.history.push(action.payload.evaluation);
        state.successMessage = 'Evaluation submitted successfully!';
      })
      .addCase(submitEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Vendor Evaluations History
      .addCase(fetchVendorEvaluations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVendorEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.data;
        state.selectedVendor = action.payload.vendor;
      })
      .addCase(fetchVendorEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Vendors Comparison
      .addCase(fetchVendorsComparison.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVendorsComparison.fulfilled, (state, action) => {
        state.loading = false;
        state.comparisonList = action.payload;
      })
      .addCase(fetchVendorsComparison.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEvaluationFeedback } = evaluationSlice.actions;
export default evaluationSlice.reducer;
