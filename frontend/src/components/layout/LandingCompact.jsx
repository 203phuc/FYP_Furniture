import React from "react";

export default function Component() {
  return (
    <div className="w-screen h-screen overflow-y-auto">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <img
          src="//www.arhaus.com/cdn/shop/files/2024_Holiday_HP_Upholstery_Desktop_1440x.jpg?v=1730743823"
          alt="Cozy living room with holiday decorations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/20">
          <p className="text-sm md:text-base tracking-widest mb-2">
            ARHAUS QUALITY UPHOLSTERY
          </p>
          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            SOFTNESS FOR
            <br />
            THE SEASON
          </h1>
          <button className="bg-white text-black px-8 py-2 text-sm md:text-base hover:bg-gray-100 transition">
            SHOP LIVING
          </button>
        </div>
      </section>

      {/* Middle Grid Section */}
      <div className="grid md:grid-cols-2 h-screen">
        <section className="relative h-full">
          <div className="absolute inset-0 bg-[#2C2C2C]">
            <img
              src="https://cdn.shopify.com/s/files/1/0507/9017/0795/files/2025_Holiday_HP_2-Up_Carousel_Living.jpg?v=1730732515"
              alt="Cozy living room with holiday decorations"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h2 className="text-3xl md:text-5xl font-serif mb-6">BE MERRY</h2>
              <button className="bg-white text-black px-8 py-2 text-sm md:text-base hover:bg-gray-100 transition">
                SHOP SEATING
              </button>
            </div>
          </div>
        </section>

        <section className="relative h-full">
          <div className="absolute inset-0 bg-[#2C2C2C]">
            <img
              src="https://cdn.shopify.com/s/files/1/0507/9017/0795/files/2025_Holiday_HP_2-Up_Carousel_Dining.jpg?v=1730732110"
              alt="Cozy living room with holiday decorations"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h2 className="text-3xl md:text-5xl font-serif mb-6">
                BE BRIGHT
              </h2>
              <button className="bg-white text-black px-8 py-2 text-sm md:text-base hover:bg-gray-100 transition">
                SHOP DINING
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Section */}
      <section className="relative h-screen w-full">
        <div className="absolute inset-0 bg-[#2C2C2C]">
          <img
            src="//www.arhaus.com/cdn/shop/files/2024_Holiday_HP_Showroom_Desktop_4d9d901b-cc65-4e32-a60f-16323f50880c_1440x.jpg?v=1730737593"
            alt="Cozy living room with holiday decorations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
            <h2 className="text-3xl md:text-5xl font-serif max-w-2xl mb-6">
              IMMERSE YOURSELF
              <br />
              IN INSPIRATION
            </h2>
            <button className="bg-white text-black px-8 py-2 text-sm md:text-base hover:bg-gray-100 transition">
              FIND YOUR STORE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
