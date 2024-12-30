import React, { useEffect, useRef, useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomButton from "../Button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ChangePasswordManager } from "@/app/profile-settings/controllers/changePasswordController";
import { toast } from "react-toastify";
import { validateFormSubmission } from "@/utils/validateForm";

const ChangePasswordSection = ({ refetch }) => {
  const initialData = {
    oldPassword: "",
    newPassword: "",
    newConfirmPassword: "",
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  };

  const [formData, setFormData] = useState(initialData);
  const formRef = useRef(null);

  const { changePassword, isLoading, isSuccess } = ChangePasswordManager();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setFormData(initialData);
    }
  }, [isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormSubmission(formRef, formData)) {
      return;
    }

    if (formData.newPassword !== formData.newConfirmPassword) {
      toast.error("Your new password and confirm password do not match");
      return;
    }

    await changePassword({
      old_password: formData.oldPassword,
      new_password: formData.newPassword,
    });
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  const togglePasswordVisibility = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="w-[509px] mr-auto flex flex-col text-brandBlack">
      <p className="text-40px font-semibold">Change Password</p>
      <p className="text-12px text-textGrey2">Update your password</p>
      <div className="divider mb-3"></div>

      <div className="w-[506px] flex flex-col relative">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="w-full">
            <InputWithFullBoarder
              hasSuffix={true}
              label="Your Password"
              id="oldPassword"
              isRequired={true}
              type={formData.showOldPassword ? "text" : "password"}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              value={formData.oldPassword}
              customValidator={(value) => ({
                isValid: value.length > 0,
                message: value ? "" : "Current password is required",
              })}
              icon={
                formData.showOldPassword ? (
                  <AiOutlineEyeInvisible
                    onClick={() => togglePasswordVisibility("showOldPassword")}
                  />
                ) : (
                  <AiOutlineEye
                    onClick={() => togglePasswordVisibility("showOldPassword")}
                  />
                )
              }
            />
            <InputWithFullBoarder
              hasSuffix={true}
              label="New Password"
              id="newPassword"
              isRequired={true}
              type={formData.showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              icon={
                formData.showNewPassword ? (
                  <AiOutlineEyeInvisible
                    onClick={() => togglePasswordVisibility("showNewPassword")}
                  />
                ) : (
                  <AiOutlineEye
                    onClick={() => togglePasswordVisibility("showNewPassword")}
                  />
                )
              }
            />
            <InputWithFullBoarder
              hasSuffix={true}
              label="Confirm Password"
              id="newConfirmPassword"
              isRequired={true}
              type={formData.showConfirmPassword ? "text" : "password"}
              value={formData.newConfirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, newConfirmPassword: e.target.value })
              }
              icon={
                formData.showConfirmPassword ? (
                  <AiOutlineEyeInvisible
                    onClick={() =>
                      togglePasswordVisibility("showConfirmPassword")
                    }
                  />
                ) : (
                  <AiOutlineEye
                    onClick={() =>
                      togglePasswordVisibility("showConfirmPassword")
                    }
                  />
                )
              }
            />
            <div className="w-full flex items-center gap-3">
              <CustomButton
                buttonText="Cancel"
                buttonColor="transparent"
                textColor="text-brandBlack"
                onClick={handleCancel}
                type="button"
                className="w-full mx-auto mt-10 border border-lightGrey"
              />
              <CustomButton
                buttonText="Update Password"
                type="submit"
                className="w-full mx-auto mt-10"
                isLoading={isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordSection;
