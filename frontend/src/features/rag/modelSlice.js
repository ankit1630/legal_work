import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    model: "",
    subModel: ""
};

export const modelSlice = createSlice({
    name: 'model',
    initialState,
    reducers: {
      changeModel: (state, action) => {
        state.model = action.payload.model;
        state.subModel = "";
      },
      changeSubModel: (state, action) => {
        state.subModel = action.payload.subModel;
      }
    },
});

export const { changeModel, changeSubModel } = modelSlice.actions;

export const selectModel = (state) => state.model.model;
export const selectSubModel = (state) => state.model.subModel;

export default modelSlice.reducer;