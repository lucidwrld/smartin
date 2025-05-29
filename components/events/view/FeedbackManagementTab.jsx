"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Building2,
  Briefcase,
  Image as ImageIcon,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CustomButton from "@/components/Button";
import CompletePagination from "@/components/CompletePagination";
import Loader from "@/components/Loader";
import StatusButton from "@/components/StatusButton";

import { formatDistanceToNow } from "date-fns";
import useGetAllEventFeedbacksManager from "@/app/events/controllers/feedbacks/getAllEventFeedbacksController";
import { ApproveFeedbackManager } from "@/app/events/controllers/feedbacks/approveFeedbackController";
import { ApproveAllFeedbacksManager } from "@/app/events/controllers/feedbacks/approveAllFeedbacksController";

// ✅ Added utility functions
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

// ✅ Added MediaModal component
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
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-4xl w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
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

        {mediaList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {mediaList.length}
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackCard = ({ feedback, onToggleApproval, isLoading }) => {
  // ✅ Added modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const {
    rating,
    comment,
    designation,
    company,
    show,
    invitee,
    media,
    createdAt,
  } = feedback;

  // ✅ Added keyboard support
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

  // ✅ Added media click handler
  const handleMediaClick = (mediaIndex) => {
    setCurrentMediaIndex(mediaIndex);
    setIsModalOpen(true);
  };

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
      return "N/A";
    }
  };

  return (
    <>
      <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{invitee?.name}</h4>
              <p className="text-sm text-gray-500">{invitee?.phone}</p>
              {(designation || company) && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  {designation && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} />
                      {designation}
                    </span>
                  )}
                  {company && (
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {company}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusButton status={show ? "Approved" : "Pending"} />
            <button
              onClick={() => onToggleApproval(feedback._id, !show)}
              disabled={isLoading}
              className={`p-2 rounded-full transition-colors ${
                show
                  ? "text-red-500 hover:bg-red-50"
                  : "text-green-500 hover:bg-green-50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              title={show ? "Hide from public" : "Show to public"}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">{renderStars(rating)}</div>
          <span className="text-sm text-gray-600">({rating}/5)</span>
        </div>

        {/* Comment */}
        <p className="text-gray-700 mb-3 text-sm leading-relaxed">{comment}</p>

        {/* ✅ Updated Media with modal functionality */}
        {media && media.length > 0 && (
          <div className="flex gap-2 mb-3">
            {media.map((item, index) => (
              <div
                key={index}
                className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer group hover:shadow-md transition-shadow"
                onClick={() => handleMediaClick(index)}
                title="Click to view full size"
              >
                {isVideoFile(item) ? (
                  <div className="w-full h-full flex items-center justify-center bg-black group-hover:bg-gray-800 transition-colors">
                    <Play className="w-4 h-4 text-white" />
                    {/* Video indicator */}
                    <div className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1">
                      <Play className="w-2 h-2 text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item}
                    alt="Feedback media"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/64/64";
                      e.target.alt = "Media unavailable";
                    }}
                  />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                      <Eye className="w-3 h-3 text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show count if more than 4 items */}
            {media.length > 4 && (
              <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-lg text-xs text-gray-600 font-medium">
                +{media.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(createdAt)}
          </span>
          <span>Code: {invitee?.code}</span>
        </div>
      </div>

      {/* ✅ Added Modal */}
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

const FeedbackManagementTab = ({ eventId }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useGetAllEventFeedbacksManager({
    eventId,
    page: currentPage,
  });

  const { approveFeedback, isLoading: approvingFeedback } =
    ApproveFeedbackManager({
      eventId,
    });

  const { approveAllFeedbacks, isLoading: approvingAll } =
    ApproveAllFeedbacksManager({
      eventId,
    });

  const feedbacks = data?.feedbacks || [];
  const totalFeedbacks = data?.pagination?.total || 0;
  const pendingCount = feedbacks.filter((f) => !f.show).length;
  const approvedCount = feedbacks.filter((f) => f.show).length;

  const handleToggleApproval = async (feedbackId, show) => {
    try {
      await approveFeedback({ feedbackId, show });
      refetch(); // Refresh the data
    } catch (error) {
      console.error("Error updating feedback approval:", error);
    }
  };

  const handleApproveAll = async () => {
    try {
      await approveAllFeedbacks();
      refetch(); // Refresh the data
    } catch (error) {
      console.error("Error approving all feedbacks:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Feedbacks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalFeedbacks}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-2xl font-semibold text-orange-600">
                {pendingCount}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-green-600">
                {approvedCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Actions */}
      {pendingCount > 0 && (
        <div className="flex justify-end">
          <CustomButton
            buttonText={`Approve All Pending (${pendingCount})`}
            onClick={handleApproveAll}
            isLoading={approvingAll}
            prefixIcon={<CheckCircle size={16} />}
            buttonColor="bg-green-600"
            radius="rounded-full"
          />
        </div>
      )}

      {/* Feedbacks List */}
      {feedbacks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No feedbacks yet
          </h3>
          <p className="text-gray-500">
            Once guests start sharing their feedback, you'll see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback._id}
              feedback={feedback}
              onToggleApproval={handleToggleApproval}
              isLoading={approvingFeedback}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && totalFeedbacks > 0 && (
        <CompletePagination
          setCurrentPage={setCurrentPage}
          pagination={data.pagination}
          suffix="Feedbacks"
        />
      )}
    </div>
  );
};

export default FeedbackManagementTab;
