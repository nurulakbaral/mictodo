import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

type TCheklistItemData<T> = {
  cheklistItemData: {
    [K: string]: Array<T>
  }
}
export type TCheklistItem = { id: string; value: string; cheklistGroupId: string }

const initialState: TCheklistItemData<TCheklistItem> = {
  cheklistItemData: {},
}
const cheklistItemSlice = createSlice({
  name: 'cheklistItem',
  initialState,
  reducers: {
    addCheklistItem: (state, action: { type: string; payload: Omit<TCheklistItem, 'id'> }) => {
      const { value, cheklistGroupId } = action.payload
      if (!state.cheklistItemData[cheklistGroupId]) {
        state.cheklistItemData[cheklistGroupId] = []
      }
      state.cheklistItemData[cheklistGroupId] = [
        ...state.cheklistItemData[cheklistGroupId],
        { id: uuidv4(), value, cheklistGroupId },
      ]
    },
    deleteCheklistItem(state, action: { type: string; payload: Omit<TCheklistItem, 'value'> }) {
      const { id, cheklistGroupId } = action.payload
      state.cheklistItemData[cheklistGroupId] = state.cheklistItemData[cheklistGroupId].filter((item) => item.id !== id)
    },
  },
})
const {
  actions: { addCheklistItem, deleteCheklistItem },
  reducer: cheklistItemReducer,
} = cheklistItemSlice

export { cheklistItemReducer, addCheklistItem, deleteCheklistItem }
