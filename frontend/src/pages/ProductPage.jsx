import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/layout/Loader.jsx";
import ProductCard from "../components/product/ProductCard";
import styles from "../styles/styles";
import { useGetProductsQuery } from "../Redux/slices/productApiSlice.js";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");

  // Fetch products using RTK Query
  const { data: products, isLoading } = useGetProductsQuery();

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (products) {
      if (!categoryData) {
        // If no category filter, show all products
        setFilteredData(products);
      } else {
        // Filter products by category
        const filtered = products.filter(
          (product) => product.category === categoryData
        );
        setFilteredData(filtered);
      }
    }
  }, [products, categoryData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {filteredData &&
                filteredData.map((product, index) => (
                  <ProductCard data={product} key={index} />
                ))}
            </div>
            {filteredData && filteredData.length === 0 && (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No products found!
              </h1>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;
