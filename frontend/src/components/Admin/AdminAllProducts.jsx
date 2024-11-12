import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useToggleProductApprovalMutation,
} from "../../redux/slices/productApiSlice.js";
import Loader from "../Layout/Loader";

const AdminAllProducts = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: products = [],
    isLoading,
    isError: isFetchError,
    error: fetchError,
  } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [toggleProductApproval] = useToggleProductApprovalMutation();
  const [rows, setRows] = useState([]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleApproval = async (id) => {
    try {
      const { approved } = await toggleProductApproval(id).unwrap();
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, approved } : row))
      );
      toast.success(
        `Product ${approved ? "approved" : "unapproved"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update product approval status");
    }
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 250,
      flex: 1.5,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {params.value}
        </div>
      ),
    },
    { field: "department", headerName: "Department", minWidth: 150, flex: 1 },
    { field: "type", headerName: "Type", minWidth: 150, flex: 1 },
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
      field: "approved",
      headerName: "Approved",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Button onClick={() => handleToggleApproval(params.id)}>
          {params.row.approved ? "Unapprove" : "Approve"}
        </Button>
      ),
    },
    {
      field: "delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (products.length) {
      const mappedRows = products.map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        department: product.department,
        type: product.type,
        approved: product.approved,
      }));
      setRows(mappedRows);
    }
  }, [products]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isFetchError ? (
        <div>
          Error loading products:{" "}
          {fetchError?.data?.message || fetchError?.error}
        </div>
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            getRowHeight={() => "auto"}
            components={{
              NoRowsOverlay: () => (
                <div className="flex justify-center items-center h-full">
                  No products found
                </div>
              ),
            }}
          />
        </div>
      )}
    </>
  );
};

export default AdminAllProducts;
