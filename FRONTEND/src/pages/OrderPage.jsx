import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function OrderPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const [quantity, setQuantity] = useState(1);
  const { setCartCount } = useContext(AuthContext);

  console.log("OrderPage rendered, setCartCount =", setCartCount);

   const placeOrder = async () => {
     try {
       const userId = localStorage.getItem("userId"); // ✅ auto user

       if (!userId) {
         toast.alert("Please login first");
         navigate("/login");
         return;
       }
       console.log("setCartCount:", setCartCount);

       const response = await fetch(
         "http://localhost:8080/api/orders/addorder",
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({
             userId: Number(userId),
             productId: Number(productId),
             quantity: Number(quantity),
           }),
         },
       );

       if (!response.ok) {
         throw new Error("Failed to place order");
       }
       const data = await response.json();
       
       
      
       
       toast("Order Placed Successfully", {
         style: {
           background: "#222",
           color: "#fff",
         },
         autoClose: 1000,
         transition: Slide,
         position: "top-center",
       });
        setCartCount(0);
        setTimeout(() => {
          navigate("/orders");
        }, 500);

       
     } catch (error) {
       console.error(error);
       toast.error("Error placing order");
     }
   };

  return (
    <div style={{ padding: "30px" }}>
      
      <h2>Place Order</h2>

      <div style={{ marginTop: "20px" }}>
        <label>Quantity</label>
        <br />
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <button style={{ marginTop: "20px" }} onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default OrderPage;
