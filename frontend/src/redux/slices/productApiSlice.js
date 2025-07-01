import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => {
        const { department, tags } = params || {}; // Ensure params is always defined, destructure department and tags safely
        console.log("params", params);
        const queryParams = new URLSearchParams();

        // Only append department and tags if they are provided
        if (department) queryParams.append("department", department);
        if (tags) queryParams.append("tags", tags);

        const queryString = queryParams.toString();

        // Return the URL with the query parameters if they exist
        return {
          url: `${PRODUCTS_URL}${queryString ? `?${queryString}` : ""}`,
          method: "GET",
          refetchOnMountOrArgChange: true,
        };
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? result.map(({ _id }) => ({ type: "Product", id: _id }))
          : result
          ? [{ type: "Product", id: result._id }]
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
      query: (params) => {
        const { department, tags } = params || {}; // Safely destructure
        console.log("params", params);

        // Build query parameters conditionally
        const queryParams = new URLSearchParams();
        if (department) queryParams.append("department", department);
        if (tags) queryParams.append("tags", tags);

        const queryString = queryParams.toString();
        console.log("queryString", queryString);

        return {
          url: `${PRODUCTS_URL}/approved${
            queryString ? `?${queryString}` : ""
          }`, // Use the /approved endpoint with any filters
          method: "GET",
          refetchOnMountOrArgChange: true,
        };
      },
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product" }], // Invalidate cache for the deleted product
    }),

    toggleProductApproval: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}/toggle-approval`,
        method: "PATCH",
      }),
      invalidatesTags: ["Product"], // Invalidate to refetch updated products
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
  useToggleProductApprovalMutation,
} = productApiSlice;
