import type { RootState } from "../store";

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;