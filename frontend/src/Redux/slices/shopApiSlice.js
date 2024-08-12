//make slice of shop

import { apiSlice } from "./apiSlice.js";
import { SHOP_URL } from "../constants.jsx"; //import the shop url from constants.jsx

export const shopApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query({
      query: () => ({
        url: `${SHOP_URL}`,
        method: "GET",
      }),
    }),
    getShop: builder.query({
      query: (id) => ({
        url: `${SHOP_URL}/${id}`,
        method: "GET",
      }),
    }),
    registerShop: builder.mutation({
      query: (data) => ({
        url: `${SHOP_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateShop: builder.mutation({
      query: (data) => ({
        url: `${SHOP_URL}/${data.id}`, //pass the id of the shop to be updated
        method: "PUT",
        body: data,
      }),
    }),
    deleteShop: builder.mutation({
      query: (id) => ({
        url: `${SHOP_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
}); //create a slice for shop api endpoints

export const {
  useGetShopsQuery,
  useGetShopQuery,
  useRegisterShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
} = shopApiSlice;
