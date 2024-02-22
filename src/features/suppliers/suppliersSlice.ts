import { Supplier } from '../../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { supplierApi } from '../../app/services/supplier';

interface InitialState {
    suppliers: Supplier[] | null,
}

const initialState: InitialState = {
    suppliers: null
}

const slice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        clearSuppliers: () => initialState,
        setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
            state.suppliers = action.payload
            console.log(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(supplierApi.endpoints.suppliersCurrentUser.matchFulfilled, (state, action) => {
                state.suppliers = action.payload
            })
            .addMatcher(supplierApi.endpoints.addSupplier.matchFulfilled, (state, action) => {
                state.suppliers?.push(action.payload)
            })
    }
});

export const { clearSuppliers, setSuppliers } = slice.actions;
export default slice.reducer;

export const selectSuppliers = (state: RootState) => state.suppliers;