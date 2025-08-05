import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { login, getCurrent, logout, signup } from "./auth-thunks";
import type { User } from "../../types/User";

export interface IUser extends User {
  email: string;
  password: string;
  token?: string;
}

interface AuthState {
  token: string;
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: "",
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateCurrentUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; user: IUser }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
        state.isAuthenticated = false;
      })

      // GET CURRENT
      .addCase(getCurrent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCurrent.fulfilled,
        (state, action: PayloadAction<{ token: string; user: IUser }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(getCurrent.rejected, (state) => {
        state.token = "";
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = "";
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      // SIGNUP
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.token = "";
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
        state.isAuthenticated = false;
      });
  },
});

export const { updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
