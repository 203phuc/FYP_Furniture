import { VARIANT_URL } from "../constants.jsx";
import { apiSlice } from "./apiSlice.js";

// fi the route of the variant api
export const variantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addVariant: builder.mutation({
      query: (productId) => ({
        url: `${VARIANT_URL}`,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Product"], // Invalidate product cache after adding variant
    }),
    updateVariantDetails: builder.mutation({
      query: (formData, Id) => ({
        url: `${VARIANT_URL}/${Id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { variantId }) => [
        { type: "Variant", id: variantId },
      ],
    }),
    getVariantsByProduct: builder.query({
      query: (productId) => `${VARIANT_URL}/product/${productId}`,
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
        url: `${VARIANT_URL}/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, variantId) => [
        { type: "Variant", id: variantId },
      ],
    }),
    checkIfProductHasVariants: builder.query({
      query: (productId) => `${VARIANT_URL}/product/${productId}/check`,
      transformResponse: (response) => response.hasVariants,
      providesTags: (result, error, productId) =>
        result
          ? [{ type: "Product", id: productId }] // Provide Product tag
          : [{ type: "Product", id: productId }],
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
