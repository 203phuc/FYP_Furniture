import React from "react";
import ContactSection from "../components/checkout/ContactSection";
import DeliverySection from "../components/checkout/DeliverySection.jsx";
import OrderSummary from "../components/checkout/OrderSummary.jsx";
import PaymentSection from "../components/checkout/PaymentSection.jsx";

const CheckoutPage = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-start p-4 md:p-8 bg-white">
      {/* Left side: Form sections */}
      <div className="w-full md:w-3/5 lg:w-1/3 space-y-6 ">
        <ContactSection />
        <DeliverySection />
        <PaymentSection />
      </div>

      {/* Right side: Order Summary */}
      <div className="w-full md:w-2/5 lg:w-1/3 md:ml-8 mt-8 md:mt-0">
        <OrderSummary />
      </div>
    </div>
  );
};

export default CheckoutPage;
