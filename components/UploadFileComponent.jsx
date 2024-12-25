import React from "react";
import CustomButton from "./Button";
import Image from "next/image";
import { deleteIcon, uploaded } from "@/public/icons";

const UploadFileComponent = ({
  description,
  format,
  maxSize,
  inputRef,
  progress,
  isLoading,
  files,
  multiple = false,
  isEdit = false,
  accept = "",
  fileName,
  onChange,
  className,
  buttonClick,
}) => {
  return multiple ? (
    <div className={`${className} mb-6 flex items-center justify-between `}>
      <div className="flex items-center justify-start gap-2">
        {files.length <= 0 ? (
          <svg
            width="48"
            height="49"
            viewBox="0 0 48 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24.848" r="24" fill="#F0F2F5" />
            <path
              d="M18 22.348C18 19.3105 20.4624 16.848 23.5 16.848C26.1907 16.848 28.432 18.7812 28.907 21.3347C28.9736 21.6928 29.2297 21.9863 29.5754 22.101C31.5661 22.7612 33 24.6385 33 26.848C33 29.6094 30.7614 31.848 28 31.848C27.4477 31.848 27 32.2957 27 32.848C27 33.4003 27.4477 33.848 28 33.848C31.866 33.848 35 30.714 35 26.848C35 23.9556 33.2462 21.475 30.7463 20.4076C29.8909 17.206 26.9717 14.848 23.5 14.848C19.3579 14.848 16 18.2059 16 22.348C16 22.4483 16.002 22.5482 16.0059 22.6476C14.2105 23.6834 13 25.6234 13 27.848C13 31.1617 15.6863 33.848 19 33.848C19.5523 33.848 20 33.4003 20 32.848C20 32.2957 19.5523 31.848 19 31.848C16.7909 31.848 15 30.0572 15 27.848C15 26.1907 16.0082 24.7665 17.4487 24.1597C17.8655 23.9841 18.1126 23.5506 18.0512 23.1025C18.0175 22.8563 18 22.6045 18 22.348Z"
              fill="#475367"
            />
            <path
              d="M23.3356 27.1006C23.7145 26.7638 24.2855 26.7638 24.6644 27.1006L26.1644 28.4339C26.5771 28.8009 26.6143 29.4329 26.2474 29.8457C25.9264 30.2068 25.4025 30.2805 25 30.0476V34.848C25 35.4003 24.5523 35.848 24 35.848C23.4477 35.848 23 35.4003 23 34.848V30.0476C22.5975 30.2805 22.0736 30.2068 21.7526 29.8457C21.3857 29.4329 21.4229 28.8009 21.8356 28.4339L23.3356 27.1006Z"
              fill="#475367"
            />
          </svg>
        ) : (
          <img src={uploaded.src} />
        )}
        <div className="flex flex-col items-start">
          <p className="text-[10px] lg:text-14px text-brandBlack font-medium">
            {files.length <= 0 ? description : `Selected ${files.length} files`}
          </p>
          <p className="text-[8px] lg:text-12px text-textGrey2 ">
            {format} format
            {files.length <= 0 ? `* Max . ${maxSize}MB` : ""}
          </p>
        </div>
      </div>
      {files.length > 0 ? (
        <img src={deleteIcon.src} onClick={buttonClick} role="button" />
      ) : (
        <CustomButton
          buttonText={`Upload`}
          isLoading={isLoading}
          loader={`Loading ${progress}%`}
          onClick={() => inputRef.current.click()}
        />
      )}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={onChange}
        multiple={multiple}
        accept={accept}
      />
    </div>
  ) : (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center justify-start gap-2">
        {!fileName ? (
          <svg
            width="48"
            height="49"
            viewBox="0 0 48 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24.848" r="24" fill="#F0F2F5" />
            <path
              d="M18 22.348C18 19.3105 20.4624 16.848 23.5 16.848C26.1907 16.848 28.432 18.7812 28.907 21.3347C28.9736 21.6928 29.2297 21.9863 29.5754 22.101C31.5661 22.7612 33 24.6385 33 26.848C33 29.6094 30.7614 31.848 28 31.848C27.4477 31.848 27 32.2957 27 32.848C27 33.4003 27.4477 33.848 28 33.848C31.866 33.848 35 30.714 35 26.848C35 23.9556 33.2462 21.475 30.7463 20.4076C29.8909 17.206 26.9717 14.848 23.5 14.848C19.3579 14.848 16 18.2059 16 22.348C16 22.4483 16.002 22.5482 16.0059 22.6476C14.2105 23.6834 13 25.6234 13 27.848C13 31.1617 15.6863 33.848 19 33.848C19.5523 33.848 20 33.4003 20 32.848C20 32.2957 19.5523 31.848 19 31.848C16.7909 31.848 15 30.0572 15 27.848C15 26.1907 16.0082 24.7665 17.4487 24.1597C17.8655 23.9841 18.1126 23.5506 18.0512 23.1025C18.0175 22.8563 18 22.6045 18 22.348Z"
              fill="#475367"
            />
            <path
              d="M23.3356 27.1006C23.7145 26.7638 24.2855 26.7638 24.6644 27.1006L26.1644 28.4339C26.5771 28.8009 26.6143 29.4329 26.2474 29.8457C25.9264 30.2068 25.4025 30.2805 25 30.0476V34.848C25 35.4003 24.5523 35.848 24 35.848C23.4477 35.848 23 35.4003 23 34.848V30.0476C22.5975 30.2805 22.0736 30.2068 21.7526 29.8457C21.3857 29.4329 21.4229 28.8009 21.8356 28.4339L23.3356 27.1006Z"
              fill="#475367"
            />
          </svg>
        ) : (
          <img src={uploaded.src} />
        )}
        <div className="flex flex-col items-start">
          <p className="text-14px text-brandBlack font-medium">
            {!fileName ? description : fileName}
          </p>
          <p className="text-12px text-textGrey2 ">
            {format} format {!fileName ? `* Max . ` : ``}
            {maxSize}MB
          </p>
        </div>
      </div>
      {fileName ? (
        <img src={deleteIcon.src} onClick={buttonClick} role="button" />
      ) : (
        <CustomButton
          buttonText={`Upload`}
          isLoading={isLoading}
          loader={`Loading ${progress}%`}
          onClick={() => inputRef.current.click()}
        />
      )}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={onChange}
        multiple={multiple}
        accept={accept}
      />
    </div>
  );
};

export default UploadFileComponent;
