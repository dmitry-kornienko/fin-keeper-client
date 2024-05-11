import { Report } from "../../types";
import { api } from "./api";

export const reportApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllReports: builder.query<Report[], void>({
            query: () => ({
                url: '/reports',
                method: 'GET',
            })
        }),
        getReport: builder.query<Report, string>({
            query: (id) => ({
                url: `/reports/${id}`,
                method: 'GET',
            })
        }),
        addReport: builder.mutation<Report, {date_from: string, date_to: string}>({
            query: (data) => ({
                url: `/reports/add`,
                method: 'POST',
                body: data
            })
        }),
        addReportThroughExcel: builder.mutation<Report, {dateFrom: string, dateTo: string, realizationreport_id: string, file: File}>({
            query: ({ dateFrom, dateTo, realizationreport_id, file }) => {
                const formData = new FormData();
                formData.append('dateFrom', dateFrom);
                formData.append('dateTo', dateTo);
                formData.append('realizationreport_id', realizationreport_id);
                formData.append('file', file);
        
                return {
                    url: `/report/add-through-excel`,
                    method: 'POST',
                    body: formData
                };
            },
        }),
        removeReport: builder.mutation<void, string>({
            query: (id) => ({
                url: `/reports/delete/${id}`,
                method: 'DELETE',
            })
        }),
        editAdditionalParametersReport: builder.mutation<Report, { id: string, storage: number, taking_payment: number, other_deductions: number }>({
            query: (data) => ({
                url: `/report/update-additional-parameters/${data.id}`,
                method: 'PATCH',
                body: data
            })
        }),
        editCostPrice: builder.mutation<void, { id: string, composition: { article: string, cost_price: number }[] }>({
            query: (data) => ({
                url: `/reports/update-cost-pice/${data.id}`,
                method: 'PATCH',
                body: data.composition
            })
        }),
    })
});

export const { useGetAllReportsQuery, useAddReportMutation, useAddReportThroughExcelMutation, useGetReportQuery, useRemoveReportMutation, useEditAdditionalParametersReportMutation, useEditCostPriceMutation } = reportApi;

export const { endpoints: { getAllReports, getReport, addReport, addReportThroughExcel, removeReport, editAdditionalParametersReport, editCostPrice } } = reportApi;