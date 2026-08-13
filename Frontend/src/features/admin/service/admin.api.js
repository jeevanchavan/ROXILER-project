import axios from 'axios';

const api = axios.create({
    baseURL: "/api/admin",
    withCredentials: true
});

export const getDashboardData = async () => {
    try {
        const response = await api.get("/dashboard");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch dashboard statistics.");
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data.users || [];
    } catch (error) {
        if (error.response?.status === 404) {
            return [];
        }
        throw new Error(error.response?.data?.message || "Failed to fetch users.");
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data.user;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch user details.");
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post("/users", userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create user.");
    }
};

export const getAllStores = async () => {
    try {
        const response = await api.get("/stores");
        return response.data.stores || [];
    } catch (error) {
        if (error.response?.status === 404) {
            return [];
        }
        throw new Error(error.response?.data?.message || "Failed to fetch stores.");
    }
};

export const createStore = async (storeData) => {
    try {
        const response = await api.post("/stores", storeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create store.");
    }
};
