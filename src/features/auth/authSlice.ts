import { User } from '../../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../app/services/auth';
import { RootState } from '../../app/store';
import { reportApi } from '../../app/services/report';

interface InitialState {
    user: User | null,
    token: string | null
}

const initialState: InitialState = {
    user: null,
    token: null
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => initialState,
        updateUserInfo(state, action: PayloadAction<{name: string, email: string}>) {
            if (state.user) {
                state.user.name = action.payload.name;
                state.user.email = action.payload.email;
            }
        },
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
            })
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
            })
            .addMatcher(authApi.endpoints.current.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addMatcher(authApi.endpoints.updateUserInfo.matchFulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addMatcher(reportApi.endpoints.addReport.matchFulfilled, (state) => {
                if (state.user) {
                    state.user.bill -= 1;
                }
            })
            .addMatcher(reportApi.endpoints.addReportThroughExcel.matchFulfilled, (state) => {
                if (state.user) {
                    state.user.bill -= 1;
                }
            })
    }
});

export const { logout, updateUserInfo, setToken } = slice.actions;
export default slice.reducer;

export const selectUser = (state: RootState) => state.auth.user;