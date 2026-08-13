import axios from "axios";

const api = axios.create({
  baseURL: "/api/stores",
  withCredentials: true,
});

export const getStores = async () => {
  try {
    const response = await api.get("/");
    return response.data.stores || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error(
      error.response?.data?.message || "Failed to fetch stores."
    );
  }
};

export const createRating = async (storeId, rating) => {
  try {
    const response = await api.post(`/${storeId}/rating`, {
      rating: Number(rating),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to submit rating."
    );
  }
};

export const updateRating = async (storeId, rating) => {
  try {
    const response = await api.put(`/${storeId}/rating`, {
      rating: Number(rating),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update rating."
    );
  }
};
