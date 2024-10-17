import { SHOP_URL } from "../constants.jsx"; // Import the shop URL from constants.jsx
import { apiSlice } from "./apiSlice.js";

export const shopApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query({
      query: () => ({
        url: `${SHOP_URL}`,
        method: "GET",
      }),
      providesTags: ["Shop"], // Provide a tag for all shops
    }),
    getShop: builder.query({
      query: (id) => ({
        url: `${SHOP_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Shop", id }], // Tag for individual shop
    }),
    registerShop: builder.mutation({
      query: (data) => ({
        url: `${SHOP_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Shop"], // Invalidate the shops cache after registration
    }),
    loginShop: builder.mutation({
      query: (data) => ({
        url: `${SHOP_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    updateShop: builder.mutation({
      query: (data) => ({
        url: `${SHOP_URL}/${data.id}`, // Pass the id of the shop to be updated
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Shop", id }], // Invalidate the cache for the updated shop
    }),
    deleteShop: builder.mutation({
      query: (id) => ({
        url: `${SHOP_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Shop", id }], // Invalidate the cache for the deleted shop
    }),
  }),
});

export const {
  useGetShopsQuery,
  useGetShopQuery,
  useRegisterShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
  useLoginShopMutation,
} = shopApiSlice;
