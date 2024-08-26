import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedTemplate: ""
};

export const masterJsonSlice = createSlice({
    name: 'masterJson',
    initialState,
    reducers: {
      changeMasterJson: (state, action) => {
        console.log(action, "action");
        state.selectedTemplate = action.payload.selectedTemplate;
      }
    },
});

export const { changeMasterJson } = masterJsonSlice.actions;

export const selectMasterJson = (state) => state.masterJson.selectedTemplate;

export default masterJsonSlice.reducer;