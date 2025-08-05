import { createAsyncThunk } from "@reduxjs/toolkit";
import { signupUserApi } from "../../shared/api/register-api";

import type { RootState } from "../store";
import type { IUser } from "./auth-slice";

import { setAuthHeader } from "../../shared/api/setAuthHeader";

import {
  loginUserApi,
  logoutUserApi,
  getCurrentUserApi,
} from "../../shared/api/auth-api";

export interface LoginPayload {
  identifier: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: IUser;
}

export const login = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getCurrent = createAsyncThunk<
  AuthResponse,
  void,
  { state: RootState; rejectValue: string }
>("auth/current", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    if (!auth.token) throw new Error("No token found");
    const data = await getCurrentUserApi();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logout = createAsyncThunk<
  boolean,
  void,
  { state: RootState; rejectValue: string }
>("auth/logout", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    if (!auth.token) throw new Error("No token found");
    await logoutUserApi();
    setAuthHeader(null);
    return true;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

interface SignupResponse {
  message: string;
}

interface SignupPayload {
  email: string;
  password: string;
  fullname: string;
  username: string;
}

export const signup = createAsyncThunk<
  SignupResponse,
  SignupPayload,
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    const data = await signupUserApi(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});
