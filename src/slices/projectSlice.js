import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { allPortfolioListAPI, portfolioCreateAPI, portfolioUpdateAPI } from '../api'

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { rejectWithValue }) => {
  try {
    const res = await allPortfolioListAPI()
    if (res.status === 'true' || res.statuscode === 200) {
      return res.data || res.portfolios || []
    } else {
      return rejectWithValue(res.message || 'Failed to fetch projects')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

export const createProject = createAsyncThunk('projects/createProject', async (data, { rejectWithValue }) => {
  try {
    const res = await portfolioCreateAPI(data)
    if (res.status === 'true' || res.statuscode === 200) {
      return res
    } else {
      return rejectWithValue(res.message || 'Failed to add project')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

export const updateProject = createAsyncThunk('projects/updateProject', async (data, { rejectWithValue }) => {
  try {
    const res = await portfolioUpdateAPI(data)
    if (res.status === 'true' || res.statuscode === 200) {
      return res
    } else {
      return rejectWithValue(res.message || 'Failed to update project')
    }
  } catch (err) {
    return rejectWithValue('Network error')
  }
})

const projectSlice = createSlice({
  name: 'projects',
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
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(createProject.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createSuccess = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createSuccess = 'Project added successfully!'
      })
      .addCase(createProject.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.payload || action.error.message
      })
      .addCase(updateProject.pending, (state) => {
        state.updateStatus = 'loading'
        state.updateError = null
        state.updateSuccess = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.updateSuccess = 'Project updated successfully!'
        // Update the project in items by id
        const updated = action.payload?.data || action.payload?.project
        if (updated && updated.id) {
          const idx = state.items.findIndex(p => p.id === updated.id || p._id === updated.id)
          if (idx !== -1) {
            state.items[idx] = { ...state.items[idx], ...updated }
          }
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.updateError = action.payload || action.error.message
      })
  },
})

export default projectSlice.reducer 