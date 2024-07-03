import { configureStore } from '@reduxjs/toolkit';
import ragReducer from '../features/rag/ragSlice';
import modelReducer from '../features/rag/modelSlice';
import ingestionReducer from '../features/rag/ingestionSlice';

export const store = configureStore({
  reducer: {
    rag: ragReducer,
    model: modelReducer,
    ingestion: ingestionReducer
  },
});
