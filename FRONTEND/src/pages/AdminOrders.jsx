import { useEffect, useState,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import '../css/AdminOrders.css'
import Swal from "sweetalert2";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true); // Show loading while fetching
      const res = await getAllOrders();
      setOrders(res?.data || []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await Swal.fire({
      title: "Update Status?",
      text: "Do you want to update the order status?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      // 1. Tell the server to change it
      await updateOrderStatus(id, newStatus);

      // 2. Update the LOCAL state so the UI changes immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id || order.id === id
            ? { ...order, orderStatus: newStatus }
            : order,
        ),
      );

      // Optional: toast.success("Status Updated!");
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating status");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="login-container admin-container">
      <div className="admin-content">
        <h2 className="login-title">All Orders</h2>

        {orders.length === 0 ? (
          <p className="register-text">No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id || order.id} className="order-item-card">
                <div className="order-info">
                  <p className="order-id">
                    <span
                      className={`status-circle status-${order.orderStatus?.toLowerCase()}`}
                    ></span>
                    <span> Order ID:</span> {order._id || order.id}
                  </p>
                </div>

                <div className="order-actions">
                  <select
                    className={`login-input order-select status-border-${order.orderStatus?.toLowerCase()}${
                      order.orderStatus === "DELIVERED" ? "disabled-select" : ""
                    }`}
                    value={order.orderStatus || "PENDING"} // This ensures the current status is shown
                    disabled={
                      order.orderStatus === "DELIVERED" ||
                      order.orderStatus === "CANCELLED"
                    }
                    onChange={(e) =>
                      handleStatusChange(order._id || order.id, e.target.value)
                    }
                  >
                    <option value="PENDING" className="option-dark">
                      PENDING
                    </option>
                    <option value="SHIPPED" className="option-dark">
                      SHIPPED
                    </option>
                    <option value="DELIVERED" className="option-dark">
                      DELIVERED
                    </option>
                    
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
