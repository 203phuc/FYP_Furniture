import { apiSlice } from "./apiSlice.js";

export const variantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addVariant: builder.mutation({
      query: (productId) => ({
        url: `/variants`,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Product"], // Invalidate product cache after adding variant
    }),
    updateVariantDetails: builder.mutation({
      query: ({ variantId, ...variantDetails }) => ({
        url: `/variants/${variantId}`,
        method: "PUT",
        body: variantDetails,
      }),
      invalidatesTags: (result, error, { variantId }) => [
        { type: "Variant", id: variantId },
      ],
    }),
    getVariantsByProduct: builder.query({
      query: (productId) => `/variants/product/${productId}`,
      providesTags: (result, error, productId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Variant", id: _id })),
              { type: "Product", id: productId },
            ]
          : [{ type: "Product", id: productId }],
    }),
    deleteVariant: builder.mutation({
      query: (variantId) => ({
        url: `/variants/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, variantId) => [
        { type: "Variant", id: variantId },
      ],
    }),
    checkIfProductHasVariants: builder.query({
      query: (productId) => `/variants/product/${productId}/check`,
      transformResponse: (response) => response.hasVariants,
      providesTags: (result, error, productId) =>
        result ? [{ type: "Product", id: productId }] : [],
    }),
  }),
});

export const {
  useAddVariantMutation,
  useUpdateVariantDetailsMutation,
  useGetVariantsByProductQuery,
  useDeleteVariantMutation,
  useCheckIfProductHasVariantsQuery,
} = variantApiSlice;
