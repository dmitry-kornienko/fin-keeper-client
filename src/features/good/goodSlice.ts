import { createSlice } from "@reduxjs/toolkit";
import { Good } from "../../types";
import { goodApi } from "../../app/services/good";
import { RootState } from "../../app/store";

interface InitialState {
    goods: Good[] | null
}

const initialState: InitialState = {
    goods: null
}

const slice = createSlice({
    name: "good",
    initialState,
    reducers: {
        logout: () => initialState
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(goodApi.endpoints.getAllGoods.matchFulfilled, (state, action) => {
            state.goods = action.payload;
        })
    }
})

export const { logout } = slice.actions;
export default slice.reducer;

export const selectGoods = (state: RootState) => state.good;
