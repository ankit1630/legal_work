import { configureStore } from '@reduxjs/toolkit';
import ragReducer from '../features/rag/ragSlice';
import ingestionReducer from '../features/rag/ingestionSlice';

export const store = configureStore({
  reducer: {
    rag: ragReducer,
    ingestion: ingestionReducer
  },
});
