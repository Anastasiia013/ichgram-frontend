import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../types/Post";
import { fetchPostsByUsername, addNewPost } from "./posts-thunks";

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  shouldReloadPosts: boolean;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  shouldReloadPosts: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts(state) {
      state.posts = [];
      state.error = null;
      state.loading = false;
    },
    setShouldReloadPosts(state, action: PayloadAction<boolean>) {
      state.shouldReloadPosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPostsByUsername.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.posts = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchPostsByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addNewPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { clearPosts, setShouldReloadPosts } = postsSlice.actions;
export default postsSlice.reducer;
