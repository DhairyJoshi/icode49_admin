import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { allBlogCategoryAPI, blogCategoryCreateAPI } from '../api'

export const fetchBlogCategories = createAsyncThunk('blogCategories/fetchBlogCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await allBlogCategoryAPI()
    if (res.status === 'true' || res.statuscode === 200) {
      return res.data || res.categories || []
    } else {
      return rejectWithValue(res.message || 'Failed to fetch categories')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

export const createBlogCategory = createAsyncThunk('blogCategories/createBlogCategory', async (category, { rejectWithValue }) => {
  try {
    const res = await blogCategoryCreateAPI(category)
    if (res.status === 'true' || res.statuscode === 200) {
      return res
    } else {
      return rejectWithValue(res.message || 'Failed to add category')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

const blogCategoriesSlice = createSlice({
  name: 'blogCategories',
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
      .addCase(fetchBlogCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchBlogCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(createBlogCategory.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createSuccess = null
      })
      .addCase(createBlogCategory.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createSuccess = 'Category added successfully!'
      })
      .addCase(createBlogCategory.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload || action.error.message
      })
  },
})

export default blogCategoriesSlice.reducer 