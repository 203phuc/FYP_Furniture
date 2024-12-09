import React from "react";
import { useSelector } from "react-redux"; // To access user info from Redux store
import { useParams } from "react-router-dom"; // To access order ID from the URL
import { useGetOrderByIdQuery } from "../../redux/slices/orderApiSlice"; // Replace with the appropriate query hook from your API slice

const OrderDetail = () => {
  const { id } = useParams(); // Get the order ID from the route parameter
  const { userInfo } = useSelector((state) => state.auth); // Access user info from Redux store

  const { data: order, isLoading, error } = useGetOrderByIdQuery(id); // Fetch order data using ID

  const formatAddress = (address) => {
    if (!address) return "No address provided";
    return `${address.address1}, ${
      address.address2 ? address.address2 + ", " : ""
    }${address.city}, ${address.country} - ${address.zipCode}`;
  };

  if (isLoading)
    return <div style={loadingStyles}>Loading order details...</div>;
  if (error) return <div style={errorStyles}>Error: {error.message}</div>;

  return (
    <div style={containerStyles}>
      <h1 style={headerStyles}>Order Details</h1>

      {/* Order Information */}
      <div style={reviewSectionStyles}>
        <h3 style={orderReviewTitleStyles}>Order ID: {order._id}</h3>
        <p>
          <strong>Buyer:</strong> {userInfo?.name || "Guest"}
        </p>
        <p>
          <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
        </p>
        <p>
          <strong>Total Products:</strong> {order.totalProduct}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Shipping Address:</strong>{" "}
          {formatAddress(order.shippingAddress)}
        </p>
      </div>

      {/* Order Items */}
      <div style={orderItemsContainerStyles}>
        <h3 style={orderReviewTitleStyles}>Items in Your Order</h3>
        {order.items.map((item, index) => (
          <div
            key={index}
            style={{ ...orderItemStyles, display: "flex", gap: "16px" }}
          >
            {/* Image Section */}
            <div className=" aspect-[4/3] w-1/3">
              <img
                src={item?.mainImage?.url}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Section */}
            <div style={{ flex: 1 }}>
              <div>{item.productName}</div>
              <div>
                Attributes:{" "}
                {typeof item.attributes === "object"
                  ? Object.entries(item.attributes)
                      .map(([key, value]) => {
                        const val = value?.value || value;
                        if (typeof val === "object") {
                          return `${key}: ${Object.entries(val)
                            .map(
                              ([subKey, subValue]) => `${subKey}: ${subValue}`
                            )
                            .join(", ")}`;
                        }
                        return `${key}: ${val}`;
                      })
                      .join(" | ")
                  : item.attributes}
              </div>
              <div>Quantity: {item.quantity}</div>
              <div>Price: ${item.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles (same as your existing styles)
// Styles
const containerStyles = {
  padding: "20px",
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
};

const headerStyles = {
  textAlign: "center",
  color: "#4CAF50",
};

const successMessageStyles = {
  fontSize: "1.2em",
  color: "#555",
  textAlign: "center",
  margin: "20px 0",
};

const formStyles = {
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const addressTitleStyles = {
  fontSize: "1.5em",
  color: "#333",
  marginBottom: "10px",
};

const selectStyles = {
  width: "100%",
  padding: "10px",
  fontSize: "1em",
  borderRadius: "5px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  marginBottom: "20px",
  outline: "none",
};

const submitButtonStyles = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontSize: "1em",
  cursor: "pointer",
};

const loadingStyles = {
  textAlign: "center",
  fontSize: "1.5em",
  color: "#ff9800",
};

const errorStyles = {
  textAlign: "center",
  fontSize: "1.5em",
  color: "#f44336",
};

const reviewSectionStyles = {
  marginTop: "20px",
  padding: "10px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const orderReviewTitleStyles = {
  fontSize: "1.5em",
  marginBottom: "10px",
  color: "#333",
};

const orderItemsContainerStyles = {
  marginBottom: "20px",
};

const orderItemStyles = {
  marginBottom: "10px",
  paddingBottom: "10px",
  borderBottom: "1px solid #ccc",
};

const totalPriceStyles = {
  fontSize: "1.2em",
  fontWeight: "bold",
  textAlign: "right",
};

export default OrderDetail;
