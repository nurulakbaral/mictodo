import { configureStore } from '@reduxjs/toolkit'
import { cheklistReducer } from './features/cheklist'

export const store = configureStore({
  reducer: {
    cheklistFeature: cheklistReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
