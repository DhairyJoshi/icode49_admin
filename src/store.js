import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from './slices/blogsSlice'
import blogCategoriesReducer from './slices/blogCategoriesSlice'
import technologyCategoriesReducer from './slices/technologyCategoriesSlice'
import projectCategoriesReducer from './slices/projectCategoriesSlice'
import projectReducer from './slices/projectSlice'

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    blogCategories: blogCategoriesReducer,
    technologyCategories: technologyCategoriesReducer,
    projectCategories: projectCategoriesReducer,
    project: projectReducer,
  },
})

export default store 