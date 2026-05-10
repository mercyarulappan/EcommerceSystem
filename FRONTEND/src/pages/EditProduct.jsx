import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import '../css/EditProduct.css'
import { toast,Slide } from "react-toastify";
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const res = await getProductById(id);
    setProduct(res.data);
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const updatedData = {
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      brand: product.brand,
    };

    await updateProduct(id, updatedData);
    toast("Updated!", {
      style: {
        background: "#222",
        color: "#fff",
      },
      autoClose: 1000,
      transition: Slide,
      position: "top-center",
    });
    
    navigate("/");
  };

  return (
    <div className="login-container">
      {" "}
      {/* Reusing the same centering container */}
      <div className="login-card edit-card">
        <h2 className="login-title">Edit Product</h2>

        <div className="input-group">
          <label className="input-label">Product Name</label>
          <input
            className="login-input"
            name="name"
            value={product.name || ""}
            onChange={handleChange}
            placeholder="Name"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Description</label>
          <input
            className="login-input"
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            placeholder="Description"
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Price</label>
            <input
              className="login-input"
              name="price"
              type="number"
              value={product.price || ""}
              onChange={handleChange}
              placeholder="Price"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Stock</label>
            <input
              className="login-input"
              name="stockQuantity"
              type="number"
              value={product.stockQuantity || ""}
              onChange={handleChange}
              placeholder="Stock"
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Brand</label>
          <input
            className="login-input"
            name="brand"
            value={product.brand || ""}
            onChange={handleChange}
            placeholder="Brand"
          />
        </div>

        <button className="login-btn" onClick={handleUpdate}>
          Update Product
        </button>
        <button className="back-btn" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
