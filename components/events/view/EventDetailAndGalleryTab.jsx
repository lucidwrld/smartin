"use client";
import HeaderWithEdit from "@/components/HeaderWithEdit";
import StatusButton from "@/components/StatusButton";
import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import Gallery from "@/components/Gallery";

const EventDetailAndGalleryTab = () => {
  const gallery = [
    "https://plus.unsplash.com/premium_photo-1661384043515-e1cf59cb6d14?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://videos.pexels.com/video-files/8776123/8776123-uhd_2560_1440_25fps.mp4",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1683133594588-85b8ccbde18e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <div>
      <HeaderWithEdit title={"Event Details"} />
      <div className="w-full flex flex-col md:flex-row items-start gap-10">
        <div className="w-full md:w-1/2 relative max-h-[60vh] h-full">
          <img
            src="https://images.unsplash.com/photo-1530023367847-a683933f4172"
            className="object-cover w-full max-h-[60vh] h-full"
            alt="event-image"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start gap-7 p-3">
          <div className="flex items-center gap-2">
            <StatusButton status={"Active"} />
            <StatusButton status={"Private"} />
          </div>
          <div className="flex w-full gap-5 flex-col items-start">
            <p className="text-brandBlack font-bold text-16px leading-[16px]">
              Chioma & Damilare's wedding ceremony{" "}
            </p>
            <p className="text-gray-600 text-14px leading-[25.2px] max-w-[90%] w-full">
              The families of Prof & Dr (Mrs) Jaiyesimi & Chief & Mrs Oga
              request the honour of your presence at the wedding ceremony of
              their children, Choima & Damilare.
            </p>
          </div>
          <div className="flex flex-col gap-8 py-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span className="text-sm">Tuesday, December 10, 2024</span>
              <Clock size={16} className="ml-2" />
              <span className="text-sm">10:00 AM</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">Eko Hotels & Suite, VI Lagos</span>
            </div>
          </div>
        </div>
      </div>
      <HeaderWithEdit title={"Gallery"} />
      <Gallery files={gallery} />
    </div>
  );
};

export default EventDetailAndGalleryTab;
