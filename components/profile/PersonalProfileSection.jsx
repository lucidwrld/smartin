import React, { useEffect, useRef, useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";

import CustomButton from "../Button";
import { UpdateProfileManager } from "@/app/profile-settings/controllers/updateProfileController";

const PersonalProfileSection = ({ userDetails, refetch }) => {
  const { updateProfile, isLoading, isSuccess } = UpdateProfileManager();

  const initialData = {
    fullname: "",
    phone: "",
  };
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        ...formData,
        fullname: userDetails?.fullname,
        phone: userDetails?.phone,
      });
    }
  }, [userDetails]);
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);
  return (
    <div className="max-w-[509px] w-full md:mr-auto flex flex-col text-brandBlack">
      <p className="text-40px font-semibold">Personal Profile</p>
      <p className="text-12px text-textGrey2">Manage your profile</p>
      <div className="divider mb-3"></div>

      <div className="max-w-[506px] w-full flex flex-col relative">
        <div className="w-full flex  flex-col md:flex-row gap-5">
          <div className="w-full">
            <InputWithFullBoarder
              label={`Full Name`}
              isRequired={true}
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
            />
          </div>
        </div>
        <div className="w-full">
          <InputWithFullBoarder
            label={`Phone number`}
            type={`tel`}
            isRequired={true}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end mb-1">
          <CustomButton
            buttonText={`Update`}
            onClick={async () => {
              const updatedFormData = { ...formData };

              updateProfile(updatedFormData);
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalProfileSection;
