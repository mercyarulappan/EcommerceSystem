import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import OrderPage from "./pages/OrderPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import ProfilePage from "./pages/ProfilePage";
import TrackOrderPage from "./pages/TrackOrderPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditCart from "./pages/EditCart";
import EditProduct from "./pages/EditProduct";
import AdminProducts from "./pages/AdminProducts";
import AddProduct from "./pages/AddProduct";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import PublicRoute from "./components/PublicRoute"; // ...
import './App.css'
// Create a separate component for the Content to use Context safely
const AppContent = () => {
  const { isLoaded } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);


  // 1. Wait for AuthContext to finish checking localStorage
  if (!isLoaded) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ textAlign: "center" }}>
          <h2 className="login-title">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark-theme" : ""}>
      <BrowserRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute role="USER">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order/:productId" element={<OrderPage />} />
          {/* checkout for single product */}
          <Route
            path="/checkout/product/:id"
            element={
              <ProtectedRoute role="USER">
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="USER">
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          {/* checkout for cart
          <Route path="/checkout/cart" element={<CheckoutPage />} /> */}
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/track-order/:groupId" element={<TrackOrderPage />} />
          <Route path="/admin/cart/edit/:id" element={<EditCart />} />
          <Route
            path="/admin/product/edit/:id"
            element={
              <ProtectedRoute role="ADMIN">
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/product/add"
            element={
              <ProtectedRoute role="ADMIN">
                <AddProduct />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer position="top-right" autoClose={2000} />
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

// function App() {
//   const { isLoaded } = useContext(AuthContext);
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/cart"
//             element={
//               <ProtectedRoute role="USER">
//                 <Cart />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute role="ADMIN">
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/product/:id"
//             element={
//               <ProtectedRoute>
//                 <ProductDetails />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/order/:productId" element={<OrderPage />} />
//           {/* checkout for single product */}
//           <Route path="/checkout/product/:id" element={<CheckoutPage />} />
//           {/* checkout for cart
//           <Route path="/checkout/cart" element={<CheckoutPage />} /> */}
//           <Route path="/orders" element={<MyOrders />} />
//           <Route path="/checkout" element={<CheckoutPage />} />
//           <Route path="/admin/orders" element={<AdminOrders />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/track-order/:groupId" element={<TrackOrderPage />} />
//           <Route path="/admin/cart/edit/:id" element={<EditCart />} />
//           <Route path="/admin/product/edit/:id" element={<EditProduct />} />
//           <Route path="/admin/orders" element={<AdminOrders />} />
//           <Route path="/admin/products" element={<AdminProducts />} />
//           <Route path="/admin/product/add" element={<AddProduct />} />
//         </Routes>

//         <ToastContainer position="top-right" autoClose={2000} />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
