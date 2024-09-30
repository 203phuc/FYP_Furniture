import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
// Your custom styles if needed

export default function App() {
  const slides = [
    {
      index: 1,
      image:
        "https://www.arhaus.com/cdn/shop/files/FallCarousel-1.jpg?v=1724192169",
      title: "HANDCRAFTING THE INCREDIBLE",
      description:
        "A masterclass in craftsmanship, our Berwick Sofa is meticulously hand-built and hand-tufted by artisans in North Carolina.",
      link: "/collections/upholstery",
      cta: "SHOP UPHOLSTERY",
    },
    {
      index: 2,
      image:
        "https://www.arhaus.com/cdn/shop/files/FallCarousel-2.jpg?v=1724192176",
      title: "A FINE LINE",
      description:
        "Meet Astor, a new collection richly designed and devastatingly detailed to create an air of easy sophistication in almost any space.",
      link: "/collections/reeded",
      cta: "SHOP REEDING",
    },
    {
      index: 3,
      image:
        "https://www.arhaus.com/cdn/shop/files/FallCarousel-3.jpg?v=1724192189",
      title: "IN WITH THE NEW",
      description:
        "Embrace statement-making silhouettes in distinctive reeded glass, organically inspired stone, reclaimed wood, and more.",
      link: "/collections/lighting",
      cta: "SHOP LIGHTING",
    },
    {
      index: 4,
      image:
        "https://www.arhaus.com/cdn/shop/files/FallCarousel-4.jpg?v=1724192193",
      title: "WILDLY BEAUTIFUL",
      description:
        "Introducing Fitzgerald, a collection designed to bring the exotic graining of santos wood to bedrooms and gathering spaces.",
      link: "/collections/dining",
      cta: "SHOP DINING",
    },
    // Add more slides as needed...
  ];

  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={30}
      navigation
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.index} style={{ listStyle: "none" }}>
          <div
            onClick={() => (window.location.href = slide.link)}
            className="cursor-pointer w-80"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-auto"
            />
            <h5 className="text-lg font-semibold mt-4">{slide.title}</h5>
            <p className="text-sm mt-2 text-gray-600">{slide.description}</p>
            <a
              href={slide.link}
              className="text-blue-600 font-bold mt-2 block hover:underline"
            >
              {slide.cta}
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
