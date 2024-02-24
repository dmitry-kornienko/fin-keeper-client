import { Report } from "../../types";
import { api } from "./api";

export const reportApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllReports: builder.query<Report[], void>({
            query: () => ({
                url: '/report',
                method: 'GET',
            })
        }),
        getReport: builder.query<Report, string>({
            query: (id) => ({
                url: `/report/${id}`,
                method: 'GET',
            })
        }),
        addReport: builder.mutation<Report, Report>({
            query: (data) => ({
                url: `/report/add`,
                method: 'POST',
                body: data
            })
        }),
    })
});

export const { useGetAllReportsQuery, useAddReportMutation, useGetReportQuery } = reportApi;

export const { endpoints: { getAllReports, getReport, addReport } } = reportApi;