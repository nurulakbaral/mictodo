import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

type TCheklistGroup<T> = {
  cheklistGroupData: Array<T>
}

const initialState: TCheklistGroup<{ id: string; value: string }> = {
  cheklistGroupData: [],
}
const cheklistGroupSlice = createSlice({
  name: 'cheklistGroup',
  initialState,
  reducers: {
    addCheklistGroupData: (state, action) => {
      state.cheklistGroupData = [...state.cheklistGroupData, { id: uuidv4(), value: action.payload }]
    },
  },
})
const {
  actions: { addCheklistGroupData },
  reducer: cheklistGroupReducer,
} = cheklistGroupSlice

export { addCheklistGroupData, cheklistGroupReducer }
