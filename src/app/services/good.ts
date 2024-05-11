import { Good } from "../../types";
import { api } from "./api";

export const goodApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllGoods: builder.query<Good[], void>({
            query: () => ({
                url: "/goods",
                method: "GET"
            })
        }),
        updateAllGoods: builder.mutation<void, { id: string, article: string, cost_price: number }[]>({
            query: (data) => ({
                url: "/goods/edit",
                method: "PATCH",
                body: data
            })
        }),
    })
})

export const { useGetAllGoodsQuery, useUpdateAllGoodsMutation } = goodApi;
export const { endpoints: { getAllGoods, updateAllGoods } } = goodApi;