import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // To access user info from Redux store
import { clearCart } from "../redux/slices/cartSlice";
import { useCreateOrderMutation } from "../redux/slices/orderApiSlice";

const Success = () => {
  const { userInfo } = useSelector((state) => state.auth); // Get user info from Redux store
  const { cart } = useSelector((state) => state.cart); // Access cart from Redux state
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState(
    userInfo?.addresses[0] || ""
  ); // Set the default address to the first one
  const [createOrder, { isSuccess, isLoading, error }] =
    useCreateOrderMutation();
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const orderProcessed = useRef(false);

  useEffect(() => {
    if (cart) {
      // Compute the total price when cart changes
      const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    }
  }, [cart]);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value); // Update selected address
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    if (orderProcessed.current) return; // Prevent duplicate orders
    try {
      orderProcessed.current = true;

      // Calculate totalProduct by summing up the quantities of each item
      const totalProduct = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const orderData = {
        buyerId: userInfo._id,
        items: cart.items,
        totalProduct: totalProduct, // Updated to reflect the correct total product count
        totalPrice: totalPrice,
        paymentStatus: "Paid",
        shippingAddress: selectedAddress,
        paidAt: new Date(),
      };

      const { data } = await createOrder(orderData);
      console.log("Order created successfully:", data);
      dispatch(clearCart());
      orderProcessed.current = true;
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const formatAddress = (address) => {
    return `${address.address1}, ${
      address.address2 ? address.address2 + ", " : ""
    }${address.city}, ${address.country} - ${address.zipCode}`;
  };

  if (isLoading)
    return <div style={loadingStyles}>Processing your order...</div>;
  if (error) return <div style={errorStyles}>Error: {error.message}</div>;
  if (orderProcessed.current && isSuccess)
    return (
      <p style={successMessageStyles}>
        Your order has been placed successfully!
      </p>
    );

  return (
    <div style={containerStyles}>
      <h1 style={headerStyles}>Payment Successful!</h1>

      {/* Review Order Section */}
      <div style={reviewSectionStyles}>
        <h3 style={orderReviewTitleStyles}>Review Your Order</h3>
        <div style={orderItemsContainerStyles}>
          {cart?.items?.map((item, index) => (
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
                          const val = value?.value || value; // Extract the 'value' property if it exists
                          if (typeof val === "object") {
                            // For nested objects like Dimensions
                            return `${key}: ${Object.entries(val)
                              .map(
                                ([subKey, subValue]) => `${subKey}: ${subValue}`
                              )
                              .join(", ")}`;
                          }
                          return `${key}: ${val}`; // Render non-object values directly
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
        <div style={totalPriceStyles}>
          <strong>Total: ${totalPrice}</strong>
        </div>
      </div>

      {/* Form to choose shipping address */}
      <form onSubmit={handleOrderSubmit} style={formStyles}>
        <h3 style={addressTitleStyles}>Select Shipping Address</h3>
        <select
          value={selectedAddress}
          onChange={handleAddressChange}
          style={selectStyles}
        >
          {userInfo?.addresses?.map((address, index) => (
            <option key={index} value={address._id}>
              {formatAddress(address)}
            </option>
          ))}
        </select>
        <button type="submit" style={submitButtonStyles}>
          Place Order
        </button>
      </form>
    </div>
  );
};

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

export default Success;
