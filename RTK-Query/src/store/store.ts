import { configureStore } from "@reduxjs/toolkit";

// import productsReducer from '../slice/ApiSlice'

import { productsApi } from "../slice/ApiSlice";

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productsApi.middleware),
});