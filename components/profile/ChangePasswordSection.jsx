import React, { useEffect, useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";

import CustomButton from "../Button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ChangePasswordManager } from "@/app/profile-settings/controllers/changePasswordController";
import { toast } from "react-toastify";
import validatePassword from "../ValidatePassword";

const ChangePasswordSection = ({refetch}) => {
  const [viewOldPassword, setViewOldPassword] = useState(false);
  const [viewNewPassword, setViewNewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const { changePassword, isLoading, isSuccess } = ChangePasswordManager({viewNewPassword});

  useEffect(() => {
      if(isSuccess){
        refetch()
      }
  }, [isSuccess])
   
  return (
    <div className="w-[509px] mr-auto flex flex-col text-brandBlack">
      <p className="text-40px font-semibold">Change Password</p>
      <p className="text-12px text-textGrey2">Update your password</p>
      <div className="divider mb-3"></div>

      <div className="w-[506px] flex flex-col relative">
        <div className="w-full">
          <InputWithFullBoarder
            hasSuffix={true}
            label={`Your Password`}
            
            isRequired={true}
            type={viewOldPassword ? `text` : `password`}
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
            icon={
              viewOldPassword ? (
                <AiOutlineEyeInvisible
                  onClick={() => setViewOldPassword(!viewOldPassword)}
                />
              ) : (
                <AiOutlineEye
                  onClick={() => setViewOldPassword(!viewOldPassword)}
                />
              )
            }
          />
          <InputWithFullBoarder
            hasSuffix={true}
            label={`New password`}
            
            isRequired={true}
            id={"password"}
            value={newPassword}
            type={viewNewPassword ? `text` : `password`}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={
              viewNewPassword ? (
                <AiOutlineEyeInvisible
                  onClick={() => setViewNewPassword(!viewNewPassword)}
                />
              ) : (
                <AiOutlineEye
                  onClick={() => setViewNewPassword(!viewNewPassword)}
                />
              )
            }
          />
          <InputWithFullBoarder
            hasSuffix={true}
            isRequired={true}
            label={`Confirm password`}
            type={viewConfirmPassword ? `text` : `password`}
            value={newConfirmPassword}
            onChange={(e) => setNewConfirmPassword(e.target.value)}
            icon={
              viewConfirmPassword ? (
                <AiOutlineEyeInvisible
                  onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
                />
              ) : (
                <AiOutlineEye
                  onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
                />
              )
            }
          />
          <div className="w-full flex items-center gap-3">
            <CustomButton
              buttonText={`Cancel`}
              buttonColor={"transparent"}
              textColor={`text-brandBlack`}
              onClick={() => {
                setNewConfirmPassword("");
                setNewPassword("");
                setOldPassword("");
              }}
              className={`w-full mx-auto mt-10 border border-lightGrey`}
            />
            <CustomButton
              buttonText={`Update password`}
              className={`w-full mx-auto mt-10`}
              isLoading={isLoading}
              
              onClick={() => {
                if(validatePassword(newPassword)){if (newConfirmPassword === newPassword) {
                  changePassword({
                    old_password: oldPassword,
                    new_password: newPassword,
                  });
                } else {
                  toast.error(
                    "Your new password and your confirm password do not match"
                  );
                }}else{
                  toast.error(
                    "Ensure your new password has atleast One uppercase, lowercase, special character and number"
                  )
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordSection;
