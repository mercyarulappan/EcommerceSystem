import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { getCartCount } from "../services/cartService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false); // New state
  // 🔥 Fetch Cart Count
  const fetchCartCount = async () => {
    try {
      const res = await getCartCount();
      setCartCount(res.data);
    } catch (err) {
      console.error("Cart count error", err);
    }
  };

  // 🔥 Run when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        setUserRole(decoded.role);
        setIsAuthenticated(true);

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
          return;
        }

        setUserRole(decoded.role);
        setIsAuthenticated(true);

        const userData = {
          id: decoded.id,
          name: decoded.name || decoded.sub || "User",
          email: decoded.email || decoded.sub,
        };

        setUser(userData);

        if (decoded.role === "USER") {
          fetchCartCount();
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsLoaded(true);
  }, []);

  // 🔥 LOGIN
  const login = (token) => {
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);

    setUserRole(decoded.role);
    setIsAuthenticated(true);

    const userData = {
      name: decoded.name || decoded.sub || "User",
      email: decoded.email || decoded.sub,
    };

    setUser(userData);

    // 🔥 fetch cart after login
    if (decoded.role === "USER") {
      fetchCartCount();
    }
  };

  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setIsAuthenticated(false);
    setUser(null);
    setCartCount(0);
     // reset cart
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        user,
        login,
        logout,
        cartCount,
        setCartCount,
        fetchCartCount,
        isLoaded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
