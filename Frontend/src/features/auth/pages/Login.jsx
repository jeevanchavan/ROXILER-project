import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const Login = () => {
    const { handleLogin, handleChangePassword, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const role = (user.role || "").toLowerCase();
            if (role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else if (role === "store_owner") {
                navigate("/owner/dashboard", { replace: true });
            } else {
                navigate("/stores", { replace: true });
            }
        }
    }, [user, navigate]);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Login Form State
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    // Change Password Form State
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Error State
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        apiError: "",
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "", apiError: "" }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "", apiError: "" }));
        }
    };

    const validateLogin = () => {
        let isValid = true;
        const newErrors = { ...errors, email: "", password: "", apiError: "" };

        if (!loginData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(loginData.email)) {
                newErrors.email = "Please enter a valid email address";
                isValid = false;
            }
        }

        if (!loginData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (loginData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateChangePassword = () => {
        let isValid = true;
        const newErrors = {
            ...errors,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            apiError: "",
        };

        if (!passwordData.oldPassword) {
            newErrors.oldPassword = "Old password is required";
            isValid = false;
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "New password is required";
            isValid = false;
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = "New password must be at least 6 characters";
            isValid = false;
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
            isValid = false;
        } else if (passwordData.confirmPassword !== passwordData.newPassword) {
            newErrors.confirmPassword = "New passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrors((prev) => ({ ...prev, apiError: "" }));
        setSuccessMessage("");

        if (!validateLogin()) return;

        try {
            const loggedInUser = await handleLogin({
                email: loginData.email,
                password: loginData.password,
            });
            const role = (loggedInUser?.role || "").toLowerCase();
            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "store_owner") {
                navigate("/owner/dashboard");
            } else {
                navigate("/stores");
            }
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                apiError: err.message || "Failed to login. Please try again.",
            }));
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors((prev) => ({ ...prev, apiError: "" }));
        setSuccessMessage("");

        if (!validateChangePassword()) return;

        try {
            await handleChangePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            setSuccessMessage("Password changed successfully! You can now log in.");
            setIsChangingPassword(false);
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                apiError: err.message || "Failed to change password. Please try again.",
            }));
        }
    };

    const toggleMode = (changingPassword) => {
        setIsChangingPassword(changingPassword);
        setErrors({
            email: "",
            password: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            apiError: "",
        });
        setSuccessMessage("");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-sm bg-white p-6 border border-gray-300 rounded shadow-sm">
                <h1 className="text-xl font-bold text-center mb-4">
                    {isChangingPassword ? "Change Password" : "Login"}
                </h1>

                {successMessage && (
                    <div className="mb-3 p-2 bg-green-100 text-green-700 border border-green-300 text-sm rounded">
                        {successMessage}
                    </div>
                )}

                {errors.apiError && (
                    <div className="mb-3 p-2 bg-red-100 text-red-600 border border-red-300 text-sm rounded">
                        {errors.apiError}
                    </div>
                )}

                {isChangingPassword ? (
                    <form onSubmit={handlePasswordSubmit}>
                        <Input
                            label="Old Password"
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            placeholder="Enter old password"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            error={errors.oldPassword}
                            required
                        />

                        <Input
                            label="New Password"
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            error={errors.newPassword}
                            required
                        />

                        <Input
                            label="Confirm New Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            error={errors.confirmPassword}
                            required
                        />

                        <Button type="submit" loading={loading} className="mt-2 cursor-pointer">
                            Update Password
                        </Button>

                        <div className="text-center mt-3">
                            <button
                                type="button"
                                onClick={() => toggleMode(false)}
                                className="text-sm text-blue-500 underline cursor-pointer"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit}>
                        <Input
                            label="Email"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            error={errors.password}
                            required
                        />

                        <div className="text-right mb-3">
                            <button
                                type="button"
                                onClick={() => toggleMode(true)}
                                className="text-xs text-blue-500 underline cursor-pointer"
                            >
                                Change Password?
                            </button>
                        </div>

                        <Button type="submit" loading={loading} className="mt-1 cursor-pointer">
                            Login
                        </Button>
                    </form>
                )}

                {!isChangingPassword && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-500 underline">
                            Register
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;