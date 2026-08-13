import React from "react";

const Input = ({
  label,
  id,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium mb-1 text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full p-2 border border-gray-300 rounded text-sm text-gray-900 ${error ? "border-red-500" : ""
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
