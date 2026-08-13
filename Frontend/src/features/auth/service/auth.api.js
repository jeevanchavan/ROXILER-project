import axios from 'axios'

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
})

export const register = async ({ username, email, password, address }) => {
    try {
        const response = await api.post("/register", { username, email, password, address })
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong")
    }
}

export const login = async ({ email, password }) => {
    try {
        const response = await api.post("/login", { email, password })
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong")
    }
}

export const logout = async () => {
    try {
        const response = await api.post("/logout")
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong")
    }
}

export const getMe = async () => {
    try {
        const response = await api.get("/get-me")
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong")
    }
}

export const changePassword = async ({ oldPassword, newPassword }) => {
    try {
        const response = await api.put("/password", { oldPassword, newPassword })
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong")
    }
}