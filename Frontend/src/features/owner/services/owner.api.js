import axios from "axios";

const api = axios.create({
  baseURL: "/api/owner",
  withCredentials: true,
});

export const getOwnerDashboard = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch owner dashboard data."
    );
  }
};
