import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  bannerMessage: string | null;
}

const initialState: UiState = {
  bannerMessage: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setBannerMessage(state, action: PayloadAction<string | null>) {
      state.bannerMessage = action.payload;
    },
    clearBannerMessage(state) {
      state.bannerMessage = null;
    },
  },
});

export const { setBannerMessage, clearBannerMessage } = uiSlice.actions;
export default uiSlice.reducer;
