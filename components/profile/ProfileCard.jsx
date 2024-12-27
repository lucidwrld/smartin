"use client";
import { logoVertical } from "@/public/images";

import GlobalVariables from "@/utils/GlobalVariables";

import React, { useEffect, useState } from "react";

const ProfileCard = ({ details, selectedCategory, setSelectedCategory }) => {
  const categories =
    details?.professional_profile?.categories.length > 0
      ? details?.professional_profile?.categories.map((el, i) => el?.title)
      : [];

  useEffect(() => {
    if (details && details?.professional_profile?.categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [details]);

  // const [base64Image, setBase64Image] = useState("");
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadImage = async () => {
  //     try {
  //       const response = await axios.get("/api/proxy", {
  //         params: { url: details?.profile_picture },
  //       });
  //       setBase64Image(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching image from proxy:", error);
  //       setLoading(false);
  //     }
  //   };

  //   if (details?.profile_picture) {
  //     loadImage();
  //   }
  // }, [details?.profile_picture]);

  return (
    <div
      id="share_card"
      className="flex flex-col h-[500px]  relative w-[500px] bg-brandBlack rounded-[10px] aspect-square p-5 gap-6"
    >
      <div className="flex items-center h-[65%] gap-5">
        <div className="relative w-[40%] h-full rounded-[10px] overflow-hidden">
          <img
            src={
              details?.profile_picture
                ? details?.profile_picture
                : GlobalVariables.defaultProfilePicture
            }
            className="w-full object-cover h-full rounded-[10px]"
            alt=""
          />
        </div>
        <div className="w-[55%] text-whiteColor h-full flex flex-col items-start gap-8 justify-center">
          <p className="text-12px font-normal">Hello</p>
          <p className="text-[25px] font-semibold">{`I'm a consultant in ${selectedCategory} `}</p>
          <div className="flex flex-col items-start leading-tight">
            <p className="text-14px font-medium ">{`Connect with me on`}</p>
            <p className="text-16px font-semibold text-brandOrange">{`The Confidant`}</p>
          </div>
        </div>
      </div>
      <div className="flex rounded-[10px] bg-whiteColor h-[30%] p-5 items-center justify-between">
        <div className="flex flex-col">
          <p className="text-12px font-medium capitalize">
            {details?.first_name} {details?.last_name}
          </p>
          <p className="text-16px text-brandOrange font-semibold">
            {categories.join(", ")}
          </p>
        </div>
        <div className="h-full relative flex items-center justify-center">
          <img
            src={logoVertical.src}
            alt=""
            className="h-[75px] object-contain "
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
