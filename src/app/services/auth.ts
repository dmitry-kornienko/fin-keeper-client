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
        current: builder.query<ResponsLoginData, void>({
            query: () => ({
                url: '/user/current',
                method: 'GET',
            })
        }),
    })
});

export const { useLoginMutation, useRegisterMutation, useCurrentQuery } = authApi;

export const { endpoints: { login, register, current } } = authApi;