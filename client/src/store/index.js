import { configureStore } from '@reduxjs/toolkit';
import healthReducer from './slices/healthSlice';
import authReducer from './slices/authSlice';
import vendorReducer from './slices/vendorSlice';
import evaluationReducer from './slices/evaluationSlice';

export const store = configureStore({
  reducer: {
    health: healthReducer,
    auth: authReducer,
    vendor: vendorReducer,
    evaluation: evaluationReducer,
  },
});

export default store;
