import { configureStore } from '@reduxjs/toolkit';
import healthReducer from './slices/healthSlice';
import authReducer from './slices/authSlice';
import vendorReducer from './slices/vendorSlice';
import evaluationReducer from './slices/evaluationSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';
import auditLogReducer from './slices/auditLogSlice';
import notificationReducer from './slices/notificationSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    health: healthReducer,
    auth: authReducer,
    vendor: vendorReducer,
    evaluation: evaluationReducer,
    po: purchaseOrderReducer,
    auditLog: auditLogReducer,
    notifications: notificationReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
