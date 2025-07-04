import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { allPortfolioCategoryAPI, portfolioCategoryCreateAPI } from '../api'

export const fetchPortfolioCategories = createAsyncThunk('portfolioCategories/fetchPortfolioCategories', async (_, { rejectWithValue }) => {
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

export const createPortfolioCategory = createAsyncThunk('portfolioCategories/createPortfolioCategory', async (category, { rejectWithValue }) => {
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

const portfolioCategoriesSlice = createSlice({
  name: 'portfolioCategories',
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
      .addCase(fetchPortfolioCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPortfolioCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchPortfolioCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(createPortfolioCategory.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createSuccess = null
      })
      .addCase(createPortfolioCategory.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createSuccess = 'Category added successfully!'
      })
      .addCase(createPortfolioCategory.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload || action.error.message
      })
  },
})

export default portfolioCategoriesSlice.reducer 