import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Use any toast notification library you prefer
import {
  useDeleteProductMutation,
  useGetProductsByShopQuery,
} from "../../redux/slices/productApiSlice.js";
import { useAddVariantMutation } from "../../redux/slices/variantApiSlice";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Use the RTK Query hook to fetch products by shop ID
  const {
    data: products = [],
    isLoading,
    isError: isFetchError,
  } = useGetProductsByShopQuery(userInfo?._id);

  const [
    addVariant,
    {
      isError: isAddVariantError,
      isLoading: isAddingVariantLoading,
      isSuccess: isAddVariantSuccess,
    },
  ] = useAddVariantMutation();

  const [deleteProduct] = useDeleteProductMutation();

  const [rows, setRows] = useState([]);

  // If product deletion succeeds, remove product from rows
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      setRows(rows.filter((row) => row.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Handle adding variations
  const handleGenerateVariations = async (productId) => {
    try {
      await addVariant(productId).unwrap();
      toast.success("Variants generated successfully");
    } catch (error) {
      toast.error("Failed to generate variants");
    }
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
      field: "generate_variation",
      flex: 0.8,
      minWidth: 120,
      headerName: "Generate Variation",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleGenerateVariations(params.id)}>
          {isAddingVariantLoading ? "Generating..." : "Generate Variations"}
        </Button>
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

  React.useEffect(() => {
    if (products.length) {
      const mappedRows = products.map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        roomtype: item.roomtype,
        mainImage: item.mainImage,
      }));
      setRows(mappedRows);
    }
  }, [products]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isFetchError ? (
        <div>Error loading products</div>
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
