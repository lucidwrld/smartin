import React from "react";

const Avatar = ({ size, textSize, pic, name }) => {
  return (
    <div
      className={`rounded-full bg-[#E7E7E7] ${
        size ?? "h-[120px] w-[120px]"
      }  flex items-center justify-center relative`}
    >
      {pic ? (
        <img src={pic} className="w-full h-full rounded-full object-cover" />
      ) : (
        <p
          className={`text-black ${
            textSize ?? "text-[20px]"
          } w-full h-full rounded-full text-center flex items-center justify-center`}
        >
          {name && name.slice(0, 1)}
        </p>
      )}
    </div>
  );
};

export default Avatar;
