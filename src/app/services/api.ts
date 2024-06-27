import { createApi, fetchBaseQuery, retry, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState, store } from '../store';
import { setToken } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders(headers, { getState }) {
        const token = (getState() as RootState).auth.token || localStorage.getItem('token');

        if (token && token !== null) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
    credentials: 'include',
});

const refreshToken = async () => {
    const refreshResponse = await fetch('http://localhost:5000/auth/refresh', {
        method: 'GET',
        credentials: 'include',
    });

    if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await refreshResponse.json();
    console.log(data)
    localStorage.setItem('token', data.accessToken);
    return data.accessToken;
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        try {
            const newToken = await refreshToken();

            store.dispatch(setToken(newToken.accessToken))

            result = await baseQuery(args, api, extraOptions);
        } catch (error) {
            return { error: { status: 401, data: 'Unauthorized' } };
        }
    }

    return result;
};

const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 2 });

export const api = createApi({
    reducerPath: 'splitApi',
    baseQuery: baseQueryWithRetry,
    refetchOnMountOrArgChange: true,
    endpoints: () => ({}),
});