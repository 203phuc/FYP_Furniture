import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import ThreeDModelViewer from "./components/product/ThreeDModelViewer";
import OrderDetail from "./components/profile/OrderDetail";
import ProtectedRoute from "./components/route/ProtectedRoute";
import EditProductPage from "./components/Shop/EditProduct";
import Success from "./components/Success.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderPage from "./pages/OrderPage";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ShopCreatePage from "./pages/shop/ShopCreatePage.jsx";
import ShopDashboardPage from "./pages/shop/ShopDashboardPage.jsx";
import ShopLoginPage from "./pages/shop/ShopLoginPage.jsx";
import VariantPage from "./pages/shop/VariantPage.jsx";
import VerifyPage from "./pages/VerifyPage";
import store from "./redux/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyPage />} />
      <Route path="/shop-create" element={<ShopCreatePage />} />
      <Route path="/shop-login" element={<ShopLoginPage />} />
      {/* <Route path="/ar" element={<ARHitTest />} /> */}
      <Route path="/ar-view" element={<ThreeDModelViewer />} />
      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart/:id"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        }
      />

      {/* Seller Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="seller">
            <ShopDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/variant/:id"
        element={
          <ProtectedRoute requiredRole="seller">
            <VariantPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute requiredRole="seller">
            <EditProductPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            {/* Admin Dashboard Page (you can create this page) */}
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Public Product Page */}
      <Route path="/product" element={<ProductPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
