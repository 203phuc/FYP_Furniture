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
  const categoryData = searchParams.get("department"); // Get department from query string
  const pageFromQuery = parseInt(searchParams.get("page") || 1); // Default to page 1
  const limit = 10; // Number of products per page
  const [page, setPage] = useState(pageFromQuery);
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch products based on user role
  const { data: sellerProducts, isLoading: isLoadingSeller } =
    useGetProductsQuery({ page, limit }, { skip: userInfo?.role !== "seller" });

  const { data: approvedProducts, isLoading: isLoadingUser } =
    useGetProductApprovedQuery(
      { department: categoryData, page, limit },
      { skip: userInfo?.role === "seller" }
    );

  // Determine which data to use based on user role
  const dataToUse =
    userInfo?.role === "seller" ? sellerProducts : approvedProducts;
  const isLoading =
    userInfo?.role === "seller" ? isLoadingSeller : isLoadingUser;

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (dataToUse) {
      console.log(dataToUse);
      const { products } = dataToUse; // Use `products` field from the backend response
      if (!categoryData) {
        setFilteredData(products);
      } else {
        console.log("products", products);
        const filtered = products.filter(
          (product) => product.department.toLowerCase() === categoryData
        );
        setFilteredData(filtered);
      }
    }
  }, [dataToUse, categoryData]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    searchParams.set("page", newPage);
    window.history.replaceState(null, "", `?${searchParams.toString()}`);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="py-8">
          <div className={`${styles.section} container mx-auto px-4`}>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredData &&
                filteredData.map((product, index) => (
                  <div key={index} className="flex justify-center">
                    <div className="w-full max-w-[500px]">
                      <ProductCard data={product} />
                    </div>
                  </div>
                ))}
            </div>
            {filteredData && filteredData.length === 0 && (
              <h1 className="text-center w-full py-20 text-2xl font-semibold">
                No products found!
              </h1>
            )}
            {/* Pagination Controls */}
            {dataToUse && (
              <div className="flex justify-center mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">{page}</span>
                <button
                  disabled={page === dataToUse.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;
