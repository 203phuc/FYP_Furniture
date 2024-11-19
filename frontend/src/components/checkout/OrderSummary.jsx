import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const OrderSummary = () => {
  const { items: cartItems } = useSelector((state) => state.cart.cart);

  const { subtotal, discount, total } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discount = subtotal * 0.2; // Assuming a 20% discount for this example
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, [cartItems]);

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center">
            <img
              src={item.mainImage.url}
              alt={item.productName}
              className="w-16 h-16 mr-4 object-cover rounded"
            />
            <div className="flex-grow">
              <p className="font-medium">{item.productName}</p>
              {/* <p className="text-sm text-gray-500">
                {Object.entries(item.attributes)
                  .map(([key, value]) => `${key}: ${value.value}`)
                  .join(", ")}
              </p> */}
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-500">
                {item.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <hr className="my-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Order discount</p>
          <p>-${discount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-semibold">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>
      <input
        type="text"
        placeholder="Discount code"
        className="border w-full p-2 mt-4 rounded"
        aria-label="Discount code"
      />
    </div>
  );
};

export default OrderSummary;
