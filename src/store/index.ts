import { configureStore } from '@reduxjs/toolkit'
import { checklistGroupReducer } from '~/src/store/features/checklist-group'
import { checklistItemReducer } from '~/src/store/features/checklist-item'

export const store = configureStore({
  reducer: {
    checklistGroup: checklistGroupReducer,
    checklistItem: checklistItemReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
