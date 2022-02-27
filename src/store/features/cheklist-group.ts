import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

type TCheklistGroupData<T> = {
  cheklistGroupData: Array<T>
}
export type TCheklistGroup = { id: string; value: string }

const initialState: TCheklistGroupData<TCheklistGroup> = {
  cheklistGroupData: [],
}
const cheklistGroupSlice = createSlice({
  name: 'cheklistGroup',
  initialState,
  reducers: {
    addCheklistGroup: (state, action) => {
      state.cheklistGroupData = [...state.cheklistGroupData, { id: uuidv4(), value: action.payload }]
    },
  },
})
const {
  actions: { addCheklistGroup },
  reducer: cheklistGroupReducer,
} = cheklistGroupSlice

export { addCheklistGroup, cheklistGroupReducer }
