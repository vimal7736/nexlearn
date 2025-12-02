import { createSlice } from '@reduxjs/toolkit';
import { ResultState } from '@/src/types';
import { submitAnswers } from './examSlice';

const initialState: ResultState = {
  result: null,
  loading: false,
  error: null,
};

const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    clearResult: (state) => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearResult } = resultSlice.actions;

export default resultSlice.reducer;