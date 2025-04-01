
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slices/CounterSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        counter: counterReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type RootDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<RootDispatch>();