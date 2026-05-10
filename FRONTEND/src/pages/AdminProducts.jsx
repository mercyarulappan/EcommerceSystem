import { useEffect, useState } from "react";
import { deleteProduct, getAllProductsByAdmin, updateProductStatus } from "../services/productService";
import { useNavigate } from "react-router-dom";
import "../css/AdminProducts.css";
import Swal from "sweetalert2";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();



  const handleStatusChange = async (id, value) => {
    await updateProductStatus(id, value === "true");

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, isActive: value === "true" } : product,
      ),
    );

    Swal.fire({
      icon: "success",
      title: "Updated Successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getAllProductsByAdmin();
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
          title: "Delete Product?",
          text: "Do you want to delete this item?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Delete",
          cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;
    await deleteProduct(id);
    fetchProducts();
  };

 return (
   <div className="admin-products">
     <h2>Manage Products</h2>

     <button className="add-btn" onClick={() => navigate("/admin/product/add")}>
       + Add Product
     </button>

     <div className="table-container">
       <table className="admin-table">
         <thead>
           <tr>
             <th>Name</th>
             <th>Price</th>
             <th>Stock</th>
             <th>Brand</th>
             <th>Actions</th>
           </tr>
         </thead>

         <tbody>
           {products.map((product) => (
             <tr key={product.id}>
               <td>{product.name}</td>
               <td>₹ {product.price}</td>
               <td>{product.stockQuantity}</td>
               <td>{product.brand}</td>

               <td>
                 <button
                   className="edit-btn"
                   onClick={() => navigate(`/admin/product/edit/${product.id}`)}
                 >
                   Edit
                 </button>

                 <button
                   className="delete-btn"
                   onClick={() => handleDelete(product.id)}
                 >
                   Delete
                 </button>

                 <select
                   className="edit-btn"
                   value={String(product.isActive ?? true)}
                   onChange={(e) =>
                     handleStatusChange(product.id, e.target.value)
                   }
                 >
                   <option value="true">In stock</option>
                   <option value="false">Currently Unavailable</option>
                 </select>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );
};

export default AdminProducts;
