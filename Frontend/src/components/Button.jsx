import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = true,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded text-sm ${fullWidth ? "w-full" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
