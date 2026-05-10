import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../css/Navbar.css";
import { FaShoppingCart, FaHome} from "react-icons/fa";

const Navbar = ({darkMode,setDarkMode}) => {
  const { isAuthenticated, userRole, logout, user, cartCount } =
    useContext(AuthContext);
  // console.log("user is", user);
  // console.log("auth is",isAuthenticated);
  // console.log("userrole is",userRole);
  // console.log("cartcount is",cartCount);
    
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const profileRef = useRef();
  
  

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${search}`);
  };

 

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/" className="logo">
          ShopEase
        </Link>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <Link to="/" className="nav-link">
          <FaHome className="home-icon" />
        </Link>

        <form onSubmit={handleSearch}>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            {/* 🔔 NOTIFICATION
            <div className="nav-icon">
              <FaBell />
            </div> */}

            {/* 🛒 CART WITH BADGE */}
            {userRole === "USER" && (
              <div
                className="nav-icon cart-icon"
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </div>
            )}

           

            {/* 👤 PROFILE */}
            <div className="profile-wrapper" ref={profileRef}>
              <div
                className="avatar-letter"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                  >
                    Profile
                  </div>

                  {userRole === "USER" && (
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/orders");
                        setProfileOpen(false);
                      }}
                    >
                      My Orders
                    </div>
                  )}

                  {userRole === "ADMIN" && (
                    <>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/admin/products");
                          setProfileOpen(false);
                        }}
                      >
                        Manage Products
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/admin/orders");
                          setProfileOpen(false);
                        }}
                      >
                        Manage Orders
                      </div>
                    </>
                  )}

                  <div
                    className="dropdown-item logout"
                    onClick={() => {
                      logout();
                      navigate("/login");
                      toast.success("Logout successful");
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-btn">
              Login
            </Link>
            <Link to="/register" className="primary-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
