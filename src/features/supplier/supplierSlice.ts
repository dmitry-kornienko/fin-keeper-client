import { Supplier } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { supplierApi } from '../../app/services/supplier';

interface InitialState {
    supplier: Supplier | null,
}

const initialState: InitialState = {
    supplier: null,
}

const slice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(supplierApi.endpoints.addSupplier.matchFulfilled, (state, action) => {
                state.supplier = action.payload;
            })
    }
});

export const { logout } = slice.actions;
export default slice.reducer;

export const selectSupplier = (state: RootState) => state.supplier.supplier;