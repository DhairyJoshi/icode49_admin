import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { allPortfolioCategoryAPI, portfolioCategoryCreateAPI } from '../api'

export const fetchProjectCategories = createAsyncThunk('projectCategories/fetchProjectCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await allPortfolioCategoryAPI()
    if (res.status === 'true' || res.statuscode === 200) {
      return res.data || res.categories || []
    } else {
      return rejectWithValue(res.message || 'Failed to fetch categories')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

export const createProjectCategory = createAsyncThunk('projectCategories/createProjectCategory', async (category, { rejectWithValue }) => {
  try {
    const res = await portfolioCategoryCreateAPI(category)
    if (res.status === 'true' || res.statuscode === 200) {
      return res
    } else {
      return rejectWithValue(res.message || 'Failed to add category')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

const projectCategoriesSlice = createSlice({
  name: 'projectCategories',
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
      .addCase(fetchProjectCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProjectCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProjectCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(createProjectCategory.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createSuccess = null
      })
      .addCase(createProjectCategory.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createSuccess = 'Category added successfully!'
      })
      .addCase(createProjectCategory.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload || action.error.message
      })
  },
})

export default projectCategoriesSlice.reducer 