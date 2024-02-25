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
        removeReport: builder.mutation<void, string>({
            query: (id) => ({
                url: `/report/remove/${id}`,
                method: 'DELETE',
                // body: data
            })
        }),
        editAdditionalParametersReport: builder.mutation<Report, { id: string, storage: number, taking_payment: number, other_deductions: number }>({
            query: (data) => ({
                url: `/report/update-additional-parameters/${data.id}`,
                method: 'PATCH',
                body: data
            })
        }),
    })
});

export const { useGetAllReportsQuery, useAddReportMutation, useGetReportQuery, useRemoveReportMutation, useEditAdditionalParametersReportMutation } = reportApi;

export const { endpoints: { getAllReports, getReport, addReport, removeReport, editAdditionalParametersReport } } = reportApi;