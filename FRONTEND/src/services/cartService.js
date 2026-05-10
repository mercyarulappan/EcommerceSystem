// import axios from "axios";

// const API = "http://localhost:8080/api/cart";

// const getAuthHeader = () => {
//   const token = localStorage.getItem("token");
//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// export const addToCart = (productId) => {
//   return axios.post(
//     `${API}/add/${productId}`,
//     {},
//     {
//       headers: getAuthHeader(),
//     },
//   );
// };

// export const getCart = () => {
//   return axios.get(API, {
//     headers: getAuthHeader(),
//   });
// };

// export const removeFromCart = (id) => {
//   return axios.delete(`${API}/${id}`, {
//     headers: getAuthHeader(),
//   });
// };

// export const getCartByProductId = (id) => axios.get(`/api/cart/${id}`);

// export const updateCart = (id, data) => axios.put(`/api/cart/${id}`, data);

import api from "../api/axiosConfig";

export const addToCart = (productId) => api.post(`/api/cart/add/${productId}`, {});

export const getCart = () => api.get("/api/cart");

export const removeFromCart = (id) => api.delete(`/api/cart/${id}`);

export const getCartCount = () => api.get("/api/cart/count");

export const updateCart = (id, data) => api.put(`/api/cart/${id}`, data);