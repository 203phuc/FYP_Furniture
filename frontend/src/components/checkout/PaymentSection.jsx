import React, { useState } from "react";

const PaymentSection = () => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const handleSubmit = () => {
    // Handle payment submission logic here
    console.log("Payment submitted");
  };

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Payment</h2>

      {/* Payment Method Selection */}
      <div className="mb-4">
        <label className="block mb-2">Select Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="creditCard">Credit Card</option>
          <option value="paypal">PayPal</option>
          {/* Add other payment methods if needed */}
        </select>
      </div>

      {/* Credit Card Details */}
      {paymentMethod === "creditCard" && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Enter card number"
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <div>
              <label className="block mb-2">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-2">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-2">Name on Card</label>
              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="Full Name"
                className="border p-2 w-full"
              />
            </div>
          </div>
        </>
      )}

      {/* Billing Address */}
      <div className="mb-4">
        <label className="block mb-2">Billing Address</label>
        <input
          type="text"
          value={billingAddress}
          onChange={(e) => setBillingAddress(e.target.value)}
          placeholder="Enter your billing address"
          className="border p-2 w-full"
        />
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentSection;
