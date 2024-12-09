import { ORDER_URL } from "../constants"; // Define ORDER_URL if not already defined
import { apiSlice } from "./apiSlice"; // Assuming apiSlice is defined in a separate file

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: ORDER_URL,
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"], // Invalidate "Order" tag after creating a new order
    }),

    // Fetch order by ID
    getOrderById: builder.query({
      query: (orderId) => `${ORDER_URL}/${orderId}`,
      providesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    // Fetch orders by buyer ID
    getOrdersByBuyerId: builder.query({
      query: (buyerId) => `${ORDER_URL}/user/${buyerId}`,
      providesTags: (result, error, buyerId) => [
        { type: "Order", id: buyerId },
      ],
    }),

    // Fetch orders by shop ID (new endpoint)
    getProductsSoldByShop: builder.query({
      query: (shopId) => `${ORDER_URL}/shop/sold/${shopId}`,
      providesTags: (result, error, shopId) => [{ type: "Order", id: shopId }],
    }),

    // Fetch all orders
    getAllOrders: builder.query({
      query: () => `${ORDER_URL}`,
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: "Order", id: _id })) : [],
    }),
    //ger order by shop
    getOrdersByShop: builder.query({
      query: (shopId) => `${ORDER_URL}/shop/${shopId}`,
      providesTags: (result, error, shopId) => [{ type: "Order", id: shopId }],
    }),

    // Update the status of an order
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDER_URL}/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
      ],
    }),
    //Get earnings by shop
    getEarningsByShop: builder.query({
      query: (shopId) => `${ORDER_URL}/shop/earnings/${shopId}`,
      providesTags: (result, error, shopId) => [{ type: "Order", id: shopId }],
    }),
    // Delete an order
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetOrdersByBuyerIdQuery,
  useGetProductsSoldByShopQuery, // Export the hook for getting orders by shopId
  useGetOrdersByShopQuery,
  useGetEarningsByShopQuery,
  useGetAllOrdersQuery, // Export the hook for getting all orders
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApiSlice;
