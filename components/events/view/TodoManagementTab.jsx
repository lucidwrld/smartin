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
import {
  CreateTodoManager,
  useGetEventTodosManager,
  UpdateTodoManager,
  DeleteTodoManager,
  CreateTodoNoteManager,
} from "@/app/todos/controllers/todoController";
import Loader from "@/components/Loader";

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
    _id,
    title,
    description,
    assigned_to,
    priority,
    due_date,
    status,
    createdAt,
    notes,
  } = task;

  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState("");

  const isOverdue = new Date(due_date) < new Date() && status !== "completed";

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(_id, newNote.trim());
      setNewNote("");
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() =>
              onToggleStatus(
                _id,
                status === "completed" ? "pending" : "completed"
              )
            }
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
              <h3
                className={`font-semibold text-lg ${
                  status === "completed"
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {title}
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded border ${getPriorityColor(
                  priority
                )}`}
              >
                <Flag className="w-3 h-3 inline mr-1" />
                {priority.toUpperCase()}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded ${getStatusColor(
                  status
                )}`}
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
              <div
                className={`text-sm mb-3 ${
                  status === "completed" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <p className="text-xs text-gray-500 mb-1">Sub Tasks:</p>
                <div className="space-y-1">
                  {description
                    .split("\n")
                    .filter(Boolean)
                    .map((subTask, index) => {
                      const isTaskCompleted = subTask.startsWith("[x] ");
                      const taskText = subTask.replace(/^\[(x| )\] /, "");
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded border flex items-center justify-center ${
                              isTaskCompleted
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isTaskCompleted && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </div>
                          <span
                            className={
                              isTaskCompleted
                                ? "line-through text-gray-400"
                                : ""
                            }
                          >
                            {taskText}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
              <div className="flex items-start gap-1">
                <User className="w-4 h-4 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500">Assigned to:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assigned_to && assigned_to.length > 0 ? (
                      assigned_to.map((assignee, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {assignee}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(due_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Created: {formatDate(createdAt)}</span>
              </div>
            </div>

            {notes && notes.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <MessageSquare className="w-4 h-4" />
                  {notes.length} note(s) • Click to{" "}
                  {showNotes ? "hide" : "view"}
                </button>

                {showNotes && (
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {notes.map((note, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-2 rounded text-xs"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-700">
                            {note.author}
                          </span>
                          <span className="text-gray-500">
                            {formatDate(note.createdAt)}
                          </span>
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
            onClick={() => onDelete(_id)}
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

  // API Integrations
  const {
    data: todosData,
    isLoading: loadingTodos,
    refetch: refetchTodos,
    error: todosError,
  } = useGetEventTodosManager(event?.id || event?._id);
  const { createTodo, isLoading: creatingTodo } = CreateTodoManager();
  const { updateTodo, isLoading: updatingTodo } = UpdateTodoManager();
  const { deleteTodo, isLoading: deletingTodo } = DeleteTodoManager({
    todoId: editingTask?._id,
  });
  const { createNote, isLoading: creatingNote } = CreateTodoNoteManager({
    todoId: editingTask?._id,
  });

  const isLoading =
    creatingTodo || updatingTodo || deletingTodo || creatingNote;
  const todos = todosData?.data || [];

  // Utility functions
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
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
    assigned_to: [],
    priority: "Medium",
    category: "General",
    due_date: "",
    status: "pending",
  });

  const [newAssignee, setNewAssignee] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  if (loadingTodos) {
    return <Loader />;
  }

  if (todosError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">
          Error loading todos: {todosError.message}
        </p>
        <CustomButton
          buttonText="Retry"
          onClick={() => refetchTodos()}
          buttonColor="bg-brandPurple"
          radius="rounded-md"
        />
      </div>
    );
  }

  const handleToggleTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTodo(taskId, { status: newStatus });
      refetchTodos();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleAddNote = async (taskId, noteContent) => {
    try {
      await createNote({ content: noteContent });
      refetchTodos();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleSaveTask = async () => {
    try {
      if (!formData.title || !formData.due_date) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Convert sub tasks array to description string
      const descriptionString = tasks
        .map((subTask) => `[${subTask.completed ? "x" : " "}] ${subTask.text}`)
        .join("\n");

      const taskPayload = {
        event: event?.id || event?._id,
        title: formData.title,
        description: descriptionString,
        assigned_to: formData.assigned_to,
        category: formData.category,
        priority: formData.priority,
        due_date: formData.due_date,
      };

      if (editingTask) {
        await updateTodo(editingTask._id, taskPayload);
      } else {
        await createTodo(taskPayload);
      }

      setShowTaskModal(false);
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        assigned_to: [],
        priority: "Medium",
        category: "General",
        due_date: "",
        status: "pending",
      });
      setNewAssignee("");
      setTasks([]);
      setNewTask("");
      refetchTodos();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTodo();
      document.getElementById("delete-task").close();
      refetchTodos();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tasks", label: "All Tasks", icon: CheckSquare },
    { id: "team", label: "Team View", icon: Users },
    { id: "analytics", label: "Progress", icon: TrendingUp },
  ];

  // Filter tasks
  const filteredTasks = todos.filter((task) => {
    const assigneesString = Array.isArray(task.assigned_to)
      ? task.assigned_to.join(" ").toLowerCase()
      : task.assigned_to
      ? task.assigned_to.toLowerCase()
      : "";

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      assigneesString.includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesAssignee =
      filterAssignee === "all" ||
      (Array.isArray(task.assigned_to)
        ? task.assigned_to.includes(filterAssignee)
        : task.assigned_to === filterAssignee);

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Calculate statistics
  const totalTasks = todos.length;
  const completedTasks = todos.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = todos.filter(
    (task) => task.status === "in_progress"
  ).length;
  const overdueTasks = todos.filter((task) => {
    const isOverdue =
      new Date(task.due_date) < new Date() && task.status !== "completed";
    return isOverdue || task.status === "overdue";
  }).length;
  const completionRate =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  // Group tasks by assignee for team view
  const tasksByAssignee = todos.reduce((acc, task) => {
    const assignees = Array.isArray(task.assigned_to)
      ? task.assigned_to.length > 0
        ? task.assigned_to
        : ["Unassigned"]
      : task.assigned_to
      ? [task.assigned_to]
      : ["Unassigned"];

    assignees.forEach((assignee) => {
      if (!acc[assignee]) {
        acc[assignee] = [];
      }
      acc[assignee].push(task);
    });
    return acc;
  }, {});

  // Get unique assignees for filter
  const uniqueAssignees = [
    ...new Set(
      todos
        .flatMap((task) =>
          Array.isArray(task.assigned_to)
            ? task.assigned_to
            : task.assigned_to
            ? [task.assigned_to]
            : []
        )
        .filter(Boolean)
    ),
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalTasks}
              </p>
            </div>
            <CheckSquare className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-green-600">
                {completedTasks}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-blue-600">
                {inProgressTasks}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-semibold text-red-600">
                {overdueTasks}
              </p>
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
                {["high", "medium", "low"].map((priority) => {
                  const priorityTasks = todos.filter(
                    (task) => task.priority === priority
                  );
                  const priorityCompleted = priorityTasks.filter(
                    (task) => task.status === "completed"
                  ).length;
                  const priorityRate =
                    priorityTasks.length > 0
                      ? (priorityCompleted / priorityTasks.length) * 100
                      : 0;

                  return (
                    <div key={priority}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}{" "}
                          Priority
                        </span>
                        <span>
                          {priorityCompleted}/{priorityTasks.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brandOrange h-2 rounded-full"
                          style={{ width: `${priorityRate}%` }}
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
              {todos
                .filter((task) => task.status !== "completed")
                .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                .slice(0, 5)
                .map((task) => {
                  const isOverdue = new Date(task.due_date) < new Date();
                  return (
                    <div
                      key={task._id}
                      className={`p-3 rounded border-l-4 ${
                        isOverdue
                          ? "border-red-500 bg-red-50"
                          : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-600">
                            {Array.isArray(task.assigned_to) &&
                            task.assigned_to.length > 0
                              ? task.assigned_to.join(", ")
                              : task.assigned_to || "Unassigned"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs font-medium ${
                              isOverdue ? "text-red-600" : "text-blue-600"
                            }`}
                          >
                            {formatDate(task.due_date)}
                          </p>
                          {isOverdue && (
                            <span className="text-xs text-red-600">
                              Overdue
                            </span>
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
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple"
              >
                <option value="all">All Assignees</option>
                {uniqueAssignees.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
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
                    priority: "Medium",
                    category: "General",
                    due_date: "",
                    status: "pending",
                  });
                  setNewAssignee("");
                  setTasks([]);
                  setNewTask("");
                  setShowTaskModal(true);
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                formatDate={formatDate}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                onEdit={() => {
                  // Parse description back to sub tasks array
                  const parsedTasks = task.description
                    ? task.description
                        .split("\n")
                        .filter(Boolean)
                        .map((taskLine, index) => {
                          const isCompleted = taskLine.startsWith("[x] ");
                          const text = taskLine.replace(/^\[(x| )\] /, "");
                          return { id: index, text, completed: isCompleted };
                        })
                    : [];

                  setTasks(parsedTasks);
                  setEditingTask(task);
                  setFormData({
                    title: task.title,
                    description: task.description || "",
                    assigned_to: Array.isArray(task.assigned_to)
                      ? task.assigned_to
                      : task.assigned_to
                      ? [task.assigned_to]
                      : [],
                    priority: task.priority,
                    category: task.category || "General",
                    due_date: task.due_date,
                    status: task.status,
                  });
                  setNewAssignee("");
                  setNewTask("");
                  setShowTaskModal(true);
                }}
                onDelete={(taskId) => {
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
                  {searchTerm ||
                  filterStatus !== "all" ||
                  filterPriority !== "all" ||
                  filterAssignee !== "all"
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
            const assigneeCompleted = tasks.filter(
              (task) => task.status === "completed"
            ).length;
            const assigneeRate = (
              (assigneeCompleted / tasks.length) *
              100
            ).toFixed(1);

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
                        {assigneeCompleted}/{tasks.length} tasks completed (
                        {assigneeRate}%)
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
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className={`p-3 rounded border ${
                        task.status === "completed"
                          ? "bg-green-50 border-green-200"
                          : new Date(task.due_date) < new Date() &&
                            task.status !== "completed"
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className={`font-medium text-sm ${
                            task.status === "completed"
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Due: {formatDate(task.due_date)}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs rounded ${getStatusColor(
                          task.status
                        )}`}
                      >
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
            <h3 className="text-lg font-semibold mb-4">
              Task Progress Analytics
            </h3>
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Tasks
                    </label>

                    {/* Current Tasks */}
                    {tasks.length > 0 && (
                      <div className="space-y-2 mb-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                        {tasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white rounded border"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => {
                                  const updatedTasks = tasks.map((t, i) =>
                                    i === index
                                      ? { ...t, completed: !t.completed }
                                      : t
                                  );
                                  setTasks(updatedTasks);
                                }}
                                className="w-4 h-4 text-brandPurple focus:ring-brandPurple border-gray-300 rounded"
                              />
                              <span
                                className={
                                  task.completed
                                    ? "line-through text-gray-500"
                                    : ""
                                }
                              >
                                {task.text}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedTasks = tasks.filter(
                                  (_, i) => i !== index
                                );
                                setTasks(updatedTasks);
                              }}
                              className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                              title="Remove sub task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Task */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter a sub task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brandPurple focus:border-brandPurple"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newTask.trim()) {
                              setTasks([
                                ...tasks,
                                {
                                  id: Date.now(),
                                  text: newTask.trim(),
                                  completed: false,
                                },
                              ]);
                              setNewTask("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTask.trim()) {
                            setTasks([
                              ...tasks,
                              {
                                id: Date.now(),
                                text: newTask.trim(),
                                completed: false,
                              },
                            ]);
                            setNewTask("");
                          }
                        }}
                        disabled={!newTask.trim()}
                        className="px-4 py-2 bg-brandPurple text-white rounded-md hover:bg-brandPurple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Press Enter or click + to add a sub task. Use checkboxes
                      to mark as complete.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned To
                    </label>

                    {/* Current Assignees */}
                    {formData.assigned_to.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                        {formData.assigned_to.map((assignee, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {assignee}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedAssignees =
                                  formData.assigned_to.filter(
                                    (_, i) => i !== index
                                  );
                                setFormData({
                                  ...formData,
                                  assigned_to: updatedAssignees,
                                });
                              }}
                              className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                              title="Remove assignee"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add New Assignee */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter assignee name"
                        value={newAssignee}
                        onChange={(e) => setNewAssignee(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brandPurple focus:border-brandPurple"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (
                              newAssignee.trim() &&
                              !formData.assigned_to.includes(newAssignee.trim())
                            ) {
                              setFormData({
                                ...formData,
                                assigned_to: [
                                  ...formData.assigned_to,
                                  newAssignee.trim(),
                                ],
                              });
                              setNewAssignee("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            newAssignee.trim() &&
                            !formData.assigned_to.includes(newAssignee.trim())
                          ) {
                            setFormData({
                              ...formData,
                              assigned_to: [
                                ...formData.assigned_to,
                                newAssignee.trim(),
                              ],
                            });
                            setNewAssignee("");
                          }
                        }}
                        disabled={
                          !newAssignee.trim() ||
                          formData.assigned_to.includes(newAssignee.trim())
                        }
                        className="px-4 py-2 bg-brandPurple text-white rounded-md hover:bg-brandPurple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Press Enter or click + to add an assignee. Click × to
                      remove.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
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
                      <option value="General">General</option>
                      <option value="Setup">Setup</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Technical">Technical</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Finance">Finance</option>
                      <option value="Vendor Management">
                        Vendor Management
                      </option>
                      <option value="Safety & Security">
                        Safety & Security
                      </option>
                      <option value="Communications">Communications</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    buttonText={editingTask ? "Update Task" : "Create Task"}
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
                      setNewAssignee("");
                      setTasks([]);
                      setNewTask("");
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
