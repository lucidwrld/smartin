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

  const renderIcon = (iconSrc) => {
    return React.isValidElement(iconSrc) ? (
      iconSrc
    ) : (
      <img src={iconSrc.src} alt={`${text} icon`} />
    );
  };

  const isActive = pathname.includes(path);
  const currentIcon = isActive || isHovered ? activeIcon : icon;

  return (
    <div>
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`py-3 hover:text-whiteColor hover:cursor-pointer hover:bg-lightPurple duration-300 
          ${isActive ? "bg-lightPurple w-full text-whiteColor" : ""}
          flex space-x-2 justify-start text-[${iconSize}] ${className} items-center text-whiteColor group pl-7`}
      >
        {renderIcon(currentIcon)}
        <h4 className={editText ?? "text-[12px] font-[500px]"}>{text}</h4>
      </div>
      {text === "Articles" && (
        <div className="divider divider-[#F0F2F5] my-3" />
      )}
    </div>
  );
};

export default IconsWithText;
