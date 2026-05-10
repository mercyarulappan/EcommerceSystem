import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct} from "../services/productService";
import axios from "axios";
import "../css/AddProduct.css";
import Swal from "sweetalert2";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    brand: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:8080/api/admin/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // 🔥 MUST
        },
      },
    );

    return res.data; // 🔥 Cloudinary URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Add Product?",
      text: "Do you want to add this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      let imageUrl = "";

      // 🔥 upload image first
      if (file) {
        imageUrl = await uploadImage();
        console.log("Uploaded URL:", imageUrl);
      }

      // 🔥 attach imageUrl to product
      const newProduct = {
        ...product,
        imageUrl,
      };
      console.log("Sending product:", newProduct);

      await addProduct(newProduct);

      alert("Product Added Successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2 className="add-product-title">Add Product</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="add-product-input"
            name="name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
            required
          />

          <input
            className="file-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <input
            className="add-product-input"
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
          />

          <input
            className="add-product-input"
            name="price"
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
          />

          <select
            className="add-product-select"
            name="categoryId"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            className="add-product-input"
            name="stockQuantity"
            type="number"
            placeholder="Stock"
            value={product.stockQuantity}
            onChange={handleChange}
          />

          <input
            className="add-product-input"
            name="brand"
            placeholder="Brand"
            value={product.brand}
            onChange={handleChange}
          />

          <button className="add-product-btn" type="submit">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
