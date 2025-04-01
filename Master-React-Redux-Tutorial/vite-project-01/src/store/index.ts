import { configureStore } from "@reduxjs/toolkit";

import MainReducer from '../reducers';
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        characters: MainReducer,
    }
});

export type storeState = ReturnType<typeof store.getState>;

type storeDispatch  = typeof store.dispatch;

export const useCharacterDispatch = () => useDispatch<storeDispatch>();