export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: "GET",
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
        result ? [{ type: "Shop", id: shopId }] : ["Shop"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product" }], // Invalidate product cache to refresh the list
    }),
    getProductDetails: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getProductApproved: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/approved`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id }], // Invalidate cache for the deleted product
    }),
  }),
});

export const {
  useGetProductApprovedQuery,
  useGetProductsQuery,
  useGetProductsByShopQuery,
  useCreateProductMutation,
  useGetProductDetailsQuery,
  useDeleteProductMutation,
} = productApiSlice;
