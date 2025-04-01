import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

 
export interface IProduct {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
}

export interface IFinalData {
    products: IProduct[],
    total: number,
    skip: number,
    limit: number
}

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://dummyjson.com/'
    }),
    tagTypes: ["Products"],
    endpoints: (builder) => ({
        getAllProducts: builder.query<IFinalData, void>({
            query: () => "/products",

            providesTags: ["Products"],
        }),

    }),

    keepUnusedDataFor: 120,
});

export default productsApi.reducer;

// export const { useGetAllProductsQuery } = productsApi;