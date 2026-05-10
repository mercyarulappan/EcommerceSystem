import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import logo from "../images/noImage.png";
import "../css/ProductDetails.css";
import { AuthContext } from "../context/AuthContext";
import { toast, Slide } from "react-toastify";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(AuthContext);
  const {userRole,user} = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [orderGroupId, setOrderGroupId] = useState("");
  const [relatedProducts,setRelatedProducts] = useState([]);
  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [fetchProduct,fetchRelatedProducts]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product", error);
    }
  };
  

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast("Review deleted successfully!", {
        style: { background: "#222", color: "#fff" },
        autoClose: 1000,
        transition: Slide,
        position: "top-center",
      });

      fetchProduct(); // refresh product with updated reviews
    } catch (err) {
      console.error(err);
      toast("Error deleting review");
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id);
      fetchCartCount();

      toast("Added to Cart", {
        style: { background: "#222", color: "#fff" },
        autoClose: 1000,
        transition: Slide,
        position: "top-center",
      });
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  useEffect(() => {
    fetchRelatedProducts();
  }, [id]);

  const fetchRelatedProducts = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/products/${id}/related`,
    );
    setRelatedProducts(res.data);
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!orderGroupId) {
        toast("⚠ Please enter your Order ID to verify purchase.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
          productId: product.id,
          orderGroupId,
        }),
      });

      if (!response.ok) throw new Error("Review failed");

      toast("⭐ Review submitted successfully!", {
        style: { background: "#222", color: "#fff" },
        autoClose: 1000,
        transition: Slide,
        position: "top-center",
      });

      setComment("");
      setRating(5);
      fetchProduct();
    } catch (err) {
      console.error("Error submitting review", err);
      toast("❌ You can only review products you purchased.");
    }
  };

  if (!product) return <div className="product-container">Loading...</div>;

  return (
    <div className="product-container">
      <div className="product-main">
        {/* LEFT IMAGE */}
        <div className="product-left">
          <img
            src={product.imageUrl || logo} 
            alt={product.name}
            className="product-image"
          />
        </div>

        {/* RIGHT PURCHASE BOX */}
        <div className="product-right">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-category">{product.category?.name}</p>
          <h3 className="product-price">₹ {product.price}</h3>
          <p className="product-desc">{product.description}</p>

          {userRole !== "ADMIN" && (
            <>
              <div className="quantity-box">
                <button
                  className="quantity-btn"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              <button className="primary-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate(`/checkout/product/${product.id}`)}
              >
                Buy Now
              </button>
            </>
          )}
          {userRole === "ADMIN" && (
            <button
              className="primary-btn"
              onClick={() => navigate(`/admin/product/edit/${product.id}`)}
            >
              Edit Product
            </button>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <h3 className="related-title">Related Products</h3>
      <div className="related-grid">
        {relatedProducts.map((item) => (
          <div key={item.id} className="related-card">
            <img src={item.imageUrl || logo} alt={item.name} className="related-img" />
            <Link to={`/product/${item.id}`} className="product-name">
              <h3>{item.name}</h3>
            </Link>
            <p>₹ {item.price}</p>
          </div>
        ))}
      </div>

      {/* REVIEWS */}
      <div className="reviews-container">
        <h3>Customer Reviews</h3>
        <div className="review-container2">
          {product.reviews?.length === 0 && <p>No reviews yet.</p>}
          {product.reviews?.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-user">{review.users.name}</span>
                <span className="review-rating">⭐ {review.rating}/5</span>
              </div>
              <p className="review-text">{review.comment}</p>
              {/* Admin delete button */}
              {(userRole === "ADMIN" || review.users.id === user.id) &&  (
                <button
                  className="review-btn"
                  style={{ background: "#ff4d4f" }}
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete Review
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ADD REVIEW */}

      {userRole === "USER" && (
        <div className="review-form">
          <h4>Add Review</h4>
          <input
            type="text"
            placeholder="Enter Order ID"
            className="review-input"
            value={orderGroupId}
            onChange={(e) => setOrderGroupId(e.target.value)}
          />
          <select
            className="review-input"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {"⭐".repeat(r)}
              </option>
            ))}
          </select>
          <textarea
            className="review-textarea"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="review-btn" onClick={submitReview}>
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
