import { configureStore } from '@reduxjs/toolkit'
import { cheklistGroupReducer } from './features/cheklist-group'

export const store = configureStore({
  reducer: {
    cheklistGroup: cheklistGroupReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
