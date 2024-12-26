import { changePhoto } from "@/public/icons";
import GlobalVariables from "@/utils/GlobalVariables";
import React from "react";
import CustomButton from "../Button";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomDropdown from "../CustomDropDown";

const AdminAccountDetails = () => {
  return (
    <div className="flex w-full bg-white rounded-[10px] flex-col text-brandBlack p-10">
      <div className="flex items-center gap-32">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Profile photo</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            This image will be displayed on your profile
          </p>
          <img src={changePhoto.src} alt="" />
        </div>
        <div className="rounded-full h-[120px] w-[120px] border border-lightGrey relative">
          <img
            src={GlobalVariables.defaultProfilePicture}
            alt=""
            className="h-full w-full rounded-full"
          />
        </div>
      </div>
      <div className="divider my-10"></div>
      <div className="flex items-start gap-32">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Personal Information</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Update your personal details here.
          </p>
          <CustomButton buttonText={`Save Changes`} />
        </div>
        <div className="relative w-[546px] flex flex-col">
          <div className="flex w-full gap-3">
            <div className="w-full">
              <InputWithFullBoarder label={`First name`} />
            </div>
            <div className="w-full">
              <InputWithFullBoarder label={`Last name`} />
            </div>
          </div>
          <div className="w-full">
            <InputWithFullBoarder label={`Email address`} />
            <InputWithFullBoarder label={`Username`} />
            <InputWithFullBoarder label={`Super Admin`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountDetails;
