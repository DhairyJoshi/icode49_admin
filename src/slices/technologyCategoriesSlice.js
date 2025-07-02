import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { allTechnologyAPI, technologyCreateAPI } from '../api'

export const fetchTechnologyCategories = createAsyncThunk('technologyCategories/fetchTechnologyCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await allTechnologyAPI()
    if (res.status === 'true' || res.statuscode === 200) {
      return res.data || res.categories || []
    } else {
      return rejectWithValue(res.message || 'Failed to fetch categories')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

export const createTechnologyCategory = createAsyncThunk('technologyCategories/createTechnologyCategory', async (data, { rejectWithValue }) => {
  try {
    const res = await technologyCreateAPI(data)
    if (res.status === 'true' || res.statuscode === 200) {
      return res
    } else {
      return rejectWithValue(res.message || 'Failed to add category')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

const technologyCategoriesSlice = createSlice({
  name: 'technologyCategories',
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
      .addCase(fetchTechnologyCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTechnologyCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTechnologyCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(createTechnologyCategory.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createSuccess = null
      })
      .addCase(createTechnologyCategory.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createSuccess = 'Category added successfully!'
      })
      .addCase(createTechnologyCategory.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload || action.error.message
      })
  },
})

export default technologyCategoriesSlice.reducer 