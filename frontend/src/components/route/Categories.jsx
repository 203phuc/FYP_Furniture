import React, { useEffect, useRef } from "react";
import { register } from "swiper/element/bundle";
import "swiper/swiper-bundle.css";
import rightArrowIcon from "../../assets/icons8-arrow-50.png";
import leftArrowIcon from "../../assets/left-arrow.png";

// Register the Swiper Web Components
register();

const Categories = () => {
  const swiperRef = useRef(null);

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
  ];

  useEffect(() => {
    const swiperContainer = swiperRef.current;

    // Custom Swiper parameters
    const params = {
      slidesPerView: 3,
      spaceBetween: 30,
      navigation: true,
      autoplay: { delay: 3000 },
      pagination: { clickable: true },
      slidesOffsetBefore: 50,
      slidesOffsetAfter: 50,
      injectStyles: [
        `
          .swiper-button-next,
          .swiper-button-prev {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            padding: 8px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            z-index: 10; /* Ensure buttons are above the slides */
          }
          .swiper-button-next {
            background-image: url(${rightArrowIcon});
            background-size: 60% auto;
            background-position: center;
            background-repeat: no-repeat;
          }
          .swiper-button-prev {
            background-image: url(${leftArrowIcon}); /* Use your icon URL */
            background-size: 60% auto; /* Adjust size */
            background-position: center;
            background-repeat: no-repeat;
          }
          .swiper-button-next svg,
          .swiper-button-prev svg {
            display: none; /* This will hide the SVG */
          }
        `,
      ],
    };

    // Assign parameters to swiper-container
    Object.assign(swiperContainer, params);

    // Initialize swiper
    swiperContainer.initialize();
  }, []);

  return (
    <>
      <div className="text-center m-11 ">
        <h6 className="mb-4 xl:text-7xl capitalize font-thin">
          A CELEBRATION OF PERSONAL STYLE
        </h6>
      </div>
      <swiper-container ref={swiperRef} init="false" class="custom-swiper">
        {slides.map((slide) => (
          <swiper-slide key={slide.index} class="custom-slide">
            <div
              onClick={() => (window.location.href = slide.link)}
              className="cursor-pointer w-full h-auto p-4 bg-white rounded-lg shadow-md"
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
          </swiper-slide>
        ))}
      </swiper-container>
    </>
  );
};

export default Categories;
