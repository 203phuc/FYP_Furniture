import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice.js";
import authReducer from "./slices/authSlice.js";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
