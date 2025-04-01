import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import character_json from "../data/characters.json";

export interface ICharacterState {
    id: number,
    name: string,
    strength: number,
    intelligence: number,
    speed: number
}

export interface IInitialState {
    data: ICharacterState[],
    addedData: ICharacterState[],
}

// const initialState: ICharacterState[] = character_json;
const initialState: IInitialState = {
    data : character_json,
    addedData: []
};

// function characters(
//   state = character_json,
//   action: PayloadAction<{ payload: void, action: string}>
// ) {
//   switch (action.type) {
//     default:
//       return state;
//   }
// }

const characterSlice = createSlice({
    name: 'characterSlice',
    initialState,
    reducers: {
        addCharacterById: (state, payload: PayloadAction<number>) => {

            if(state.addedData.length < 3) {
                let t1 = state.data.findIndex((e) => e.id == payload.payload);
                state.addedData.push(state.data[t1]);
    
                state.data.splice(t1, 1);
            }

            
        },

        removeCharacterById: (state, payload: PayloadAction<number>) => {
            let t1 = state.addedData.findIndex((e) => e.id == payload.payload);

            state.data.push(state.addedData[t1]);

            state.addedData.splice(t1, 1);
        }
    }
})

export default characterSlice.reducer;

export const { addCharacterById, removeCharacterById } = characterSlice.actions;

