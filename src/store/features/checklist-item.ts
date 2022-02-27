import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

type TChecklistItemData<T> = {
  checklistItemData: {
    [K: string]: Array<T>
  }
}
export type TChecklistItem = { id: string; value: string; checklistGroupId: string }

const initialState: TChecklistItemData<TChecklistItem> = {
  checklistItemData: {},
}
const checklistItemSlice = createSlice({
  name: 'checklistItem',
  initialState,
  reducers: {
    addChecklistItem: (state, action: { type: string; payload: Omit<TChecklistItem, 'id'> }) => {
      const { value, checklistGroupId } = action.payload
      if (!state.checklistItemData[checklistGroupId]) {
        state.checklistItemData[checklistGroupId] = []
      }
      state.checklistItemData[checklistGroupId] = [
        ...state.checklistItemData[checklistGroupId],
        { id: uuidv4(), value, checklistGroupId },
      ]
    },
    deleteChecklistItem(state, action: { type: string; payload: Omit<TChecklistItem, 'value'> }) {
      const { id, checklistGroupId } = action.payload
      state.checklistItemData[checklistGroupId] = state.checklistItemData[checklistGroupId].filter(
        (item) => item.id !== id,
      )
    },
  },
})
const {
  actions: { addChecklistItem, deleteChecklistItem },
  reducer: checklistItemReducer,
} = checklistItemSlice

export { checklistItemReducer, addChecklistItem, deleteChecklistItem }
