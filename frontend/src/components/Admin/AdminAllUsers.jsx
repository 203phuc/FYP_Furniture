import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../redux/slices/userApiSlice.js";
import Loader from "../layout/Loader";

const AdminAllUsers = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading, isError, error } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [rows, setRows] = useState([]);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handlePasswordReset = (id) => {
    // Add logic for password reset here, e.g., sending a password reset email
    toast.info(`Password reset link sent for user ID: ${id}`);
  };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },
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
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1.5,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {params.value}
        </div>
      ),
    },
    { field: "role", headerName: "Role", minWidth: 120, flex: 1 },
    {
      field: "createdAt",
      headerName: "Joined Date",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
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
    if (data) {
      console.log(data);
      const mappedRows = data.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      }));
      setRows(mappedRows);
    }
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div>Error loading users: {error?.data?.message || error?.error}</div>
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
                  No users found
                </div>
              ),
            }}
          />
        </div>
      )}
    </>
  );
};

export default AdminAllUsers;
