import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import "../css/Checkout.css";
import { toast,Slide } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(AuthContext);

  const isCartCheckout = !id;
  const [address, setAddress] = useState("");

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (!address.trim()) {
        toast.alert("Please enter address");
        return;
      }

      let url;
      let body;

      if (isCartCheckout) {
        // 🛒 CART CHECKOUT
        url = "http://localhost:8080/api/orders/cart-checkout";
        body = { address };
      } else {
        // ⚡ BUY NOW
        const productId = Number(id);

        if (isNaN(productId)) {
          toast.alert("Invalid product");
          return;
        }

        url = "http://localhost:8080/api/orders/addorder";
        body = {
          productId,
          quantity: 1,
          address,
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Order failed");
      }

      toast("Order placed successfully (Cash on Delivery)", {
        style: {
          background: "#222",
          color: "#fff",
        },
        autoClose: 1000,
        transition: Slide,
        position: "top-center",
      });

      fetchCartCount();


      navigate("/orders");
    } catch (error) {
      console.error(error);
      toast.alert("Something went wrong");
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2 className="checkout-title">Delivery Address</h2>

        <textarea
          className="checkout-textarea"
          placeholder="Enter delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <h3 className="payment-title">Payment Method</h3>
        <p className="payment-method">Cash on Delivery</p>

        <button className="checkout-btn" onClick={placeOrder}>
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
