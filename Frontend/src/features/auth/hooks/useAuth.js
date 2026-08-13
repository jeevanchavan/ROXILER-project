import { AuthContext } from "../state/auth.context";
import { useContext } from "react";
import { register, login, logout, getMe, changePassword } from "../service/auth.api";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext)

    const handleRegister = async ({ username, email, password, address }) => {
        try {
            setLoading(true)
            const data = await register({ username, email, password, address })
            setUser(data.user)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            throw error
        }
    }

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true)
            const data = await login({ email, password })
            setUser(data.user)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            throw error
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true)
            await logout()
            setUser(null)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            throw error
        }
    }

    const handleGetMe = async () => {
        try {
            setLoading(true)
            const data = await getMe()
            setUser(data.user)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            throw error
        }
    }

    const handleChangePassword = async ({ oldPassword, newPassword }) => {
        try {
            setLoading(true)
            await changePassword({ oldPassword, newPassword })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            throw error
        }
    }

    return {
        user,
        setUser,
        loading,
        setLoading,
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe,
        handleChangePassword
    }
}