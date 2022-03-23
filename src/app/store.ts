import { TypedUseSelectorHook, useSelector as rawUseSelector } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';

import randomItemReducer from '../feature/randomItem/randomItemSlice';

export const store = configureStore({
  reducer: {
    items: randomItemReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
