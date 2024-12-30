import React from "react";
import ModalManagement from "./ModalManagement";

import CustomButton from "./Button";
import { deleteConfirmation } from "@/public/icons";

const DeleteConfirmationModal = ({
  title,
  body,
  onClick,
  id,
  isLoading,
  buttonText,
  buttonColor,
  successFul,
}) => {
  return (
    <ModalManagement id={id ? id : `delete`}>
      <div className="flex flex-col items-center min-w-[400px] w-full h-[400px] gap-3 justify-center">
        <img src={successFul ? success.src : deleteConfirmation.src} alt="" />
        <div className="flex flex-col w-full items-center text-center">
          <p className="text-brandBlack text-30px font-semibold">{title}</p>
          <p className="text-14px text-brandBlack text-center">{body}</p>
        </div>
        <div className="flex items-center gap-3 w-full">
          {!successFul && (
            <CustomButton
              buttonText={`Cancel`}
              buttonColor={"transparent"}
              textColor={`text-brandBlack`}
              onClick={() => {
                typeof document !== "undefined" &&
                  document.getElementById(id ? id : "delete").close();
              }}
              className={`w-full mx-auto mt-10 border border-lightGrey`}
            />
          )}
          <CustomButton
            buttonText={buttonText}
            className={`w-full mx-auto mt-10`}
            onClick={onClick}
            buttonColor={buttonColor}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ModalManagement>
  );
};

export default DeleteConfirmationModal;
