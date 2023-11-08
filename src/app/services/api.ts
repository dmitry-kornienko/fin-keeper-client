import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store'; 

const baseQuerry = fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders(headers, { getState }) {
        const token = (getState() as RootState).auth.user?.token ||
            localStorage.getItem('token');

        if (token && token !== null) {
            headers.set('authorization', `Bearer ${token}`);
        }
    },
});

const baseQuerryWithRetry = retry(baseQuerry, { maxRetries: 2 });

export const api = createApi({
    reducerPath: 'splitApi',
    baseQuery: baseQuerryWithRetry,
    refetchOnMountOrArgChange: true,
    endpoints: () => ({})
})