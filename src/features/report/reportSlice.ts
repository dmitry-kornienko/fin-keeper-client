import { createSlice } from "@reduxjs/toolkit";
import { Report } from "../../types";
import { reportApi } from "../../app/services/report";
import { RootState } from "../../app/store";

interface InitialState {
    reports: Report[] | null,
}

const initialState: InitialState = {
    reports: null,
}

const slice = createSlice({
    name: "report",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(reportApi.endpoints.getAllReports.matchFulfilled, (state, action) => {
                state.reports = action.payload
            })
    },
});

export const { logout } = slice.actions;
export default slice.reducer;

export const selectReports = (state: RootState) => state.report;