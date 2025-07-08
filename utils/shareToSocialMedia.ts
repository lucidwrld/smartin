import React from "react";

const {
  svg_whatsappMain,
  svg_instagramMain,
  svg_linkedinMain,
  svg_twitterMain,
  copy,
  svg_facebookMain,
} = require("@/public/icons");

export const shareIcons = [
  {
    action: "whatsapp",
    icon: svg_whatsappMain,
    url: "https://api.whatsapp.com/send?text=", // or "https://wa.me/?text="
  },
  {
    action: "instagram",
    icon: svg_instagramMain,
    url: "https://www.instagram.com/", // Direct sharing is not supported
  },
  {
    action: "linkedin",
    icon: svg_linkedinMain,
    url: "https://www.linkedin.com/shareArticle?mini=true&url=",
  },
  {
    action: "twitter",
    icon: svg_twitterMain,
    url: "https://twitter.com/intent/tweet?url=",
  },
  {
    action: "facebook",
    icon: svg_facebookMain,
    url: "https://www.facebook.com/sharer/sharer.php?u=",
  },
];

export const handleShareClick = ({ action, url, textToShare }) => {
  if (typeof window !== "undefined") {
    if (action === "copy") {
      navigator.clipboard
        .writeText(textToShare)
        .then(() => {
          toast.success("URL copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    } else {
      window.open(`${url}${encodeURIComponent(textToShare)}`, "_blank");
    }
  }
};
