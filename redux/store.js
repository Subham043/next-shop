import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './feature/cartSlice';
import parameterReducer from './feature/parameterSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    parameter: parameterReducer,
  },
});