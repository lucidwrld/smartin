import React, { useState } from "react";

const Dropdown = ({
  id,
  options = [],
  onChange,
  value = "",
  label,
  isRequired = false,
  className,
  disabled = false,
  labelClass,
  labelColor,
  message,
  placeholder,
  wrapperClassName,
  customValidator,
  customErrorMessage,
  ...props
}) => {
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const validateSelect = (selectedValue) => {
    if (customValidator) {
      const customValidation = customValidator(selectedValue);
      if (!customValidation.isValid) {
        setError(customValidation.message);
        return;
      }
      setError("");
      return;
    }

    if (isRequired && (!selectedValue || selectedValue === "")) {
      setError("This field is required");
      return;
    }

    setError("");
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(e);
    }
    validateSelect(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    validateSelect(value);
  };

  const selectStyleClass = `
    border rounded-md p-2 outline-none focus:outline-none w-full placeholder:text-14px
    ${error && touched ? "border-red-500" : "border-gray-300"}
    ${disabled ? "bg-gray-100" : "bg-white"}
  `;

  return (
    <div className={`flex flex-col gap-1 mb-4 ${wrapperClassName}`}>
      {label && (
        <label
          className={`text-sm font-medium flex gap-1 ${labelClass} ${
            labelColor ?? "text-gray-900"
          }`}
          htmlFor={id}
        >
          {label}
          {message && (
            <span className="text-orange-500 italic text-xs"> - {message}</span>
          )}
          {isRequired && <span className="text-red-600">*</span>}
        </label>
      )}

      <select
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`${className} ${selectStyleClass}`}
        aria-invalid={error && touched}
        aria-describedby={error && touched ? `${id}-error` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option
            key={index}
            value={typeof option === "object" ? option.value : option}
          >
            {typeof option === "object" ? option.label : option}
          </option>
        ))}
      </select>

      {error && touched && (
        <p
          className="text-red-500 text-xs mt-1"
          role="alert"
          id={`${id}-error`}
        >
          {customErrorMessage || error}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
