import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useGetOrdersByBuyerIdQuery } from "../../redux/slices/orderApiSlice.js";

const Orders = ({ userId }) => {
  const { data: orders, isLoading, error } = useGetOrdersByBuyerIdQuery(userId);
  const navigate = useNavigate(); // Hook for navigation

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`); // Navigate to the order detail page
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  return (
    <div className="w-full px-5 mt-8">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 shadow-md rounded-md mb-4"
          >
            <h3 className="font-semibold">Order ID: {order._id}</h3>
            <p>Status: {order.paymentStatus}</p>
            <p>Total: ${order.totalPrice}</p>
            <p>Created At: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Updated At: {new Date(order.updatedAt).toLocaleDateString()}</p>
            {/* View Details Button */}
            <button
              onClick={() => handleViewDetails(order._id)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Details
            </button>
          </div>
        ))
      ) : (
        <p>No orders found!</p>
      )}
    </div>
  );
};

export default Orders;
