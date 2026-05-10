// import axios from "axios";

// const API_URL = "http://localhost:8080/api/orders";

// const getAuthConfig = () => {
//   const token = localStorage.getItem("token");
//   console.log("Token is :", token);

//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// export const getAllOrders = () => {
//   return axios.get(API_URL, getAuthConfig());
// };

// export const updateOrderStatus = (id, status) => {
//   return axios.put(`${API_URL}/${id}/status?status=${status}`, {}, getAuthConfig());
// };

import api from "../api/axiosConfig";

export const getAllOrders = () => api.get("/api/orders");

export const getMyOrders = () => api.get("/api/orders/my-orders");

export const placeOrder = (orderData) => api.post("/api/orders", orderData);

export const updateOrderStatus = (id, status) =>
  api.put(`/api/orders/${id}/status?status=${status}`);

export const trackOrder = (groupId) => api.get(`/api/orders/track/${groupId}`);