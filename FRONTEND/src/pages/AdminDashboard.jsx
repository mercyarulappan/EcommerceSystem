import { useState, useEffect } from "react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { getAllOrders, updateOrderStatus } from "../services/orderService";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await getAllOrders();
    setOrders(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateProduct(editId, form);
      setEditId(null);
    } else {
      await addProduct(form);
    }
    setForm({ name: "", description: "", price: 0, imageUrl: "" });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const changeOrderStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <h3>{editId ? "Edit Product" : "Add Product"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <h3>Products</h3>
      {products.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ddd", margin: "5px", padding: "5px" }}
        >
          <strong>{p.name}</strong> - ₹{p.price}
          <button onClick={() => handleEdit(p)}>Edit</button>
          <button onClick={() => handleDelete(p.id)}>Delete</button>
        </div>
      ))}

      <h3>All Orders</h3>
      {orders.map((o) => (
        <div
          key={o.id}
          style={{ border: "1px solid #ddd", margin: "5px", padding: "5px" }}
        >
          <p>
            Order: {o.orderGroupId} | {o.users.name} | ₹{o.price}
          </p>
          <p>Status: {o.orderStatus}</p>
          <button onClick={() => changeOrderStatus(o.id, "PLACED")}>
            PLACED
          </button>
          <button onClick={() => changeOrderStatus(o.id, "SHIPPED")}>
            SHIPPED
          </button>
          <button onClick={() => changeOrderStatus(o.id, "DELIVERED")}>
            DELIVERED
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
