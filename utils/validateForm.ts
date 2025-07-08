// utils/validateForm.ts
import { toast } from "react-toastify";
import React from "react";

export const validateFormSubmission = (
  formRef: React.RefObject<HTMLFormElement>,
  formData: Record<string, any>,
  customMessage?: string // Optional parameter to override default message
): boolean => {
  if (!formRef.current) {
    toast.info("Form reference is required");
    return false;
  }

  // Trigger blur on all inputs except checkboxes
  const inputs = formRef.current.querySelectorAll(
    "input:not([type='checkbox'])"
  );
  inputs.forEach((input) => {
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  });

  // Check for validation errors and required fields
  const hasErrors =
    formRef.current.querySelectorAll('[role="alert"]').length > 0;
  const hasEmptyRequired = Object.entries(formData).some(([key, value]) => {
    const input = formRef.current.querySelector(`#${key}`);
    return input?.hasAttribute("required") && !value;
  });

  if (hasErrors || hasEmptyRequired) {
    toast.info(
      customMessage || "Please fix all validation errors before submitting."
    );
    return false;
  }

  return true;
};
