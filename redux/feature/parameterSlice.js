import { createSlice } from '@reduxjs/toolkit';



export const parameterSlice = createSlice({
  name: 'parameter',
  initialState : {
    parameter:null
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateParameter: (state,action) => {
      state.parameter = action.payload;
    },
    emptyParameter: (state) => {
        state.parameter = null;
    },
  },
  
});

export const { updateParameter, emptyParameter } = parameterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectParameter = (state) => state.parameter;



export default parameterSlice.reducer;