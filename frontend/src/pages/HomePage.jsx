import React from "react";
import Hero from "../components/layout/Hero";
import LandingCompact from "../components/layout/LandingCompact";
import Categories from "../components/route/Categories";
const HomePage = () => {
  return (
    <>
      <Hero />
      <Categories />
      <LandingCompact />
    </>
  );
};

export default HomePage;
