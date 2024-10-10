import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/layout/Loader.jsx";
import ProductCard from "../components/product/ProductCard";
import {
  useGetProductApprovedQuery,
  useGetProductsQuery,
} from "../redux/slices/productApiSlice";
import styles from "../styles/styles";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");

  const { userInfo } = useSelector((state) => state.auth);

  // Fetch products based on user role
  const { data: sellerProducts, isLoading: isLoadingSeller } =
    useGetProductsQuery(undefined, {
      skip: userInfo?.role !== "seller",
    });
  const { data: approvedProducts, isLoading: isLoadingUser } =
    useGetProductApprovedQuery(undefined, {
      skip: userInfo?.role !== "user",
    });

  // Determine which data to use based on user role
  const dataToUse =
    userInfo?.role === "seller" ? sellerProducts : approvedProducts;
  const isLoading =
    userInfo?.role === "seller" ? isLoadingSeller : isLoadingUser;

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (dataToUse) {
      if (!categoryData) {
        // If no category filter, show all products
        setFilteredData(dataToUse);
      } else {
        // Filter products by category
        const filtered = dataToUse.filter(
          (product) => product.category === categoryData
        );
        setFilteredData(filtered);
      }
    }
  }, [dataToUse, categoryData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px]">
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
