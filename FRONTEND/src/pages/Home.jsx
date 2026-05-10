import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../services/cartService";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/Home.css";
import CategorySidebar from "../components/CategorySidebar";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import logo from "../images/noImage.png";
const Home = () => {
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchText = query.get("search") || "";

 

  const { fetchCartCount } = useContext(AuthContext);

 

  const fetchProducts = async (categoryId = null) => {
    try {
      let url = "http://localhost:8080/api/products";

      if (categoryId) {
        url = `http://localhost:8080/api/products/category/${categoryId}`;
      }

      const response = await axios.get(url);
      
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };
   useEffect(() => {
     fetchProducts(selectedCategory);
   }, [selectedCategory]);

  return (
    <div className="home-container">
      <h2 className="home-title">All Products</h2>

      {/* 🔥 MAIN LAYOUT */}
      <div className="home-layout">
        {/* ✅ LEFT: CATEGORY SIDEBAR */}
        <div>
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* ✅ RIGHT: PRODUCTS */}
        <div className="product-grid">
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(searchText.toLowerCase()),
            )
            .map((product) => (
              <div key={product.id} className="product-card">
                {/* TOP SECTION */}
                <Link to={`/product/${product.id}`} className="product-name">
                  <div className="top">
                    <img
                      src={product.imageUrl || logo}
                      alt={product.name}
                      className="product-image"
                    />

                    <h3>{product.name}</h3>

                    <p className="product-category">{product.category.name}</p>
                    <p></p>
                    <p className="product-price">₹ {product.price}</p>
                  </div>
                </Link>

                {/* BOTTOM SECTION */}

                <div className="bottom">
                  {userRole !== "ADMIN" && (
                    <button
                      className="add-btn"
                      onClick={async () => {
                        const token = localStorage.getItem("token");

                        if (!token) {
                          navigate("/login");
                          return;
                        }

                        try {
                          await addToCart(product.id);
                          fetchCartCount();
                          toast("Added to Cart", {
                            style: {
                              background: "#222",
                              color: "#fff",
                            },
                            autoClose: 1000,
                            transition: Slide,
                            position: "top-center",
                          });
                        } catch (error) {
                          console.error("Error adding to cart", error);
                        }
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                  {userRole === "ADMIN" && (
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/admin/product/edit/${product.id}`)
                      }
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
