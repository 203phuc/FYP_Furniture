import React from "react";
import { Link } from "react-router-dom";
import abstractCloud from "../../assets/abstractcloud3.jpg"; // Import the smallest image
import combinedImage from "../../assets/combinedfinal_enhanced.jpg"; // Import the biggest image
import styles from "../../styles/styles";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] 800px:min-h-[100vh] overflow-hidden">
      <div className="relative w-full h-full">
        <picture>
          {/* Smallest size image for mobile */}
          <source
            srcSet={`${abstractCloud} 1x, ${abstractCloud} 2x`}
            media="(max-width: 767px)"
            sizes="100vw"
          />

          {/* Mid-size image for tablets */}
          <source
            srcSet={`${abstractCloud}`}
            media="(max-width: 1199px)"
            sizes="100vw, 20vh"
          />

          {/* Largest size image for desktops */}
          <source
            srcSet={`${combinedImage} 1x, ${combinedImage} 2x`}
            media="(min-width: 1200px)"
            sizes="1800px, 100vw"
          />

          {/* Default image if no match */}
          <img
            src={combinedImage}
            alt="Let every space of your home reflect the things you love."
            className="object-cover"
          />
        </picture>
        <div className="absolute left-0 top-0 flex flex-col items-center gap-8 md:gap-12 lg:gap-16 1300px:gap-20 2xl:gap-56  text-white h-full w-full  1200px:w-[44.48%]">
          <div className="subheading-lg mt-9 text-base 800px:text-lg md:text-xl lg:text-2xl">
            INTRODUCING FALL 2024
          </div>
          <h1 className="leading-[1.2] text-center text-3xl 800px:text-5xl lg:text-6xl xl:text-7xl capitalize">
            LET EVERY SPACE OF YOUR HOME REFLECT THE THINGS YOU LOVE
          </h1>
          <Link to="/collections/new-arrivals" className="inline-block">
            <div
              className={`bg-indigo-50 hover:bg-blue-700 text-black font-Poppins text-lg py-2 px-10`}
            >
              Shop New Arrivals
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
