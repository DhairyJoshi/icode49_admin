import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { allBlogListAPI, blogCreateAPI } from '../api'

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const res = await allBlogListAPI()
  return res.data || res.blogs || []
})

export const createBlog = createAsyncThunk('blogs/createBlog', async (blogData, { rejectWithValue }) => {
  try {
    const res = await blogCreateAPI(blogData)
    if (res.status === 'true' || res.statuscode === 200) {
      return res
    } else {
      return rejectWithValue(res.message || 'Failed to create blog')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    createStatus: 'idle',
    createError: null,
    createSuccess: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createBlog.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createSuccess = null
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createSuccess = 'Blog created successfully!'
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload || action.error.message
      })
  },
})

export default blogsSlice.reducer