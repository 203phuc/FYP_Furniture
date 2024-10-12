import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetProductsByShopQuery,
} from "../../redux/slices/productApiSlice.js"; // Update the import path as necessary
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Use the RTK Query hook to fetch products by shop ID
  const { data: products = [], isLoading } = useGetProductsByShopQuery(
    userInfo._id
  );

  const [deleteProduct] = useDeleteProductMutation(); // Hook to delete a product

  const handleDelete = async (id) => {
    await deleteProduct(id);
    // Optionally handle the response or show a success message
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 250,
      flex: 1.5,
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "roomtype",
      headerName: "Room Type",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "main_image",
      headerName: "Image",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        console.log(params); // Log the entire params object

        const imageUrl = params.row.mainImage ? params.row.mainImage.url : ""; // Check if params.value exists
        return (
          <img
            src={imageUrl}
            alt={params.row.name}
            style={{ width: 50, height: 50 }}
          />
        );
      },
    },
    {
      field: "preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = products.map((item) => ({
    id: item._id,
    name: item.name,
    description: item.description,
    category: item.category,
    roomtype: item.roomtype,
    mainImage: item.mainImage,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;
