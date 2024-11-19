import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useFetchCartQuery,
  useSyncCartMutation,
} from "../redux/slices/cartApiSlice";
import { updateCart } from "../redux/slices/cartSlice";

// Custom hook to handle clicks outside of a component
const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback]);

  return ref;
};

function CartPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: cartData,
    isLoading,
    isError,
  } = useFetchCartQuery(userInfo?._id);
  const [syncCart] = useSyncCartMutation();
  const [quantities, setQuantities] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockLimitDialogOpen, setStockLimitDialogOpen] = useState(false);
  const [pendingDeletionItem, setPendingDeletionItem] = useState(null);
  const [exceededItem, setExceededItem] = useState(null);
  const localCart = useSelector((state) => state.cart.cart);
  const [isCheckoutLoading, setCheckOutIsLoading] = useState(false);
  const navigate = useNavigate();
  // Use the custom hook for both dialogs
  const deleteDialogRef = useOutsideClick(() => setDeleteDialogOpen(false));
  const stockLimitDialogRef = useOutsideClick(() =>
    setStockLimitDialogOpen(false)
  );

  const handleQuantityChange = (variantId, newQuantity) => {
    const item = localCart.items.find((item) => item.variantId === variantId);
    if (item && newQuantity > item.stockQuantity) {
      setExceededItem(variantId);
      setStockLimitDialogOpen(true);
    } else {
      if (newQuantity === 0) {
        setPendingDeletionItem(variantId);
        setDeleteDialogOpen(true);
      } else {
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [variantId]: newQuantity,
        }));
      }
    }
  };

  const handleConfirmStockLimit = () => {
    setStockLimitDialogOpen(false);
    const item = localCart.items.find(
      (item) => item.variantId === exceededItem
    );
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [exceededItem]: item.stockQuantity,
    }));
    setExceededItem(null);
  };

  const handleCancelStockLimit = () => {
    setStockLimitDialogOpen(false);
    setExceededItem(null);
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    await handleRemoveItem(pendingDeletionItem);
    setPendingDeletionItem(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [pendingDeletionItem]: 1,
    }));
    setPendingDeletionItem(null);
  };

  const handleUpdateCart = async () => {
    const updatedItems = cartData.cart.items.map((item) => ({
      ...item,
      quantity: quantities[item.variantId] || item.quantity,
    }));
    try {
      await updateCart(cartData);
      await syncCart({ user_id: userInfo.id, items: updatedItems });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveItem = async (variantId) => {
    const updatedItems = cartData.cart.items.filter(
      (item) => item.variantId !== variantId
    );
    await syncCart({ user_id: userInfo.id, items: updatedItems });
  };
  const handleCheckout = async () => {
    // navigate("/checkout");
    // return;
    setCheckOutIsLoading(true);

    try {
      const stripePromise = loadStripe(
        "pk_test_51QIQTZGhtFGP1I6WpotjNdt2FaqWtnQXH9P0P43Tlon2gIuu4cNQF0hHE87SZatgYBQhP8D8CBwXWcu7pah4L8hC00coeomHjD"
      );
      const stripe = await stripePromise;
      const response = await fetch(
        "http://localhost:5000/api/checkout/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
          body: JSON.stringify({ cartItems: cartData.cart.items }), // Use cartData instead of cartItems
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCheckOutIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" align="center">
        Error loading cart data
      </Typography>
    );
  }

  return (
    <Box maxWidth="lg" margin="auto" padding={4}>
      <ToastContainer />
      <Typography variant="h4" component="h1" gutterBottom>
        Your Cart
      </Typography>
      {cartData.cart.items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Grid container spacing={4}>
          {cartData.cart.items.map((item) => {
            const localItem = localCart.items.find(
              (localItem) => localItem.variantId === item.variantId
            );
            const availableQuantity = localItem ? localItem.stockQuantity : 0;
            return (
              <Grid item xs={12} key={item.variantId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.productName}
                    </Typography>
                    <Typography>
                      Available Quantity: {availableQuantity}
                    </Typography>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography>Price: ${item.price.toFixed(2)}</Typography>
                        <TextField
                          label="Quantity"
                          type="number"
                          InputProps={{ inputProps: { min: 1 } }}
                          value={
                            quantities[item.variantId] !== undefined
                              ? quantities[item.variantId]
                              : item.quantity
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^[0-9]*$/.test(value)) {
                              handleQuantityChange(
                                item.variantId,
                                value === "" ? "" : parseInt(value, 10)
                              );
                            }
                          }}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                              e.preventDefault();
                            }
                          }}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item>
                        <img
                          src={item.mainImage.url}
                          alt={item.productName}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveItem(item.variantId)}
                      color="error"
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginTop={2}
            >
              <Typography variant="h6">
                Total: ${cartData.totalPrice.toFixed(2)}
              </Typography>
              <Box>
                <Button
                  onClick={handleUpdateCart}
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "8px" }}
                >
                  Save Cart
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full"
                  variant="contained"
                  color="secondary"
                >
                  {isCheckoutLoading ? "Processing..." : "Checkout"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      {/* Confirm Removal Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-deletion-dialog-title"
        aria-describedby="confirm-deletion-dialog-description"
        ref={deleteDialogRef}
      >
        <DialogTitle id="confirm-deletion-dialog-title">
          Confirm Removal
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-deletion-dialog-description">
            Quantity is set to 0. Do you want to remove this item from your
            cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Stock Limit Exceeded Dialog */}
      <Dialog
        open={stockLimitDialogOpen}
        onClose={handleCancelStockLimit}
        aria-labelledby="stock-limit-dialog-title"
        aria-describedby="stock-limit-dialog-description"
        ref={stockLimitDialogRef}
      >
        <DialogTitle id="stock-limit-dialog-title">
          Stock Limit Exceeded
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="stock-limit-dialog-description">
            The quantity you entered exceeds the available stock. Please enter a
            quantity of
            {exceededItem &&
              localCart.items.find((item) => item.variantId === exceededItem)
                .stockQuantity}{" "}
            or less.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelStockLimit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmStockLimit} color="error">
            Set to Max Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CartPage;
