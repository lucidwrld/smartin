"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  User,
  Briefcase,
  Building2,
  Play,
  Quote,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import useGetPublicFeedbacksManager from "@/app/events/controllers/feedbacks/getPublicFeedbacksController";

// Only added these utility functions
const isVideoFile = (url) => {
  if (!url || typeof url !== "string") return false;
  const lowerUrl = url.toLowerCase();
  const videoExtensions = [
    ".mp4",
    ".webm",
    ".mov",
    ".avi",
    ".mkv",
    ".m4v",
    ".3gp",
    ".flv",
  ];
  const videoKeywords = ["video", "mp4", "webm", "mov"];
  const hasVideoExtension = videoExtensions.some((ext) =>
    lowerUrl.includes(ext)
  );
  const hasVideoKeyword = videoKeywords.some((keyword) =>
    lowerUrl.includes(keyword)
  );
  return hasVideoExtension || hasVideoKeyword;
};

// Improved modal with better close options
const MediaModal = ({
  isOpen,
  onClose,
  mediaList,
  currentIndex,
  setCurrentIndex,
}) => {
  if (!isOpen) return null;

  const currentMedia = mediaList[currentIndex];
  const isVideo = isVideoFile(currentMedia);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose} // ✅ Click outside to close
    >
      <div
        className="relative max-w-4xl max-h-4xl w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking on content
      >
        {/* ✅ More visible close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-400 z-10 bg-black bg-opacity-50 rounded-full p-2 transition-colors"
          title="Close (or click outside)"
        >
          <X className="w-6 h-6" />
        </button>

        {isVideo ? (
          <video
            src={currentMedia}
            controls
            autoPlay
            className="max-w-full max-h-full"
          />
        ) : (
          <img
            src={currentMedia}
            alt="Media preview"
            className="max-w-full max-h-full object-contain"
          />
        )}

        {mediaList.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + mediaList.length) % mediaList.length
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % mediaList.length)
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* ✅ Show media counter */}
        {mediaList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {mediaList.length}
          </div>
        )}
      </div>
    </div>
  );
};

export const FeedbackCard = ({ feedback, colors }) => {
  // Only added modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // ✅ Destructure BEFORE useEffect
  const { rating, comment, designation, company, invitee, media, createdAt } =
    feedback;

  // ✅ Add keyboard support for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isModalOpen) return;

      if (event.key === "Escape") {
        setIsModalOpen(false);
      } else if (event.key === "ArrowLeft" && media && media.length > 1) {
        setCurrentMediaIndex(
          (prev) => (prev - 1 + media.length) % media.length
        );
      } else if (event.key === "ArrowRight" && media && media.length > 1) {
        setCurrentMediaIndex((prev) => (prev + 1) % media.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, media]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "";
    }
  };

  // Only added this function
  const handleMediaClick = (mediaIndex) => {
    setCurrentMediaIndex(mediaIndex);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Your original layout preserved exactly */}
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Quote Icon */}
        <div className={`inline-flex p-2 ${colors.bgLight} rounded-full mb-4`}>
          <Quote className={`w-5 h-5 ${colors.primary}`} />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">{renderStars(rating)}</div>
          <span className="text-sm font-medium text-gray-600">
            ({rating}/5)
          </span>
        </div>

        {/* Comment */}
        <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
          "{comment}"
        </blockquote>

        {/* Media - ✅ FLEXIBLE HEIGHTS instead of forced squares */}
        {media && media.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {media.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden bg-gray-100 group cursor-pointer"
                onClick={() => handleMediaClick(index)}
                style={{ minHeight: "120px" }} // ✅ Minimum height but flexible
              >
                {/* ✅ Each media gets its natural aspect ratio */}
                {isVideoFile(item) ? (
                  <div className="w-full h-32 flex items-center justify-center bg-black group-hover:bg-gray-800 transition-colors">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <img
                    src={item}
                    alt="Feedback media"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ minHeight: "120px", maxHeight: "200px" }} // ✅ Flexible height with limits
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Author Info - Your original layout */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${colors.bgLight} rounded-full flex items-center justify-center`}
            >
              <User className={`w-5 h-5 ${colors.primary}`} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{invitee?.name}</h4>
              {(designation || company) && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  {designation && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} />
                      {designation}
                    </span>
                  )}
                  {company && (
                    <>
                      {designation && <span>•</span>}
                      <span className="flex items-center gap-1">
                        <Building2 size={12} />
                        {company}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-400">{formatDate(createdAt)}</span>
        </div>
      </div>

      {/* Only added this modal */}
      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mediaList={media || []}
        currentIndex={currentMediaIndex}
        setCurrentIndex={setCurrentMediaIndex}
      />
    </>
  );
};

// Rest of your component stays exactly the same
const PublicFeedbackDisplay = ({ event, colors }) => {
  const { data, isLoading } = useGetPublicFeedbacksManager({
    eventId: event.id || event._id,
    enabled: Boolean(event.showFeedback),
  });

  if (!event.showFeedback) {
    return null;
  }

  const feedbacks = data?.feedbacks || [];

  if (isLoading) {
    return (
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
                Guest Experiences
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (feedbacks.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-gray-100 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-gray-100 to-transparent rounded-full translate-x-1/2 translate-y-1/2 opacity-80"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className={`inline-block ${colors.bgLight} p-3 rounded-full mb-6`}
            >
              <Star className={`w-8 h-8 ${colors.primary}`} />
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
              Guest Experiences
            </h2>

            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Hear what our guests have to say about their experience at{" "}
              {event.name}. Their stories and memories make every moment
              special.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback._id}
                feedback={feedback}
                colors={colors}
              />
            ))}
          </div>

          {feedbacks.length >= 6 && (
            <div className="text-center mt-12">
              <button
                className={`px-8 py-4 ${colors.bgDark} text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center focus:outline-none focus:ring-2 focus:ring-white`}
              >
                View More Experiences
                <Star className="ml-2 h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PublicFeedbackDisplay;
