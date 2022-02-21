import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

type TCheklist<T> = {
  cheklist: Array<T>
}

const initialState: TCheklist<{ id: string; value: string }> = {
  cheklist: [],
}
const cheklistSlice = createSlice({
  name: 'cheklistFeature',
  initialState,
  reducers: {
    addCheklist: (state, action) => {
      state.cheklist = [...state.cheklist, { id: uuidv4(), value: action.payload }]
    },
  },
})
const {
  actions: { addCheklist },
  reducer: cheklistReducer,
} = cheklistSlice

export { addCheklist, cheklistReducer }
