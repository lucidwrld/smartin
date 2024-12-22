import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const IconsWithText = ({
  icon,
  text,
  iconSize,
  editText,
  onClick,
  className,
  path,
  activeIcon,
}) => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="">
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`py-3 hover:text-whiteColor hover:cursor-pointer  hover:bg-lightPurple duration-300 ${
          pathname.includes(path)
            ? ` bg-lightPurple w-full text-whiteColor`
            : ``
        } flex space-x-2 justify-start text-[${iconSize}] ${className} items-center text-whiteColor group pl-7`}
      >
        <img
          // className={pathname.includes(path) ? `text-brandBlue` : `text-whiteColor`}
          src={pathname.includes(path) || isHovered ? activeIcon : icon}
          alt="icons"
        />

        <h4 className={` ${editText ?? "text-[12px]  font-[500px]"} `}>
          {text}
        </h4>
      </div>
      {text === "Articles" && (
        <div className="divider divider-[#F0F2F5] my-3"></div>
      )}
    </div>
  );
};

export default IconsWithText;
