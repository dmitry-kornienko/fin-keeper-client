import { Good } from "../../types";
import { api } from "./api";

export const goodApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllGoods: builder.query<Good[], void>({
            query: () => ({
                url: "/good",
                method: "GET"
            })
        }),
        updateAllGoods: builder.mutation<void, { id: string, article: string, cost_price: number }[]>({
            query: (data) => ({
                url: "/good/update-all",
                method: "PATCH",
                body: data
            })
        }),
    })
})

export const { useGetAllGoodsQuery, useUpdateAllGoodsMutation } = goodApi;
export const { endpoints: { getAllGoods, updateAllGoods } } = goodApi;