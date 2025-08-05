import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Post } from "../../types/Post";
import { getPostsByUsername, createNewPost } from "../../shared/api/posts-api";

export const fetchPostsByUsername = createAsyncThunk<Post[], string>(
  "posts/fetchByUsername",
  async (username, thunkAPI) => {
    try {
      const posts = await getPostsByUsername(username);
      return posts;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load posts");
    }
  }
);

export const addNewPost = createAsyncThunk<
  Post,
  { formData: FormData; token: string },
  { rejectValue: string }
>("posts/addNewPost", async ({ formData, token }, thunkAPI) => {
  try {
    const newPost = await createNewPost(formData, token);
    return newPost;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to add post");
  }
});
