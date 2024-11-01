import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: "GET",
        refetchOnMountOrArgChange: true,
      }),
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: "Product", id: _id }))
          : ["Product"],
    }),
    getProductsByShop: builder.query({
      query: (shopId) => ({
        url: `${PRODUCTS_URL}/shop/${shopId}`,
        method: "GET",
      }),
      providesTags: (result, error, shopId) =>
        result
          ? [
              { type: "Shop", id: shopId },
              ...result.map(({ _id }) => ({ type: "Product", id: _id })),
            ]
          : [{ type: "Shop", id: shopId }],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product" }], // Invalidate product cache to refresh the list
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }], // Invalidate cache for the updated product
    }),

    getProductDetails: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }], // Ensure 'id' is being used from the query
    }),

    getProductApproved: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/approved`,
        method: "GET",
      }),
      providesTags: ["Product"],
      refetchOnMountOrArgChange: true,
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product" }], // Invalidate cache for the deleted product
    }),
  }),
});

export const {
  useGetProductApprovedQuery,
  useGetProductsQuery,
  useGetProductsByShopQuery,
  useCreateProductMutation,
  useUpdateProductMutation, // Export the update hook
  useGetProductDetailsQuery,
  useDeleteProductMutation,
} = productApiSlice;
