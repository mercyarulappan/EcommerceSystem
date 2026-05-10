import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyOrder.css";
import { Slide, toast } from "react-toastify";
import Swal from "sweetalert2";
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/orders/myorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Cancel Order
  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    
    const result = await Swal.fire({
          title: "Cancel Order?",
          text: "Do you want to cancel this order?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Cancel",
          cancelButtonText: "Cancel",
        });
    
        if (!result.isConfirmed) return;
        setLoadingId(orderId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Cancel failed");
      }
      toast("Order Cancelled", {
        style: {
          background: "#222",
          color: "#fff",
        },
        autoClose: 1000,
        transition: Slide,
        position: "top-center",
      });

      // ✅ Update UI instantly
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderStatus: "CANCELLED" } : order,
        ),
      );
      
    } catch (err) {
      console.error(err);
      toast.warn("❌ " + err.message);
    } finally {
      setLoadingId(null);
    }
  };
  // console.log(orders);

  return (
  <div className="orders-container">
    <h2 className="orders-title">My Orders</h2>

    {orders.length === 0 && <p>No orders found.</p>}

    {Object.entries(
      [...orders]
        .sort((a, b) => b.id - a.id)
        .reduce((acc, order) => {
          if (!acc[order.orderGroupId]) {
            acc[order.orderGroupId] = [];
          }
          acc[order.orderGroupId].push(order);
          return acc;
        }, {})
    ).map(([groupId, groupOrders]) => (
      <div key={groupId} className="order-card">
        <h4 className="order-id">Order ID: {groupId}</h4>

        <p
          className={`order-text status status-${groupOrders[0].orderStatus}`}
        >
          Status: {groupOrders[0].orderStatus}
        </p>

        <p>
          Date:{" "}
          {new Date(groupOrders[0].createdAt).toLocaleDateString("en-IN")}
          <br />
          Time:{" "}
          {new Date(groupOrders[0].createdAt).toLocaleTimeString("en-IN")}
        </p>

        <hr />

        {groupOrders.map((order) => (
          <div key={order.id} className="order-product-item">
            <p className="order-text">
              <b>Product:</b> {order.product.name}
            </p>
            <p className="order-text">
              <b>Quantity:</b> {order.quantity}
            </p>
            <p className="order-text">
              <b>Price:</b> ₹{order.price}
            </p>
          </div>
        ))}

        <p className="order-text">
          <b>Address:</b> {groupOrders[0].address}
        </p>

        <div className="order-actions">
          <button
            className="track-btn"
            onClick={() => navigate(`/track-order/${groupId}`)}
          >
            Track Order
          </button>

          {!["DELIVERED", "CANCELLED", "SHIPPED"].includes(
            groupOrders[0].orderStatus
          ) && (
            <button
              className="cancel-btn"
              disabled={loadingId === groupOrders[0].id}
              onClick={() => cancelOrder(groupOrders[0].id)}
            >
              {loadingId === groupOrders[0].id
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
);
}

export default MyOrders;
