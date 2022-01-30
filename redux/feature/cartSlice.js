import { createSlice } from '@reduxjs/toolkit';



export const cartSlice = createSlice({
  name: 'cart',
  initialState : {
    cart:{
      updateCartCounter:0,
      emptyCartCounter:0,
      cartCounter:0
    }
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateCart: (state) => {
      state.cart.updateCartCounter = state.cart.updateCartCounter+1;
    },
    emptyCartAction: (state) => {
        state.cart.emptyCartCounter = state.cart.updateCartCounter+1;
    },
    updateCartCounter: (state, action) => {
      state.cart.cartCounter = action.payload;
    }
  },
  
});

export const { updateCart, emptyCartAction, updateCartCounter } = cartSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCart = (state) => state.cart.cart;



export default cartSlice.reducer;