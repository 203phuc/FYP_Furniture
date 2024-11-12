import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";

// Mock Data for Products (Replace with real API data fetch)
const mockProducts = [
  { id: "1", name: "Product 1" },
  { id: "2", name: "Product 2" },
  { id: "3", name: "Product 3" },
  { id: "4", name: "Product 4" },
  { id: "5", name: "Product 5" },
  // Add more products here
];

// Mock Data for Orders
const mockOrders = [
  {
    _id: "1",
    totalPrice: 100,
    cart: [{ qty: 2 }],
    status: "Delivered",
    createdAt: "2024-11-12T00:00:00Z",
  },
  {
    _id: "2",
    totalPrice: 150,
    cart: [{ qty: 3 }],
    status: "Pending",
    createdAt: "2024-11-10T00:00:00Z",
  },
  // Add more mock orders as needed
];

const mockSellers = [
  { id: "1", name: "Seller 1" },
  { id: "2", name: "Seller 2" },
  // Add more mock sellers as needed
];

const AdminDashboardMain = () => {
  // Fake loading state
  const [loading, setLoading] = useState(true);
  const [adminOrders, setAdminOrders] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]); // To hold the fetched products

  useEffect(() => {
    // Simulating data fetching with timeout
    setTimeout(() => {
      setAdminOrders(mockOrders);
      setSellers(mockSellers);
      setLoading(false);

      // Fetch all products (replace this with real API call)
      setProducts(mockProducts); // Here you would fetch data from API
    }, 1000);
  }, []);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);
  const adminBalance = adminEarning?.toFixed(2);

  // Calculate total products by fetching all the products
  const totalProducts = products.length; // Count the number of products fetched

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
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
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const rows = [];
  adminOrders.forEach((item) => {
    rows.push({
      id: item._id,
      itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
      total: `${item?.totalPrice} $`,
      status: item?.status,
      createdAt: item?.createdAt.slice(0, 10),
    });
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
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
                  Total Earning
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                $ {adminBalance}
              </h5>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <MdBorderClear size={30} className="mr-2" fill="#00000085" />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  All Sellers
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {sellers && sellers.length}
              </h5>
              <Link to="/admin-sellers">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
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
                  Total Products
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {totalProducts}
              </h5>
            </div>
          </div>

          <br />
          <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
          <div className="w-full min-h-[45vh] bg-white rounded">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
