//make product slice

import { apiSlice } from "./apiSlice.js";
import { PRODUCTS_URL } from "../constants.jsx"; //import the product url from constants.jsx

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: "GET",
      }),
    }),
    getProductsByShop: builder.query({
      query: (shopId) => ({
        url: `${PRODUCTS_URL}/shop/${shopId}`,
        method: "GET",
      }),
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
}); //create a slice for product api endpoints

export const {
  useGetProductsQuery,
  useGetProductsByShopQuery,
  useCreateProductMutation,
} = productApiSlice;
