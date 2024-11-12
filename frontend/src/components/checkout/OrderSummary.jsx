import React from "react";

const OrderSummary = () => {
  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
      {/* Items would be mapped from a list */}
      <div className="space-y-4">
        <div className="flex items-center">
          <img src="item_image_url" alt="item" className="w-16 h-16 mr-4" />
          <div className="flex-grow">
            <p>Item Name</p>
            <p className="text-gray-500">In Stock</p>
          </div>
          <p className="font-semibold">$3,849.00</p>
        </div>
        {/* Add more items as needed */}
      </div>
      <hr className="my-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>$11,203.00</p>
        </div>
        <div className="flex justify-between">
          <p>Order discount</p>
          <p>-$2,279.20</p>
        </div>
        <div className="flex justify-between font-semibold">
          <p>Total</p>
          <p>$9,116.80</p>
        </div>
      </div>
      <input
        type="text"
        placeholder="Discount code"
        className="border w-full p-2 mt-4 rounded"
      />
    </div>
  );
};

export default OrderSummary;
