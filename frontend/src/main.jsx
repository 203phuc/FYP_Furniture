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
import ProtectedRoute from "./components/route/ProtectedRoute";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ShopCreatePage from "./pages/shop/ShopCreatePage.jsx";
import ShopDashboardPage from "./pages/shop/ShopDashboardPage.jsx";
import ShopLoginPage from "./pages/shop/ShopLoginPage.jsx";
import VariantPage from "./pages/shop/VariantPage.jsx";
import store from "./redux/store.js";
import { Edit } from "@mui/icons-material";
import EditProductPage from "./components/Shop/EditProduct";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/shop-create" element={<ShopCreatePage />} />
      <Route path="/shop-login" element={<ShopLoginPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
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
      <Route path="/product" element={<ProductPage />} />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetailsPage />

          </ProtectedRoute>
        }
      />
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
