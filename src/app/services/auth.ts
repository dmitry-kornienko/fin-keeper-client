import { User } from '../../types';
import { api } from './api';

export type UserData = Omit<User, 'id'>;
type ResponsLoginData = User & { token: string };

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ResponsLoginData, UserData>({
            query: (UserData) => ({
                url: '/user/login',
                method: 'POST',
                body: UserData
            })
        }),
        register: builder.mutation<ResponsLoginData, UserData>({
            query: (UserData) => ({
                url: '/user/register',
                method: 'POST',
                body: UserData
            })
        }),
        updateUserInfo: builder.mutation<ResponsLoginData, Pick<User, '_id' | 'name' | 'email' | 'tokenWB'>>({
            query: (data) => ({
                url: `/user/update-info/${data._id}`,
                method: 'PATCH',
                body: data
            })
        }),
        updateUserPassword: builder.mutation<void, {_id: string, currentPassword: string, newPassword: string}>({
            query: (data) => ({
                url: `/user/update-password/${data._id}`,
                method: 'PATCH',
                body: data
            })
        }),
        current: builder.query<ResponsLoginData, void>({
            query: () => ({
                url: '/user/current',
                method: 'GET',
            })
        }),
    })
});

export const { useLoginMutation, useRegisterMutation, useCurrentQuery, useUpdateUserInfoMutation, useUpdateUserPasswordMutation } = authApi;

export const { endpoints: { login, register, current, updateUserInfo, updateUserPassword } } = authApi;