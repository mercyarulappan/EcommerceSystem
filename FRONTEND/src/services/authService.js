import api from "../api/axiosConfig";

export const registerUser = (data) => {
  return api.post("/api/auth/register", data);
};

export const loginUser = async (data) => {
  const response = await api.post("/api/auth/login", data);
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
