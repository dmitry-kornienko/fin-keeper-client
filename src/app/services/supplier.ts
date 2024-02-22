import { Supplier, User } from '../../types';
import { api } from './api';

export type UserData = Omit<User, 'id'>;
type RequestData = {
    userId: string,
    name: string,
    tax_rate: number,
    tax_from: string,
    token_stat: string
}

export const supplierApi = api.injectEndpoints({
    endpoints: (builder) => ({
        supplier: builder.query<Supplier, string>({
            query: (id) => ({
                url: `/supplier/${id}`,
                method: 'GET',
            })
        }),
        suppliersCurrentUser: builder.query<Supplier[], void>({
            query: () => ({
                url: "/supplier",
                method: 'GET',
            })
        }),
        addSupplier: builder.mutation<Supplier, RequestData>({
            query: (supplier) => ({
                url: '/supplier/add',
                method: 'POST',
                body: supplier
            })
        }),
        updateSupplierInfo: builder.mutation<Supplier, { _id: string, name: string, tax_rate: number, tax_from: string, token_stat: string }>({
            query: (data) => ({
                url: `/supplier/edit/${data._id}`,
                method: 'PATCH',
                body: data
            })
        }),
        changeActiveSupplier: builder.mutation<string, string>({
            query: (id) => ({
                url: `/supplier/change-active-supplier/${id}`,
                method: 'PATCH',
                body: id
            })
        }),
        // register: builder.mutation<ResponsLoginData, UserData>({
        //     query: (UserData) => ({
        //         url: '/user/register',
        //         method: 'POST',
        //         body: UserData
        //     })
        // }),
        // updateUserPassword: builder.mutation<void, {_id: string, currentPassword: string, newPassword: string}>({
        //     query: (data) => ({
        //         url: `/user/update-password/${data._id}`,
        //         method: 'PATCH',
        //         body: data
        //     })
        // }),
    })
});

export const { useSupplierQuery, useAddSupplierMutation, useUpdateSupplierInfoMutation, useSuppliersCurrentUserQuery, useChangeActiveSupplierMutation } = supplierApi;

export const { endpoints: { supplier, addSupplier, updateSupplierInfo, suppliersCurrentUser, changeActiveSupplier } } = supplierApi;