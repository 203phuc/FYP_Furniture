import { Button, Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeleteProductMutation,
  useGetProductsByShopQuery,
} from "../../redux/slices/productApiSlice.js";
import {
  useAddVariantMutation,
  useCheckIfProductHasVariantsQuery,
} from "../../redux/slices/variantApiSlice";
import Loader from "../layout/Loader";

const EditOptions = ({ productId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onClick={handleClick}>Edit Options</Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={handleClose}
          component={Link}
          to={`/edit-product/${productId}`}
        >
          Edit Product
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={Link}
          to={`/variant/${productId}`}
        >
          Edit Variants
        </MenuItem>
      </Menu>
    </>
  );
};

const AllProducts = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: products = [],
    isLoading,
    isError: isFetchError,
    error: fetchError,
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

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      setRows(rows.filter((row) => row.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

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
      hide: window.innerWidth < 960,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      minWidth: 150,
      flex: 1,
      hide: window.innerWidth < 960,
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 150,
      flex: 1,
      hide: window.innerWidth < 960,
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
      renderCell: (params) => {
        const { data: hasVariants, isLoading: isChecking } =
          useCheckIfProductHasVariantsQuery(params.id);

        if (isChecking) {
          return <span>Checking...</span>;
        }
        return hasVariants ? (
          <span>Variants Exist</span>
        ) : (
          <Button onClick={() => handleGenerateVariations(params.id)}>
            {isAddingVariantLoading ? "Generating..." : "Generate Variations"}
          </Button>
        );
      },
    },
    {
      field: "delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete size={20} />
          </Button>
          <EditOptions productId={params.id} />
        </>
      ),
    },
  ];

  useEffect(() => {
    if (products.length) {
      const mappedRows = products.map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        department: item.department,
        type: item.type,
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

export default AllProducts;
