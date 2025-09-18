import React, { useState } from "react";

const InputWithFullBoarder = ({
  id,
  type = "text",
  value,
  onChange,
  form,
  label,
  tokens,
  checked,
  onClick,
  isRequired = false,
  className,
  min,
  labelClass,
  labelColor,
  message,
  maxLength,
  minLength,
  showCharacterCount = false,
  disabled = false,
  hasSuffix,
  placeholder,
  row = 50,
  icon,
  accept,
  none,
  isTextArea = false,
  wrapperClassName,
  customValidator,
  customErrorMessage,
  ...props
}) => {
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const errors = [];
    if (!hasUpperCase) errors.push("uppercase letter");
    if (!hasLowerCase) errors.push("lowercase letter");
    if (!hasNumber) errors.push("number");
    if (!hasSpecialChar) errors.push("special character");
    if (!hasMinLength) errors.push("minimum 8 characters");

    return errors;
  };

  const validateDate = (dateValue) => {
    if (!dateValue) return;

    const selectedDate = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Please select a future date";
    }

    return "";
  };

  const validateInput = (inputValue) => {
    if (customValidator) {
      const customValidation = customValidator(inputValue);
      if (!customValidation.isValid) {
        setError(customValidation.message);
        return;
      }
      setError("");
      return;
    }

    if (!isRequired && !inputValue) {
      setError("");
      return;
    }

    if (isRequired && !inputValue) {
      setError("This field is required");
      return;
    }

    if (inputValue) {
      if (minLength && inputValue.length < minLength) {
        setError(`Minimum ${minLength} characters required`);
        return;
      }
      if (maxLength && inputValue.length > maxLength) {
        setError(`Maximum ${maxLength} characters allowed`);
        return;
      }
    }

    switch (type) {
      case "email":
        if (!validateEmail(inputValue)) {
          setError("Please enter a valid email address");
        } else {
          setError("");
        }
        break;

      case "password":
        const passwordErrors = validatePassword(inputValue);
        if (passwordErrors.length > 0) {
          setError(`Password missing: ${passwordErrors.join(", ")}`);
        } else {
          setError("");
        }
        break;

      case "date":
        const dateError = validateDate(inputValue);
        setError(dateError || "");
        break;

      case "number":
        if (isNaN(inputValue)) {
          setError("Please enter a valid number");
        } else if (min && Number(inputValue) < Number(min)) {
          setError(`Value must be at least ${min}`);
        } else {
          setError("");
        }
        break;

      default:
        setError("");
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(e);
    }
    validateInput(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    validateInput(value);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const inputStyleClass = `
    border rounded-md p-2 outline-none focus:outline-none placeholder:text-14px
    ${error && touched ? "border-red-500" : "border-gray-300"}
    ${disabled ? "bg-gray-100" : "bg-white"}
    ${isTextArea && "h-[200px]"}
  `;

  const commonInputProps = {
    id,
    name: id,
    form,
    "aria-invalid": error && touched,
    "aria-describedby": error && touched ? `${id}-error` : undefined,
    required: isRequired,
    disabled,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    placeholder,
    ...(type === "date" && { min: getTodayDate() }),
    ...props,
  };

  const renderInput = () => {
    if (isTextArea) {
      return (
        <textarea
          {...commonInputProps}
          className={`${className} ${inputStyleClass}`}
          cols="50"
          rows={row}
          maxLength={maxLength}
        />
      );
    }

    if (hasSuffix) {
      return (
        <div className={`${inputStyleClass} flex items-center justify-between`}>
          <input
            {...commonInputProps}
            type={type === "password" && showPassword ? "text" : type}
            className="bg-transparent outline-none w-full"
            maxLength={maxLength}
            min={min}
            accept={accept}
            checked={checked}
            onClick={onClick}
          />
          <div className="flex items-center">
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
            {icon}
          </div>
        </div>
      );
    }

    return (
      <input
        {...commonInputProps}
        type={type === "password" && showPassword ? "text" : type}
        className={`${className} ${inputStyleClass}`}
        maxLength={maxLength}
        min={min}
        accept={accept}
        checked={checked}
        onClick={onClick}
      />
    );
  };

  return (
    <div
      className={`flex flex-col gap-1 ${!none && "mb-4"} ${wrapperClassName}`}
    >
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
          {tokens && (
            <span className="text-sm w-full text-right text-gray-600">
              1 USD ≈ 2 Tokens
            </span>
          )}
        </label>
      )}

      {renderInput()}

      {error && touched && (
        <p
          className="text-red-500 text-xs mt-1"
          role="alert"
          id={`${id}-error`}
        >
          {customErrorMessage || error}
        </p>
      )}

      {showCharacterCount && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">
            {value ? value.length : 0}
            {maxLength ? ` / ${maxLength}` : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default InputWithFullBoarder;
