import React from "react";

const CustomCheckBox = ({ onChange, checked, text }) => {
  return (
    <label className=" text-gray-500 text-sm flex items-center">
      <input
        onChange={onChange}
        checked={checked}
        className="mr-2 custom-checkbox leading-tight "
        type="checkbox"
      />
      <p>{text}</p>
    </label>
  );
};

export default CustomCheckBox;
