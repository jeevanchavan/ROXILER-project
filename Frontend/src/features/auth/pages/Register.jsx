import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const Register = () => {
    const { handleRegister, loading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
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
        const newErrors = {
            name: "",
            email: "",
            address: "",
            password: "",
            confirmPassword: "",
            apiError: "",
        };

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }

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

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
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
            await handleRegister({
                username: formData.name,
                email: formData.email,
                address: formData.address,
                password: formData.password,
            });
            navigate("/login");
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                apiError: err.message || "Failed to register. Please try again.",
            }));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-sm bg-white p-6 border border-gray-300 rounded shadow-sm my-6">
                <h1 className="text-xl font-bold text-center mb-4">Register</h1>

                {errors.apiError && (
                    <div className="mb-3 p-2 bg-red-100 text-red-600 border border-red-300 text-sm rounded">
                        {errors.apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Name"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                    />

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
                        label="Address"
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
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

                    <Input
                        label="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                    />

                    <Button type="submit" loading={loading} className="mt-2">
                        Register
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
