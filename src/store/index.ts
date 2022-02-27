import { configureStore } from '@reduxjs/toolkit'
import { cheklistGroupReducer } from './features/cheklist-group'
import { cheklistItemReducer } from './features/cheklist-item'

export const store = configureStore({
  reducer: {
    cheklistGroup: cheklistGroupReducer,
    cheklistItem: cheklistItemReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
