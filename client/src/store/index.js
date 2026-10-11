import { configureStore } from '@reduxjs/toolkit';
import healthReducer from './slices/healthSlice';
import authReducer from './slices/authSlice';
import vendorReducer from './slices/vendorSlice';
import evaluationReducer from './slices/evaluationSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';

export const store = configureStore({
  reducer: {
    health: healthReducer,
    auth: authReducer,
    vendor: vendorReducer,
    evaluation: evaluationReducer,
    po: purchaseOrderReducer,
  },
});

export default store;
