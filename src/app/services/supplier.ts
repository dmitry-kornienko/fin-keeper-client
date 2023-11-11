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
        addSupplier: builder.mutation<Supplier, RequestData>({
            query: (supplier) => ({
                url: '/supplier/add',
                method: 'POST',
                body: supplier
            })
        }),
        // register: builder.mutation<ResponsLoginData, UserData>({
        //     query: (UserData) => ({
        //         url: '/user/register',
        //         method: 'POST',
        //         body: UserData
        //     })
        // }),
        // updateUserInfo: builder.mutation<ResponsLoginData, Pick<User, '_id' | 'name' | 'email'>>({
        //     query: (data) => ({
        //         url: `/user/update-info/${data._id}`,
        //         method: 'PATCH',
        //         body: data
        //     })
        // }),
        // updateUserPassword: builder.mutation<void, {_id: string, currentPassword: string, newPassword: string}>({
        //     query: (data) => ({
        //         url: `/user/update-password/${data._id}`,
        //         method: 'PATCH',
        //         body: data
        //     })
        // }),
        // current: builder.query<ResponsLoginData, void>({
        //     query: () => ({
        //         url: '/user/current',
        //         method: 'GET',
        //     })
        // }),
    })
});

export const { useAddSupplierMutation } = supplierApi;

export const { endpoints: { addSupplier } } = supplierApi;