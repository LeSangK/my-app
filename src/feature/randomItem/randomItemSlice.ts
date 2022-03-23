import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

export interface Item {
  id: string;
  name: string;
}

export const randomItemSlice = createSlice<
  Item[],
  SliceCaseReducers<Item[]>,
  string
>({
  name: "randomItem",
  initialState: [],
  reducers: {
    addRandomItem: (state, action: PayloadAction<Item>) => [
      ...state,
      action.payload,
    ],
    deleteItemById: (state, action: PayloadAction<string>) =>
      state.filter((item) => item.id !== action.payload),
  },
});

export const { addRandomItem, deleteItemById } = randomItemSlice.actions;
export default randomItemSlice.reducer;
