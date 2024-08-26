import { configureStore } from '@reduxjs/toolkit';
import ragReducer from '../features/rag/ragSlice';
import modelReducer from '../features/rag/modelSlice';
import ingestionReducer from '../features/rag/ingestionSlice';
import masterJsonReducer from '../features/rag/masterJsonSlice';

export const store = configureStore({
  reducer: {
    rag: ragReducer,
    model: modelReducer,
    masterJson: masterJsonReducer,
    ingestion: ingestionReducer
  },
});
