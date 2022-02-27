import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

type TChecklistGroupData<T> = {
  checklistGroupData: Array<T>
}
export type TChecklistGroup = { id: string; value: string }

const initialState: TChecklistGroupData<TChecklistGroup> = {
  checklistGroupData: [],
}
const checklistGroupSlice = createSlice({
  name: 'checklistGroup',
  initialState,
  reducers: {
    addChecklistGroup: (state, action) => {
      state.checklistGroupData = [...state.checklistGroupData, { id: uuidv4(), value: action.payload }]
    },
  },
})
const {
  actions: { addChecklistGroup },
  reducer: checklistGroupReducer,
} = checklistGroupSlice

export { addChecklistGroup, checklistGroupReducer }
