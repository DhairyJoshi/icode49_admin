import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { allPortfolioListAPI, portfolioCreateAPI, portfolioUpdateAPI } from '../api'

export const fetchPortfolios = createAsyncThunk('portfolios/fetchPortfolios', async (_, { rejectWithValue }) => {
  try {
    const res = await allPortfolioListAPI()
    if (res.status === 'true' || res.statuscode === 200) {
      return res.data || res.portfolios || []
    } else {
      return rejectWithValue(res.message || 'Failed to fetch portfolios')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

export const createPortfolio = createAsyncThunk('portfolio/createPortfolio', async (data, { rejectWithValue }) => {
  try {
    const res = await portfolioCreateAPI(data)
    if (res.status === 'true' || res.statuscode === 200) {
      return res
    } else {
      return rejectWithValue(res.message || 'Failed to add portfolio')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

export const updatePortfolio = createAsyncThunk('portfolios/updatePortfolio', async (data, { rejectWithValue }) => {
  try {
    const res = await portfolioUpdateAPI(data)
    if (res.status === 'true' || res.statuscode === 200) {
      return res
    } else {
      return rejectWithValue(res.message || 'Failed to update portfolio')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

const projectSlice = createSlice({
  name: 'portfolios',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    createStatus: 'idle',
    createError: null,
    createSuccess: null,
    updateStatus: 'idle',
    updateError: null,
    updateSuccess: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(createPortfolio.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createSuccess = null
      })
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createSuccess = 'Project added successfully!'
      })
      .addCase(createPortfolio.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload || action.error.message
      })
      .addCase(updatePortfolio.pending, (state) => {
        state.updateStatus = 'loading'
        state.updateError = null
        state.updateSuccess = null
      })
      .addCase(updatePortfolio.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.updateSuccess = 'Portfolio updated successfully!'
        // Update the project in items by id
        const updated = action.payload?.data || action.payload?.portfolio
        if (updated && updated.id) {
          const idx = state.items.findIndex(p => p.id === updated.id || p._id === updated.id)
          if (idx !== -1) {
            state.items[idx] = { ...state.items[idx], ...updated }
          }
        }
      })
      .addCase(updatePortfolio.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.updateError = action.payload || action.error.message
      })
  },
})

export default projectSlice.reducer 