import React from "react";
import EditButton from "./EditButton";
import Link from "next/link";

const HeaderWithEdit = ({ title, href, onClick }) => {
  return (
    <div className="flex items-center w-full justify-between mt-8 mb-4">
      <p className="text-16px leading-[16px] text-[#210B08]">{title}</p>
      {onClick ? (
        <button onClick={onClick}>
          <EditButton />
        </button>
      ) : href ? (
        <Link href={href}>
          <EditButton />
        </Link>
      ) : (
        <button disabled>
          <EditButton />
        </button>
      )}
    </div>
  );
};

export default HeaderWithEdit;
