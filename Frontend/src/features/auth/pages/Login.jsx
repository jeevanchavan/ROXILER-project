import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const Login = () => {
    const { handleLogin, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        apiError: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "", apiError: "" }));
        }
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { email: "", password: "", apiError: "" };

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Please enter a valid email address";
                isValid = false;
            }
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors((prev) => ({ ...prev, apiError: "" }));

        if (!validate()) return;

        try {
            await handleLogin({
                email: formData.email,
                password: formData.password,
            });
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                apiError: err.message || "Failed to login. Please try again.",
            }));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-sm bg-white p-6 border border-gray-300 rounded shadow-sm">
                <h1 className="text-xl font-bold text-center mb-4">Login</h1>

                {errors.apiError && (
                    <div className="mb-3 p-2 bg-red-100 text-red-600 border border-red-300 text-sm rounded">
                        {errors.apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <Input
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />

                    <Button type="submit" loading={loading} className="mt-2">
                        Login
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;