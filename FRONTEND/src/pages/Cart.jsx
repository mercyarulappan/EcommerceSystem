import { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../services/cartService";
import { useNavigate } from "react-router-dom";
import '../css/Cart.css'
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(AuthContext);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      fetchCart(); // refresh cart after delete
      fetchCartCount();
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="cart-container" style={{ padding: "40px" }}>
      {cartItems.length > 0 &&
      <h2>Your Cart</h2>
}

      {cartItems.length === 0 && (
        <p className="cart-empty">Your cart is empty.</p>
      )}

      {cartItems.map((item) => (
        <div key={item.id} className="cart-item" /*style={cartItemStyle}*/>
          <p>
            <strong>{item.product.name}</strong>
          </p>
          <p>Price: ₹ {item.product.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Subtotal: ₹ {item.product.price * item.quantity}</p>

          <button
            className="remove-btn"
            // style={removeButton}
            onClick={() => handleRemove(item.id)}
          >
            Remove
          </button>
        </div>
      ))}

      {cartItems.length > 0 && (
        <h3 className="cart-total" style={{ marginTop: "20px" }}>
          Total: ₹ {totalPrice}
        </h3>
      )}
    {cartItems.length > 0 &&
      <button className="order-btn" onClick={() => navigate("/checkout")}>
        Order Now
      </button>
}
    </div>

  );
};



export default Cart;
