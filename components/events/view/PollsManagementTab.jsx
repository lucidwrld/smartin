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
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButton from "@/components/StatusButton";

const PollCard = ({ poll, onEdit, onDelete, onToggleStatus, onToggleVisibility, onViewResults, onShare, isLoading }) => {
  const {
    id,
    title,
    description,
    question,
    options,
    type,
    status,
    is_public,
    allow_multiple,
    show_results,
    start_date,
    end_date,
    total_votes,
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
    if (!options || options.length === 0) return null;
    return options.reduce((prev, current) => 
      (current.votes > prev.votes) ? current : prev
    );
  };

  const mostPopular = getMostPopularOption();

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
              {status.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs rounded ${getTypeColor(type)}`}>
              {type.replace('_', ' ').toUpperCase()}
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
              <span>{formatDate(start_date)} - {end_date ? formatDate(end_date) : 'Ongoing'}</span>
            </div>
            {mostPopular && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Leading: {mostPopular.text} ({mostPopular.votes} votes)</span>
              </div>
            )}
          </div>

          {/* Quick Results Preview */}
          {options && options.length > 0 && total_votes > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Quick Results</h5>
              {options.slice(0, 3).map((option, index) => {
                const percentage = total_votes > 0 ? (option.votes / total_votes) * 100 : 0;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 min-w-0 flex-1 truncate">{option.text}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 min-w-0">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
              {options.length > 3 && (
                <p className="text-xs text-gray-500">+{options.length - 3} more options</p>
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
            onClick={() => onShare(poll)}
            className="p-2 text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
            title="Share poll publicly"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleVisibility(id, !is_public)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title={is_public ? "Make private" : "Make public"}
          >
            {is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggleStatus(id, status === "active" ? "paused" : "active")}
            className={`p-2 rounded-full transition-colors ${
              status === "active" 
                ? "text-yellow-500 hover:bg-yellow-50" 
                : "text-green-500 hover:bg-green-50"
            }`}
            title={status === "active" ? "Pause poll" : "Resume poll"}
            disabled={status === "ended"}
          >
            {status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
    options: [{ text: "", votes: 0 }, { text: "", votes: 0 }],
    allow_multiple: false,
    is_public: true,
    show_results: true,
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
        options: poll.options || [{ text: "", votes: 0 }, { text: "", votes: 0 }],
        allow_multiple: poll.allow_multiple || false,
        is_public: poll.is_public !== undefined ? poll.is_public : true,
        show_results: poll.show_results !== undefined ? poll.show_results : true,
        start_date: poll.start_date || "",
        end_date: poll.end_date || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        question: "",
        type: "multiple_choice",
        options: [{ text: "", votes: 0 }, { text: "", votes: 0 }],
        allow_multiple: false,
        is_public: true,
        show_results: true,
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
      options: [...formData.options, { text: "", votes: 0 }]
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

    if (formData.type !== "text" && formData.options.some(opt => !opt.text.trim())) {
      alert("Please fill in all option texts");
      return;
    }

    const pollData = {
      ...formData,
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
                            value={`${rating} Star${rating !== 1 ? 's' : ''}`}
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
                            onChange={(e) => handleOptionChange(index, e.target.value)}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allow_multiple}
                  onChange={(e) =>
                    setFormData({ ...formData, allow_multiple: e.target.checked })
                  }
                  className="mr-2"
                  disabled={formData.type === "yes_no" || formData.type === "rating"}
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
                Make Public
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.show_results}
                  onChange={(e) =>
                    setFormData({ ...formData, show_results: e.target.checked })
                  }
                  className="mr-2"
                />
                Show Results to Voters
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
            <h3 className="text-lg font-semibold">Poll Results: {poll.title}</h3>
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
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{option.text}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{option.votes} votes</span>
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

const PollsManagementTab = ({ event }) => {
  const [polls, setPolls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Initialize with mock data
  React.useEffect(() => {
    if (event?.polls) {
      setPolls(event.polls);
    } else {
      // Mock data for demonstration
      setPolls([
        {
          id: "poll_1",
          title: "Session Satisfaction Survey",
          description: "Rate your overall satisfaction with today's sessions",
          question: "How satisfied are you with the quality of sessions presented today?",
          type: "rating",
          options: [
            { text: "1 Star", votes: 5 },
            { text: "2 Stars", votes: 12 },
            { text: "3 Stars", votes: 34 },
            { text: "4 Stars", votes: 89 },
            { text: "5 Stars", votes: 127 },
          ],
          status: "active",
          is_public: true,
          allow_multiple: false,
          show_results: true,
          start_date: "2024-03-15",
          end_date: "2024-03-16",
          total_votes: 267,
          created_at: "2024-03-10T09:00:00Z",
        },
        {
          id: "poll_2",
          title: "Lunch Preference",
          description: "Help us choose the lunch menu for tomorrow",
          question: "What would you prefer for tomorrow's lunch?",
          type: "multiple_choice",
          options: [
            { text: "Mediterranean Buffet", votes: 45 },
            { text: "Asian Fusion", votes: 67 },
            { text: "Continental Cuisine", votes: 23 },
            { text: "Vegetarian Special", votes: 34 },
          ],
          status: "active",
          is_public: true,
          allow_multiple: false,
          show_results: false,
          start_date: "2024-03-14",
          end_date: "2024-03-15",
          total_votes: 169,
          created_at: "2024-03-12T14:30:00Z",
        },
        {
          id: "poll_3",
          title: "Future Topic Interest",
          description: "Vote for topics you'd like to see in future events",
          question: "Which topics would you like to see covered in future events?",
          type: "multiple_choice",
          options: [
            { text: "Artificial Intelligence", votes: 89 },
            { text: "Blockchain Technology", votes: 34 },
            { text: "Sustainable Development", votes: 67 },
            { text: "Digital Marketing", votes: 45 },
            { text: "Data Science", votes: 78 },
          ],
          status: "paused",
          is_public: true,
          allow_multiple: true,
          show_results: true,
          start_date: "2024-03-15",
          end_date: "",
          total_votes: 313,
          created_at: "2024-03-08T11:15:00Z",
        },
        {
          id: "poll_4",
          title: "Networking Event",
          description: "Should we organize a networking event tomorrow evening?",
          question: "Would you be interested in attending a networking event tomorrow evening?",
          type: "yes_no",
          options: [
            { text: "Yes", votes: 134 },
            { text: "No", votes: 45 },
          ],
          status: "ended",
          is_public: true,
          allow_multiple: false,
          show_results: true,
          start_date: "2024-03-13",
          end_date: "2024-03-14",
          total_votes: 179,
          created_at: "2024-03-11T16:45:00Z",
        },
      ]);
    }
  }, [event]);

  const handleAddPoll = () => {
    setEditingPoll(null);
    setIsModalOpen(true);
  };

  const handleEditPoll = (poll) => {
    setEditingPoll(poll);
    setIsModalOpen(true);
  };

  const handleSavePoll = (pollData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingPoll) {
        // Update existing poll
        setPolls(polls.map(p => 
          p.id === editingPoll.id ? pollData : p
        ));
      } else {
        // Add new poll
        setPolls([...polls, pollData]);
      }
      
      setIsModalOpen(false);
      setEditingPoll(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeletePoll = (pollId) => {
    if (confirm("Are you sure you want to delete this poll?")) {
      setPolls(polls.filter(p => p.id !== pollId));
    }
  };

  const handleToggleStatus = (pollId, newStatus) => {
    setPolls(polls.map(p => 
      p.id === pollId ? { ...p, status: newStatus } : p
    ));
  };

  const handleToggleVisibility = (pollId, isPublic) => {
    setPolls(polls.map(p => 
      p.id === pollId ? { ...p, is_public: isPublic } : p
    ));
  };

  const handleViewResults = (poll) => {
    setSelectedPoll(poll);
    setIsResultsModalOpen(true);
  };

  const handleSharePoll = (poll) => {
    const pollUrl = `${window.location.origin}/live/${event?.id || 'demo'}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${poll.title} - Live Poll`,
        text: `Participate in this live poll: ${poll.title}`,
        url: pollUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(pollUrl).then(() => {
        alert('Poll link copied to clipboard! Share this link for live participation.');
      });
    }
  };

  const filteredPolls = polls.filter(poll => {
    const statusMatch = filterStatus === "all" || poll.status === filterStatus;
    const typeMatch = filterType === "all" || poll.type === filterType;
    return statusMatch && typeMatch;
  });

  const statusOptions = ["all", "active", "paused", "ended", "draft"];
  const typeOptions = ["all", "multiple_choice", "yes_no", "rating", "text"];

  const totalPolls = polls.length;
  const activePolls = polls.filter(p => p.status === "active").length;
  const totalVotes = polls.reduce((sum, p) => sum + (p.total_votes || 0), 0);
  const publicPolls = polls.filter(p => p.is_public).length;

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
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
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
              {typeOptions.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CustomButton
          buttonText="Create Poll"
          onClick={handleAddPoll}
          prefixIcon={<Plus size={16} />}
          buttonColor="bg-purple-600"
          radius="rounded-full"
        />
      </div>

      {/* Polls List */}
      {filteredPolls.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {polls.length === 0 ? "No polls yet" : "No polls match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {polls.length === 0 
              ? "Create polls to engage with your event attendees and gather feedback."
              : "Try adjusting your filters to see more polls."
            }
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
              onToggleVisibility={handleToggleVisibility}
              onViewResults={handleViewResults}
              onShare={handleSharePoll}
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