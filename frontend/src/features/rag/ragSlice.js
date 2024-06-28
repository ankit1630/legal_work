import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  model: "",
  collections: null,
  selectedCollection: ""
};

export const ragSlice = createSlice({
  name: 'rag',
  initialState,
  reducers: {
    changeModel: (state, action) => {
        state.model = action.payload.model;
    },
    updateCollections: (state, action) => {
        state.collections = action.payload;
    },
    onSelectCollection: (state, action) => {
      console.log(action);
      state.selectedCollection = action.payload;
    },
    onCreateCollection: (state, action) => {
        state.collections = [action.payload, ...state.collections];
        state.selectedCollection = action.payload;
    }
  },
});

export const { changeModel, onSelectCollection, onCreateCollection, updateCollections } = ragSlice.actions;

export const selectModel = (state) => state.rag.model;
export const selectCollectionOptions = (state) => state.rag.collections;
export const selectSelectedCollection = (state) => state.rag.selectedCollection;

export default ragSlice.reducer;
