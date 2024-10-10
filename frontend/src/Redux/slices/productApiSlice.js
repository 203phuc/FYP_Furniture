import { PRODUCTS_URL } from "../constants.jsx"; // Import the product URL from constants.jsx
import { apiSlice } from "./apiSlice.js";

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
    // Add product details API call here
    getProductDetails: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "GET",
      }),
    }),
    getProductApproved: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/approved`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProductApprovedQuery,
  useGetProductsQuery,
  useGetProductsByShopQuery,
  useCreateProductMutation,
  useGetProductDetailsQuery, // Export the new hook for product details
} = productApiSlice;
