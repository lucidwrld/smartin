"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  Send,
  BarChart3,
  CheckSquare,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Percent,
  User,
  Calendar,
  AlertCircle,
  MessageSquare,
  Flag,
  Square,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButton from "@/components/StatusButton";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddNote,
  isLoading,
  formatDate,
  getPriorityColor,
  getStatusColor,
}) => {
  const {
    id,
    title,
    description,
    assigned_to,
    priority,
    due_date,
    status,
    created_date,
    notes,
    category,
  } = task;

  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState("");

  const isOverdue = new Date(due_date) < new Date() && status !== "completed";

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(id, newNote.trim());
      setNewNote("");
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggleStatus(id, status === "completed" ? "pending" : "completed")}
            className="mt-1"
          >
            {status === "completed" ? (
              <CheckSquare className="w-5 h-5 text-green-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold text-lg ${status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}>
                {title}
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded border ${getPriorityColor(priority)}`}
              >
                <Flag className="w-3 h-3 inline mr-1" />
                {priority.toUpperCase()}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}
              >
                {status.replace("_", " ").toUpperCase()}
              </span>
              {isOverdue && (
                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  OVERDUE
                </span>
              )}
            </div>
            
            {description && (
              <p className={`text-sm mb-3 ${status === "completed" ? "text-gray-400" : "text-gray-600"}`}>
                {description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
              <div className="flex items-start gap-1">
                <User className="w-4 h-4 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500">Assigned to:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.isArray(assigned_to) ? 
                      assigned_to.map((member, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {member}
                        </span>
                      )) : 
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {assigned_to}
                      </span>
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(due_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Created: {formatDate(created_date)}</span>
              </div>
            </div>

            {category && (
              <span className="inline-block px-2 py-1 bg-brandPurple/10 text-brandPurple rounded text-xs mb-3">
                {category}
              </span>
            )}

            {notes && notes.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <MessageSquare className="w-4 h-4" />
                  {notes.length} note(s) • Click to {showNotes ? "hide" : "view"}
                </button>
                
                {showNotes && (
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {notes.map((note, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-700">{note.author}</span>
                          <span className="text-gray-500">{formatDate(note.date)}</span>
                        </div>
                        <p className="text-gray-600">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brandPurple"
                onKeyPress={(e) => e.key === "Enter" && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-2 py-1 text-sm bg-brandPurple text-whiteColor rounded hover:bg-brandPurple/90 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => onEdit(task)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TodoManagementTab = ({ event }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Utility functions
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: [], // Changed to array for multiple members
    priority: "medium",
    due_date: "",
    status: "pending",
    category: "",
  });

  // Mock data - replace with actual API calls
  const mockTasks = [
    {
      id: "1",
      title: "Setup venue lighting system",
      description: "Install and test all lighting equipment for main stage and booth areas",
      assigned_to: ["John Smith", "Tom Brown"], // Multiple members
      priority: "high",
      due_date: "2024-02-15",
      status: "in_progress",
      created_date: "2024-01-20",
      category: "Technical Setup",
      notes: [
        {
          author: "John Smith",
          date: "2024-01-21",
          content: "Contacted lighting vendor, equipment will arrive Thursday"
        },
        {
          author: "Event Manager",
          date: "2024-01-22",
          content: "Please coordinate with sound team for power requirements"
        }
      ]
    },
    {
      id: "2",
      title: "Finalize catering menu",
      description: "Review and approve final menu options with dietary restrictions considered",
      assigned_to: ["Sarah Johnson"],
      priority: "medium",
      due_date: "2024-02-10",
      status: "pending",
      created_date: "2024-01-18",
      category: "Catering",
      notes: [
        {
          author: "Sarah Johnson",
          date: "2024-01-19",
          content: "Meeting scheduled with caterer for menu tasting this Friday"
        }
      ]
    },
    {
      id: "3",
      title: "Book security personnel",
      description: "Arrange security team for event entrance and booth monitoring",
      assigned_to: ["Mike Wilson", "Emma Davis"], // Multiple members
      priority: "high",
      due_date: "2024-02-08",
      status: "completed",
      created_date: "2024-01-15",
      category: "Security",
      notes: [
        {
          author: "Mike Wilson",
          date: "2024-01-25",
          content: "Security team booked - 8 personnel confirmed for event day"
        }
      ]
    },
    {
      id: "4",
      title: "Print event signage",
      description: "Design and print all directional and informational signage",
      assigned_to: ["Lisa Chen"],
      priority: "low",
      due_date: "2024-02-12",
      status: "pending",
      created_date: "2024-01-22",
      category: "Marketing",
      notes: []
    },
    {
      id: "5",
      title: "Test registration system",
      description: "End-to-end testing of online registration and check-in process",
      assigned_to: ["David Park", "John Smith", "Lisa Chen"], // Multiple members
      priority: "high",
      due_date: "2024-02-01",
      status: "overdue",
      created_date: "2024-01-10",
      category: "Technical Setup",
      notes: [
        {
          author: "David Park",
          date: "2024-01-28",
          content: "Found issues with QR code scanner, working on fixes"
        }
      ]
    }
  ];

  const mockTeamMembers = [
    "John Smith",
    "Sarah Johnson", 
    "Mike Wilson",
    "Lisa Chen",
    "David Park",
    "Emma Davis",
    "Tom Brown"
  ];

  const isLoading = false;

  const handleToggleTaskStatus = async (taskId, newStatus) => {
    console.log("Toggle task status:", taskId, newStatus);
    toast.success(`Task ${newStatus === "completed" ? "completed" : "updated"}`);
  };

  const handleAddNote = async (taskId, noteContent) => {
    console.log("Add note to task:", taskId, noteContent);
    toast.success("Note added successfully");
  };

  const handleSaveTask = async () => {
    try {
      if (!formData.title || formData.assigned_to.length === 0 || !formData.due_date) {
        toast.error("Please fill in all required fields and assign at least one team member");
        return;
      }

      // Updated payload structure for backend
      const taskPayload = {
        event: event?.id || event?._id,
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assigned_to, // Array of member IDs/names
        priority: formData.priority, // high, medium, low
        due_date: formData.due_date,
        status: formData.status, // pending, in_progress, completed, overdue
        category: formData.category,
        notes: [] // Empty array on creation, updated later via separate endpoint
      };
      
      console.log("Save task payload:", taskPayload);
      setShowTaskModal(false);
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        assigned_to: [],
        priority: "medium",
        due_date: "",
        status: "pending",
        category: "",
      });
      toast.success(editingTask ? "Task updated successfully" : "Task created successfully");
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleDeleteTask = async () => {
    try {
      console.log("Delete task:", editingTask?.id);
      document.getElementById("delete-task").close();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tasks", label: "All Tasks", icon: CheckSquare },
    { id: "team", label: "Team View", icon: Users },
    { id: "analytics", label: "Progress", icon: TrendingUp },
  ];

  // Filter tasks
  const filteredTasks = mockTasks.filter(task => {
    const assigneesString = Array.isArray(task.assigned_to) 
      ? task.assigned_to.join(' ').toLowerCase() 
      : task.assigned_to.toLowerCase();
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assigneesString.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === "all" || 
                           (Array.isArray(task.assigned_to) 
                             ? task.assigned_to.includes(filterAssignee)
                             : task.assigned_to === filterAssignee);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Calculate statistics
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(task => task.status === "completed").length;
  const inProgressTasks = mockTasks.filter(task => task.status === "in_progress").length;
  const overdueTasks = mockTasks.filter(task => task.status === "overdue").length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

  // Group tasks by assignee for team view (handle multiple assignees)
  const tasksByAssignee = mockTasks.reduce((acc, task) => {
    const assignees = Array.isArray(task.assigned_to) ? task.assigned_to : [task.assigned_to];
    assignees.forEach(assignee => {
      if (!acc[assignee]) {
        acc[assignee] = [];
      }
      acc[assignee].push(task);
    });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-green-600">{completedTasks}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-blue-600">{inProgressTasks}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-semibold text-red-600">{overdueTasks}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-brandPurple text-brandPurple"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Completion</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-brandPurple h-3 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                {["Technical Setup", "Catering", "Security", "Marketing"].map(category => {
                  const categoryTasks = mockTasks.filter(task => task.category === category);
                  const categoryCompleted = categoryTasks.filter(task => task.status === "completed").length;
                  const categoryRate = categoryTasks.length > 0 ? (categoryCompleted / categoryTasks.length * 100) : 0;
                  
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{category}</span>
                        <span>{categoryCompleted}/{categoryTasks.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brandOrange h-2 rounded-full"
                          style={{ width: `${categoryRate}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {mockTasks
                .filter(task => task.status !== "completed")
                .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                .slice(0, 5)
                .map((task) => {
                  const isOverdue = new Date(task.due_date) < new Date();
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded border-l-4 ${
                        isOverdue ? "border-red-500 bg-red-50" : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-600">{task.assigned_to}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-blue-600"}`}>
                            {formatDate(task.due_date)}
                          </p>
                          {isOverdue && (
                            <span className="text-xs text-red-600">Overdue</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <h3 className="text-lg font-semibold">All Tasks</h3>
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple"
              >
                <option value="all">All Assignees</option>
                {mockTeamMembers.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
              <CustomButton
                buttonText="Add Task"
                prefixIcon={<Plus size={16} />}
                buttonColor="bg-brandPurple"
                radius="rounded-md"
                onClick={() => {
                  setEditingTask(null);
                  setFormData({
                    title: "",
                    description: "",
                    assigned_to: [],
                    priority: "medium",
                    due_date: "",
                    status: "pending",
                    category: "",
                  });
                  setShowTaskModal(true);
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                formatDate={formatDate}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                onEdit={() => {
                  setEditingTask(task);
                  setFormData({
                    title: task.title,
                    description: task.description || "",
                    assigned_to: Array.isArray(task.assigned_to) ? task.assigned_to : [task.assigned_to],
                    priority: task.priority,
                    due_date: task.due_date,
                    status: task.status,
                    category: task.category || "",
                  });
                  setShowTaskModal(true);
                }}
                onDelete={() => {
                  setEditingTask(task);
                  document.getElementById("delete-task").showModal();
                }}
                onToggleStatus={handleToggleTaskStatus}
                onAddNote={handleAddNote}
                isLoading={isLoading}
              />
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border">
                <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== "all" || filterPriority !== "all" || filterAssignee !== "all"
                    ? "Try adjusting your search or filters."
                    : "Create your first task to get started."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-6">
          {Object.entries(tasksByAssignee).map(([assignee, tasks]) => {
            const assigneeCompleted = tasks.filter(task => task.status === "completed").length;
            const assigneeRate = (assigneeCompleted / tasks.length * 100).toFixed(1);
            
            return (
              <div key={assignee} className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brandPurple/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-brandPurple" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{assignee}</h3>
                      <p className="text-sm text-gray-600">
                        {assigneeCompleted}/{tasks.length} tasks completed ({assigneeRate}%)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brandPurple h-2 rounded-full"
                        style={{ width: `${assigneeRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-3 rounded border ${
                        task.status === "completed" ? "bg-green-50 border-green-200" :
                        task.status === "overdue" ? "bg-red-50 border-red-200" :
                        "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-medium text-sm ${task.status === "completed" ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">Due: {formatDate(task.due_date)}</p>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)}`}>
                        {task.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Task Progress Analytics</h3>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Detailed analytics charts would be displayed here.</p>
              <p className="text-sm">
                Integration with charting library required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h3>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <InputWithFullBoarder
                  label="Task Title *"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Describe the task"
                  isTextArea={true}
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To *
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.assigned_to.map((member, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-brandPurple text-whiteColor rounded-full text-sm flex items-center gap-2"
                          >
                            {member}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  assigned_to: formData.assigned_to.filter((_, i) => i !== index)
                                });
                              }}
                              className="text-whiteColor hover:text-gray-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value && !formData.assigned_to.includes(e.target.value)) {
                            setFormData({
                              ...formData,
                              assigned_to: [...formData.assigned_to, e.target.value]
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brandPurple focus:border-brandPurple"
                      >
                        <option value="">Add team member...</option>
                        {mockTeamMembers
                          .filter(member => !formData.assigned_to.includes(member))
                          .map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brandPurple focus:border-brandPurple"
                    >
                      <option value="">Select category</option>
                      <option value="Technical Setup">Technical Setup</option>
                      <option value="Catering">Catering</option>
                      <option value="Security">Security</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Coordination">Coordination</option>
                      <option value="Vendor Management">Vendor Management</option>
                      <option value="Guest Services">Guest Services</option>
                      <option value="Documentation">Documentation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brandPurple focus:border-brandPurple"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brandPurple focus:border-brandPurple"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <InputWithFullBoarder
                    label="Due Date *"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        due_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={
                      editingTask ? "Update Task" : "Create Task"
                    }
                    buttonColor="bg-brandPurple"
                    radius="rounded-md"
                    isLoading={isLoading}
                    onClick={handleSaveTask}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => {
                      setShowTaskModal(false);
                      setEditingTask(null);
                    }}
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        title="Delete Task"
        body={`Are you sure you want to delete the task "${editingTask?.title}"? This action cannot be undone.`}
        buttonText="Delete Task"
        isLoading={isLoading}
        onClick={handleDeleteTask}
        id="delete-task"
      />
    </div>
  );
};

export default TodoManagementTab;