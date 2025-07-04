import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from './slices/blogsSlice'
import blogCategoriesReducer from './slices/blogCategoriesSlice'
import technologyCategoriesReducer from './slices/technologyCategoriesSlice'
import portfolioCategoriesReducer from './slices/portfolioCategoriesSlice'
import portfolioReducer from './slices/portfolioSlice'

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    blogCategories: blogCategoriesReducer,
    technologyCategories: technologyCategoriesReducer,
    portfolioCategories: portfolioCategoriesReducer,
    portfolio: portfolioReducer,
  },
})

export default store