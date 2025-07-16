"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  TrendingUp,
  PieChart,
  ExternalLink,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButton from "@/components/StatusButton";
import useGetEventPollsManager from "@/app/events/controllers/polls/getEventPollsController";
import { CreatePollManager } from "@/app/events/controllers/polls/createPollController";
import { UpdatePollManager } from "@/app/events/controllers/polls/updatePollController";
import useGetPollSubmissionsManager from "@/app/events/controllers/polls/getPollSubmissionsController";

const PollCard = ({
  poll,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleVisibility,
  onViewResults,
  onViewSubmissions,
  onShare,
  onToggleActive,
  isLoading,
}) => {
  const {
    id,
    _id,
    title,
    description,
    question,
    options,
    type,
    status = "active", // Default to active if not provided
    is_public,
    allow_multiple,
    show_voter_result,
    start_date,
    end_date,
    total_votes = 0, // Default to 0 if not provided
    created_at,
  } = poll;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "multiple_choice":
        return "bg-purple-100 text-purple-800";
      case "yes_no":
        return "bg-blue-100 text-blue-800";
      case "rating":
        return "bg-orange-100 text-orange-800";
      case "text":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const getMostPopularOption = () => {
    // Backend doesn't provide vote data, so we can't determine most popular
    return null;
  };

  const mostPopular = getMostPopularOption();

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <span
              className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}
            >
              {status.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs rounded ${getTypeColor(type)}`}>
              {type.replace("_", " ").toUpperCase()}
            </span>
            {!is_public && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                Private
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3">{question}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{total_votes || 0} votes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                {formatDate(start_date)} -{" "}
                {end_date ? formatDate(end_date) : "Ongoing"}
              </span>
            </div>
            {mostPopular && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>
                  Leading: {mostPopular.text} ({mostPopular.votes} votes)
                </span>
              </div>
            )}
          </div>

          {/* Quick Results Preview */}
          {options && options.length > 0 && total_votes > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Quick Results
              </h5>
              {options.slice(0, 3).map((option, index) => {
                // Backend sends simple array like ["Yes", "No"] or [1, 2, 3, 4, 5]
                const optionText = String(option);
                // No vote data from backend yet
                const percentage = 0;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 min-w-0 flex-1 truncate">
                      {optionText}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 min-w-0">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                );
              })}
              {options.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{options.length - 3} more options
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onViewResults(poll)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="View detailed results"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewSubmissions(poll)}
            className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
            title="View submissions"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleActive(id, !is_public)}
            className={`p-2 rounded-full transition-colors ${
              is_public
                ? "text-green-500 hover:bg-green-50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            title={is_public ? "Remove from live page" : "Add to live page"}
          >
            {is_public ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onShare(poll)}
            className="p-2 text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
            title="Share this question only"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              onToggleStatus(id, status === "active" ? "paused" : "active")
            }
            className={`p-2 rounded-full transition-colors ${
              status === "active"
                ? "text-yellow-500 hover:bg-yellow-50"
                : "text-green-500 hover:bg-green-50"
            }`}
            title={status === "active" ? "Pause poll" : "Resume poll"}
            disabled={status === "ended"}
          >
            {status === "active" ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onEdit(poll)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit poll"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete poll"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PollModal = ({ isOpen, onClose, poll, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    question: "",
    type: "multiple_choice",
    options: [
      { text: "", votes: 0 },
      { text: "", votes: 0 },
    ],
    allow_multiple: false,
    is_public: true,
    show_voter_result: true,
    start_date: "",
    end_date: "",
  });

  React.useEffect(() => {
    if (poll) {
      setFormData({
        title: poll.title || "",
        description: poll.description || "",
        question: poll.question || "",
        type: poll.type || "multiple_choice",
        options: poll.options
          ? // Convert backend simple array to frontend format for editing
            poll.options.map((opt) => ({ text: String(opt), votes: 0 }))
          : [
              { text: "", votes: 0 },
              { text: "", votes: 0 },
            ],
        allow_multiple: poll.allow_multiple || false,
        is_public: poll.is_public !== undefined ? poll.is_public : true,
        show_voter_result:
          poll.show_voter_result !== undefined ? poll.show_voter_result : true,
        start_date: poll.start_date || "",
        end_date: poll.end_date || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        question: "",
        type: "multiple_choice",
        options: [
          { text: "", votes: 0 },
          { text: "", votes: 0 },
        ],
        allow_multiple: false,
        is_public: true,
        show_voter_result: true,
        start_date: "",
        end_date: "",
      });
    }
  }, [poll, isOpen]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text: value };
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: "", votes: 0 }],
    });
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.question.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Only validate options for multiple choice polls
    if (
      formData.type === "multiple_choice" &&
      formData.options.some((opt) => !opt.text.trim())
    ) {
      alert("Please fill in all option texts");
      return;
    }

    // Format options based on poll type
    let formattedOptions;
    if (formData.type === "yes_no") {
      formattedOptions = ["Yes", "No"];
    } else if (formData.type === "rating") {
      formattedOptions = [1, 2, 3, 4, 5];
    } else if (formData.type === "multiple_choice") {
      formattedOptions = formData.options.map((opt) => opt.text);
    } else {
      formattedOptions = [];
    }

    const pollData = {
      ...formData,
      options: formattedOptions,
      id: poll?.id || `poll_${Date.now()}`,
      status: poll?.status || "draft",
      total_votes: poll?.total_votes || 0,
      created_at: poll?.created_at || new Date().toISOString(),
    };

    onSave(pollData);
  };

  if (!isOpen) return null;

  const pollTypes = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "yes_no", label: "Yes/No" },
    { value: "rating", label: "Rating (1-5)" },
    { value: "text", label: "Text Response" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {poll ? "Edit Poll" : "Create New Poll"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Poll Title *"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter poll title"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poll Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  {pollTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InputWithFullBoarder
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the poll"
              isTextArea={true}
              rows={2}
            />

            <InputWithFullBoarder
              label="Question *"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              placeholder="What question do you want to ask?"
              isTextArea={true}
              rows={2}
            />

            {/* Options for multiple choice, yes/no, and rating */}
            {formData.type !== "text" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options *
                </label>
                <div className="space-y-2">
                  {formData.type === "yes_no" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value="Yes"
                          disabled
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value="No"
                          disabled
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                    </>
                  ) : formData.type === "rating" ? (
                    <>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={`${rating} Star${rating !== 1 ? "s" : ""}`}
                            disabled
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            required
                          />
                          {formData.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {formData.options.length < 10 && (
                        <button
                          type="button"
                          onClick={addOption}
                          className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Option
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Start Date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                type="date"
              />
              <InputWithFullBoarder
                label="End Date (Optional)"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                type="date"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allow_multiple}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allow_multiple: e.target.checked,
                    })
                  }
                  className="mr-2"
                  disabled={
                    formData.type === "yes_no" || formData.type === "rating"
                  }
                />
                Allow Multiple Selections
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) =>
                    setFormData({ ...formData, is_public: e.target.checked })
                  }
                  className="mr-2"
                />
                Show on Live Page
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.show_voter_result}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      show_voter_result: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Show Results Immediately
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <CustomButton
                buttonText={poll ? "Update Poll" : "Create Poll"}
                type="submit"
                isLoading={isLoading}
                buttonColor="bg-purple-600"
                radius="rounded-md"
              />
              <CustomButton
                buttonText="Cancel"
                onClick={onClose}
                buttonColor="bg-gray-300"
                textColor="text-gray-700"
                radius="rounded-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ResultsModal = ({ isOpen, onClose, poll }) => {
  if (!isOpen || !poll) return null;

  const totalVotes = poll.total_votes || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Poll Results: {poll.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Question</h4>
              <p className="text-gray-700">{poll.question}</p>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Results</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {totalVotes} total votes
                </span>
                <span className="flex items-center gap-1">
                  <PieChart className="w-4 h-4" />
                  {poll.status}
                </span>
              </div>
            </div>

            {poll.options && poll.options.length > 0 ? (
              <div className="space-y-4">
                {poll.options
                  .sort((a, b) => b.votes - a.votes)
                  .map((option, index) => {
                    const percentage =
                      totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">
                            {option.text}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {option.votes} votes
                            </span>
                            <span className="text-sm font-medium text-purple-600">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No responses yet</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <CustomButton
                buttonText="Download Results"
                prefixIcon={<Download size={16} />}
                buttonColor="bg-blue-600"
                radius="rounded-md"
                onClick={() => {}}
              />
              <CustomButton
                buttonText="Share Results"
                prefixIcon={<Share2 size={16} />}
                buttonColor="bg-green-600"
                radius="rounded-md"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionsView = ({ poll, onBack, page, pageSize, onPageChange }) => {
  const { data: submissionsData, isLoading } = useGetPollSubmissionsManager({
    eventId: poll?.event || "demo",
    pollId: poll?.id || "",
    page: page,
    pageSize: pageSize,
    enabled: !!poll,
  });

  if (!poll) return null;

  const submissions = submissionsData?.data || [];
  const totalSubmissions = submissionsData?.total || 0;
  const totalPages = Math.ceil(totalSubmissions / pageSize);

  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Questions
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Submissions: {poll.title}
            </h2>
            <p className="text-sm text-gray-500">
              {totalSubmissions} total submissions
            </p>
          </div>
        </div>
        
        <CustomButton
          buttonText="Download CSV"
          prefixIcon={<Download size={16} />}
          buttonColor="bg-green-600"
          radius="rounded-md"
          onClick={() => {}}
        />
      </div>

      {/* Question Display */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Question</h4>
            <p className="text-gray-700">{poll.question}</p>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">All Submissions</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Showing {submissions.length} of {totalSubmissions} submissions
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading submissions...</p>
            </div>
          ) : submissions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {submission.name || "Anonymous"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {submission.response}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(submission.createdAt || submission.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalSubmissions)} of {totalSubmissions} results
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No submissions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PollsManagementTab = ({ event }) => {
  const [polls, setPolls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('polls'); // 'polls' or 'submissions'
  const [editingPoll, setEditingPoll] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [submissionsPageSize] = useState(10);

  // API hooks
  const {
    data: pollsData,
    isLoading: pollsLoading,
    error: pollsError,
  } = useGetEventPollsManager({
    eventId: event?.id,
    enabled: !!event?.id,
  });
  const { createPoll, isLoading: creating, isSuccess: createSuccess, error: createError } = CreatePollManager();
  
  // For updates, we need to manage the pollId state properly
  const [updatePollId, setUpdatePollId] = useState("default");
  const updatePollController = UpdatePollManager({ pollId: updatePollId });

  // Load polls from API
  React.useEffect(() => {
    if (pollsData?.data) {
      setPolls(pollsData.data);
    }
  }, [pollsData]);

  const handleAddPoll = () => {
    setEditingPoll(null);
    setIsModalOpen(true);
  };

  const handleEditPoll = (poll) => {
    setEditingPoll(poll);
    setIsModalOpen(true);
  };

  const handleSavePoll = async (pollData) => {
    try {
      setIsLoading(true);

      if (editingPoll) {
        // Update existing poll - set pollId first, then use controller
        setUpdatePollId(editingPoll.id);
        
        // Wait for the controller to be ready
        await new Promise(resolve => setTimeout(resolve, 0));
        
        await updatePollController.updatePoll({
          ...pollData,
          event: event.id,
        });
      } else {
        // Create new poll
        await createPoll({
          ...pollData,
          event: event.id,
        });
      }

      setIsModalOpen(false);
      setEditingPoll(null);
      setUpdatePollId("default");
    } catch (error) {
      console.error("Error saving poll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePoll = (pollId) => {
    if (confirm("Are you sure you want to delete this poll?")) {
      setPolls(polls.filter((p) => p.id !== pollId));
    }
  };

  const handleToggleStatus = (pollId, newStatus) => {
    setPolls(
      polls.map((p) => (p.id === pollId ? { ...p, status: newStatus } : p))
    );
  };

  const handleToggleActive = async (pollId, isActive) => {
    try {
      // Find the poll to get all its data
      const poll = polls.find((p) => p.id === pollId);
      if (!poll) return;

      // Set the pollId for the controller
      setUpdatePollId(pollId);
      
      // Wait for the controller to be ready
      await new Promise(resolve => setTimeout(resolve, 0));
      
      await updatePollController.updatePoll({
        ...poll,
        is_public: isActive,
        event: event.id,
      });
    } catch (error) {
      console.error("Error updating poll visibility:", error);
    }
  };

  const handleViewSubmissions = (poll) => {
    setSelectedPoll(poll);
    setSubmissionsPage(1);
    setCurrentView('submissions');
  };
  
  const handleBackToPolls = () => {
    setCurrentView('polls');
    setSelectedPoll(null);
  };

  const handleViewResults = (poll) => {
    setSelectedPoll(poll);
    setIsResultsModalOpen(true);
  };

  const handleSharePoll = (poll) => {
    const pollUrl = `${window.location.origin}/live/${event?.id || "demo"}?questionId=${poll.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: `${poll.title} - Live Question`,
          text: `Answer this question: ${poll.title}`,
          url: pollUrl,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(pollUrl).then(() => {
        alert(
          "Question link copied to clipboard! Share this link for people to answer this specific question."
        );
      });
    }
  };

  const filteredPolls = polls.filter((poll) => {
    const statusMatch = filterStatus === "all" || poll.status === filterStatus;
    const typeMatch = filterType === "all" || poll.type === filterType;
    return statusMatch && typeMatch;
  });

  const statusOptions = ["all", "active", "paused", "ended", "draft"];
  const typeOptions = ["all", "multiple_choice", "yes_no", "rating", "text"];

  const totalPolls = polls.length;
  const activePolls = polls.filter((p) => p.status === "active").length;
  const totalVotes = polls.reduce((sum, p) => sum + (p.total_votes || 0), 0);
  const publicPolls = polls.filter((p) => p.is_public).length;

  // Handle view switching
  if (currentView === 'submissions' && selectedPoll) {
    return (
      <SubmissionsView
        poll={selectedPoll}
        onBack={handleBackToPolls}
        page={submissionsPage}
        pageSize={submissionsPageSize}
        onPageChange={setSubmissionsPage}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Polls</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalPolls}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Polls</p>
              <p className="text-2xl font-semibold text-green-600">
                {activePolls}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Votes</p>
              <p className="text-2xl font-semibold text-purple-600">
                {totalVotes.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Public Polls</p>
              <p className="text-2xl font-semibold text-orange-600">
                {publicPolls}
              </p>
            </div>
            <Eye className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type === "all"
                    ? "All Types"
                    : type
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <CustomButton
            buttonText="Open Live Page"
            onClick={() => window.open(`/live/${event?.id}`, '_blank')}
            prefixIcon={<ExternalLink size={16} />}
            buttonColor="bg-green-600"
            radius="rounded-full"
          />
          <CustomButton
            buttonText="Create Poll"
            onClick={handleAddPoll}
            prefixIcon={<Plus size={16} />}
            buttonColor="bg-purple-600"
            radius="rounded-full"
          />
        </div>
      </div>

      {/* Polls List */}
      {filteredPolls.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {polls.length === 0
              ? "No polls yet"
              : "No polls match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {polls.length === 0
              ? "Create polls to engage with your event attendees and gather feedback."
              : "Try adjusting your filters to see more polls."}
          </p>
          {polls.length === 0 && (
            <CustomButton
              buttonText="Create First Poll"
              onClick={handleAddPoll}
              prefixIcon={<Plus size={16} />}
              buttonColor="bg-purple-600"
              radius="rounded-full"
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onEdit={handleEditPoll}
              onDelete={handleDeletePoll}
              onToggleStatus={handleToggleStatus}
              onToggleVisibility={handleToggleActive}
              onViewResults={handleViewResults}
              onViewSubmissions={handleViewSubmissions}
              onShare={handleSharePoll}
              onToggleActive={handleToggleActive}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Poll Modal */}
      <PollModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPoll(null);
        }}
        poll={editingPoll}
        onSave={handleSavePoll}
        isLoading={isLoading}
      />

      {/* Results Modal */}
      <ResultsModal
        isOpen={isResultsModalOpen}
        onClose={() => {
          setIsResultsModalOpen(false);
          setSelectedPoll(null);
        }}
        poll={selectedPoll}
      />
    </div>
  );
};

export default PollsManagementTab;
