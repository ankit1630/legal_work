import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ingestionModalIsOpen: false,
  ingestionType: "",
  uploadIsInProgress: false
};

export const ingestionSlice = createSlice({
  name: 'ingestion',
  initialState,
  reducers: {
    updateIngestionModalState: (state, action) => {
        state.ingestionModalIsOpen = action.payload.ingestionModalIsOpen;
        state.ingestionType = action.payload.ingestionType;
    },
    upload: (state, action) => {
        
    },
    onFileSelect: (state, action) => {
        state.fileSelected = action.payload;
        state.fileOrFolderIsSelected = true;
    },
    onFolderSelect: (state, action) => {
        state.collections = [action.payload, ...state.collections];
        state.selectedCollection = action.payload;
    }
  },
});

export const selectIngestionModalState = ({ingestion: {ingestionModalIsOpen, ingestionType}}) => ({ ingestionModalIsOpen, ingestionType });

export const selectChoosedFile = ({ingestion: {fileSelected}}) => fileSelected;

export const isFileOrFolderIsSelected = (state) => state.ingestion.fileOrFolderIsSelected;

export const { updateIngestionModalState, upload, onFileSelect, onFolderSelect } = ingestionSlice.actions;

export default ingestionSlice.reducer;
