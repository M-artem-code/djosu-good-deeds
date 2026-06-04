import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  clearStoredToken,
  setStoredToken,
} from "@/shared/lib";
import type { UserPublic } from "@/entities/user";

interface AuthState {
  accessToken: string | null;
  user: UserPublic | null;
  isHydrating: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isHydrating: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; user?: UserPublic | null }>,
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      setStoredToken(action.payload.accessToken);
    },
    setUser(state, action: PayloadAction<UserPublic | null>) {
      state.user = action.payload;
    },
    clearSession(state) {
      state.accessToken = null;
      state.user = null;
      clearStoredToken();
    },
    setHydrating(state, action: PayloadAction<boolean>) {
      state.isHydrating = action.payload;
    },
  },
});

export const { setCredentials, setUser, clearSession, setHydrating } =
  authSlice.actions;
export default authSlice.reducer;
