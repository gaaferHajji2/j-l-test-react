import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";


export interface CounterState {
    value: number;
}

export const initialState: CounterState = {
    value : 0,
}

export const incrementAsync = createAsyncThunk<number, number, { }>(
    "counter/incrementAsync",
    async (amount: number): Promise<number> => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return amount;
    }
);

const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },

        decrement: (state) => {
            state.value -= 1;
        },

        incrementByValue: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },

        decrementByValue: (state, action: PayloadAction<number>) => {
            state.value -= action.payload;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(incrementAsync.fulfilled, (state, action: PayloadAction<number>) =>{
            state.value += action.payload;
        }).addCase(incrementAsync.pending, (state) =>{
            state.value = 0;
        });
    }
    
});


export const { increment, decrement, incrementByValue, decrementByValue } = counterSlice.actions;

export default counterSlice.reducer;