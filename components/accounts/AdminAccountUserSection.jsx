import { changePhoto, exportSVG } from "@/public/icons";
import GlobalVariables from "@/utils/GlobalVariables";
import React from "react";
import CustomButton from "../Button";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomDropdown from "../CustomDropDown";
import TeamTable from "./TeamTable";
import RoleTable from "./RoleTable";

const AdminAccountUserSection = () => {
  return (
    <div className="flex w-full bg-white rounded-[10px] flex-col text-brandBlack p-10">
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Team Members</p>
          <p className="text-14px text-textGrey2 w-[231px] mb-10">
            Invite your colleagues to work faster and collaborate together.
          </p>
          <div className="flex items-center gap-3">
            <img src={exportSVG.src} alt="" className="h-[40px]" />
            <CustomButton buttonText={`Add Team Member`} />
          </div>
        </div>
        <div className="w-[654px] h-[337px]  relative">
          <TeamTable />
        </div>
      </div>
      <div className="divider my-10"></div>
      <div className="flex items-start gap-40">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Roles & Permissions</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Add and edit user roles and permissions
          </p>
          <CustomButton buttonText={`Add New Role`} />
        </div>
        <div className="w-[654px] h-[337px]  relative">
          <RoleTable />
        </div>
      </div>
    </div>
  );
};

export default AdminAccountUserSection;
