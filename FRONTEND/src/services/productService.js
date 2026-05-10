// import axios from "axios";
// import api from "../api/axiosConfig";

// const API_URL = "http://localhost:8080/api/products";

// export const getAllProducts = async () => {
//   return axios.get(API_URL);
// };

// export const getProductById = (id) => {
//   return api.get(`/api/products/${id}`);
// };


// const getAuthConfig = () => {
//   const token = localStorage.getItem("token");
//   console.log("Token is :", token);


//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };




// export const addProduct = (product) => {
//   return axios.post(`${API_URL}/add`, product, getAuthConfig());
// };

// export const updateProduct = (id, product) => {
//   return axios.patch(`${API_URL}/${id}`, product, getAuthConfig());
// };

// export const deleteProduct = (id) => {
//   return axios.delete(`${API_URL}/${id}`, getAuthConfig());
// };

import api from "../api/axiosConfig";

// Public routes (Interceptor will still try to add token if it exists)
export const getAllProducts = () => api.get("/api/products");

export const getProductById = (id) => api.get(`/api/products/${id}`);

export const getAllProductsByAdmin = ()=> api.get("api/products/admin");
// Admin only routes
export const addProduct = (productData) =>
  api.post("/api/products/add", productData);

export const updateProductStatus = (id, isActive) => 
  api.patch(`http://localhost:8080/api/products/${id}`, { isActive });


export const updateProduct = (id, productData) =>
  api.patch(`/api/products/${id}`, productData);

export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

