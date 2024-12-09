import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
// import { getAllOrdersOfShop } from "../../redux/actions/order"; // Order data action
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGetEarningsByShopQuery,
  useGetOrdersByShopQuery,
  useGetProductsSoldByShopQuery,
} from "../../redux/slices/orderApiSlice";
import { useGetProductsByShopQuery } from "../../redux/slices/productApiSlice.js";
const DashboardHero = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth); // Get userInfo from Redux

  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useGetOrdersByShopQuery(userInfo?._id);
  const {
    data: products = [],
    isLoading,
    isError: isFetchError,
    error: fetchError,
  } = useGetProductsByShopQuery(userInfo?._id);

  const {
    data: earnings = 0,
    isLoading: isLoadingEarnings,
    isError: isErrorEarnings,
    error: errorEarnings,
  } = useGetEarningsByShopQuery(userInfo?._id);

  const {
    data: productSold = 0,
    isLoading: isLoadingProductSold,
    isError: isErrorProductSold,
    error: errorProductSold,
  } = useGetProductsSoldByShopQuery(userInfo?._id);
  useEffect(() => {
    // dispatch(getAllOrdersOfShop(userInfo._id)); // Fetch orders for the user
    // dispatch(getAllProductsShop(userInfo._id)); // Fetch products for the user
  }, [dispatch, userInfo?._id]); // Ensure user ID is available
  // User's available balance
  // Prepare rows for the DataGrid
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (orders && orders.shopOrders && orders.shopOrders.length > 0) {
      const formattedRows = orders.shopOrders.map((order) => ({
        id: order._id, // Ensure `id` is present and unique
        itemsQty: order.items.reduce((acc, item) => acc + item.quantity, 0),
        total: "US$ " + order.totalPrice.toFixed(2),
        status: order.paymentStatus,
      }));
      setRows(formattedRows);
    }
  }, [orders]);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.paymentStatus === "Paid" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/dashboard/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  // orders && // Ensure orders data is available
  // orders.forEach((item) => {
  //   row.push({
  //     id: item._id,
  //     itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
  //     total: "US$ " + item.totalPrice,
  //     status: item.status,
  //   });
  // });

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Account Balance{" "}
              <span className="text-[16px]">(with 10% service charge)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {isLoadingEarnings ? (
              <span className="text-[#077f9c]">Loading...</span>
            ) : isErrorEarnings ? (
              <span className="text-[#077f9c]">
                Error:{" "}
                {errorEarnings?.data?.message || "An unexpected error occurred"}
              </span>
            ) : (
              <>
                <div>
                  Original Earnings:{" "}
                  <span className="font-bold">
                    US$ {earnings.totalEarnings.toFixed(2)}
                  </span>
                </div>
                <div>
                  Earnings After Deduction:{" "}
                  <span className="font-bold">
                    US$ {earnings.earningsAfterDeduction.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </h5>

          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c]">Withdraw Money</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Product sold
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {isLoadingProductSold ? (
              <span className="text-[#077f9c]">Loading...</span>
            ) : isErrorProductSold ? (
              <span className="text-[#077f9c]">Error: {errorProductSold}</span>
            ) : (
              productSold.totalProductsSold
            )}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            Total {products.length}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      {isLoadingOrders ? (
        <p>Loading...</p>
      ) : isErrorOrders ? (
        <p>
          Error: {errorOrders?.data?.message || "An unexpected error occurred"}
        </p>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      )}
    </div>
  );
};

export default DashboardHero;
