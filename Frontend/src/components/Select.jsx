import React from "react";

const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error = "",
  required = false,
  disabled = false,
  className = "",
  placeholder = "Select an option",
  ...props
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium mb-1 text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full p-2 border border-gray-300 rounded text-sm text-gray-900 ${
          error ? "border-red-500" : ""
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const optValue = typeof option === "object" ? option.value : option;
          const optLabel = typeof option === "object" ? option.label : option;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Select;
