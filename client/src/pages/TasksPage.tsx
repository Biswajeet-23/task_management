import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";
import TaskCard from "../components/tasks/TaskCard";
import TaskModal from "../components/tasks/TaskModal";
import {
  Plus,
  Filter,
  Search,
  AlertCircle,
  X,
  LayoutGrid,
  List,
  RotateCcw,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import type { Task, CreateTaskDto } from "../types";

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  } = useTasks();

  const { isDark } = useTheme();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });

  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const openDeleteConfirm = useCallback((task: Task) => {
    setDeleteConfirm({
      isOpen: true,
      taskId: task._id,
      taskTitle: task.title,
    });
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirm({
      isOpen: false,
      taskId: null,
      taskTitle: "",
    });
  }, []);

  const handleDelete = useCallback(async () => {
    if (deleteConfirm.taskId) {
      await deleteTask(deleteConfirm.taskId);
      closeDeleteConfirm();
    }
  }, [deleteConfirm.taskId, deleteTask, closeDeleteConfirm]);

  useEffect(() => {
    if (location.state?.openModal) {
      openCreateModal();
      window.history.replaceState({}, document.title);
    }
  }, [location, openCreateModal]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (task: CreateTaskDto) => {
    await createTask(task);
    closeModal();
  };

  const handleUpdate = async (task: CreateTaskDto) => {
    if (editingTask) {
      await updateTask(editingTask._id, task);
      closeModal();
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      status: "",
      priority: "",
      sortBy: "dueDate",
    });
  };

  const hasActiveFilters =
    searchQuery ||
    filters.status ||
    filters.priority ||
    filters.sortBy !== "dueDate";

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Status filter badge config for light theme
  const getStatusBadgeStyle = (status: string) => {
    if (!status) return "";
    switch (status) {
      case "To Do":
        return isDark
          ? "bg-slate-500/10 border-slate-500/20 text-slate-400"
          : "bg-slate-100 border-slate-300 text-slate-700";
      case "In Progress":
        return isDark
          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
          : "bg-amber-50 border-amber-300 text-amber-700";
      case "Done":
        return isDark
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-emerald-50 border-emerald-300 text-emerald-700";
      default:
        return "";
    }
  };

  // Priority filter badge config for light theme
  const getPriorityBadgeStyle = (priority: string) => {
    if (!priority) return "";
    switch (priority) {
      case "Low":
        return isDark
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-emerald-50 border-emerald-300 text-emerald-700";
      case "Medium":
        return isDark
          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
          : "bg-amber-50 border-amber-300 text-amber-700";
      case "High":
        return isDark
          ? "bg-red-500/10 border-red-500/20 text-red-400"
          : "bg-red-50 border-red-300 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-3xl font-bold tracking-tight transition-colors ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              My Tasks
            </h1>
            <p
              className={`mt-1 transition-colors ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Manage and organize your tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`backdrop-blur-xl border rounded-xl p-1 flex items-center transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div
          className={`backdrop-blur-xl border rounded-2xl p-5 space-y-4 transition-colors ${
            isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  isDark
                    ? "text-slate-500 group-focus-within:text-blue-400"
                    : "text-gray-400 group-focus-within:text-blue-600"
                }`}
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isDark
                    ? "bg-slate-800/50 border-white/10 text-white placeholder-slate-500 focus:ring-blue-500/50 focus:border-blue-500"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                    isDark
                      ? "text-slate-500 hover:text-slate-300"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter
                size={16}
                className={`shrink-0 transition-colors ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
              />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm appearance-none cursor-pointer min-w-[140px] ${
                  isDark
                    ? "bg-slate-800/50 border-white/10 text-white focus:ring-blue-500/50 focus:border-blue-500"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/30 focus:border-blue-500"
                }`}
              >
                <option
                  value=""
                  className={isDark ? "bg-slate-800" : "bg-white"}
                >
                  All Status
                </option>
                <option
                  value="To Do"
                  className={isDark ? "bg-slate-800" : "bg-white"}
                >
                  To Do
                </option>
                <option
                  value="In Progress"
                  className={isDark ? "bg-slate-800" : "bg-white"}
                >
                  In Progress
                </option>
                <option
                  value="Done"
                  className={isDark ? "bg-slate-800" : "bg-white"}
                >
                  Done
                </option>
              </select>
            </div>

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm appearance-none cursor-pointer min-w-[140px] ${
                isDark
                  ? "bg-slate-800/50 border-white/10 text-white focus:ring-blue-500/50 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/30 focus:border-blue-500"
              }`}
            >
              <option value="" className={isDark ? "bg-slate-800" : "bg-white"}>
                All Priorities
              </option>
              <option
                value="Low"
                className={isDark ? "bg-slate-800" : "bg-white"}
              >
                Low
              </option>
              <option
                value="Medium"
                className={isDark ? "bg-slate-800" : "bg-white"}
              >
                Medium
              </option>
              <option
                value="High"
                className={isDark ? "bg-slate-800" : "bg-white"}
              >
                High
              </option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
              className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm appearance-none cursor-pointer min-w-[160px] ${
                isDark
                  ? "bg-slate-800/50 border-white/10 text-white focus:ring-blue-500/50 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/30 focus:border-blue-500"
              }`}
            >
              <option
                value="dueDate"
                className={isDark ? "bg-slate-800" : "bg-white"}
              >
                Sort by Due Date
              </option>
              <option
                value="createdAt"
                className={isDark ? "bg-slate-800" : "bg-white"}
              >
                Sort by Created
              </option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className={`inline-flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isDark
                    ? "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/10"
                    : "bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 border-gray-200"
                }`}
                title="Clear all filters"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div
              className={`flex flex-wrap items-center gap-2 pt-2 border-t transition-colors ${
                isDark ? "border-white/5" : "border-gray-200"
              }`}
            >
              <span
                className={`text-xs font-medium transition-colors ${
                  isDark ? "text-slate-500" : "text-gray-500"
                }`}
              >
                Active filters:
              </span>
              {searchQuery && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    isDark
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }`}
                >
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`transition-colors ${
                      isDark ? "hover:text-blue-300" : "hover:text-blue-500"
                    }`}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.status && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border ${getStatusBadgeStyle(filters.status)}`}
                >
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "" })}
                    className={`transition-colors ${
                      isDark ? "hover:opacity-70" : "hover:opacity-70"
                    }`}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.priority && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border ${getPriorityBadgeStyle(filters.priority)}`}
                >
                  Priority: {filters.priority}
                  <button
                    onClick={() => setFilters({ ...filters, priority: "" })}
                    className={`transition-colors ${
                      isDark ? "hover:opacity-70" : "hover:opacity-70"
                    }`}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.sortBy !== "dueDate" && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    isDark
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}
                >
                  Sort:{" "}
                  {filters.sortBy === "createdAt" ? "Created" : filters.sortBy}
                  <button
                    onClick={() =>
                      setFilters({ ...filters, sortBy: "dueDate" })
                    }
                    className={`transition-colors ${
                      isDark
                        ? "hover:text-emerald-300"
                        : "hover:text-emerald-500"
                    }`}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className={`border rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm transition-colors ${
              isDark
                ? "bg-red-500/10 border-red-500/20"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "bg-red-500/20" : "bg-red-100"
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 transition-colors ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              />
            </div>
            <p
              className={`text-sm flex-1 transition-colors ${
                isDark ? "text-red-300" : "text-red-700"
              }`}
            >
              {error}
            </p>
            <button
              onClick={clearError}
              className={`font-medium text-sm transition-colors ${
                isDark
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-600 hover:text-red-500"
              }`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tasks List - Scrollable */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500/30 border-t-blue-500"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            className={`backdrop-blur-xl border rounded-2xl p-16 text-center transition-colors ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search
                size={32}
                className={isDark ? "text-blue-400" : "text-blue-500"}
              />
            </div>
            <h3
              className={`text-xl font-semibold mb-2 transition-colors ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              No tasks found
            </h3>
            <p
              className={`mb-6 transition-colors ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {hasActiveFilters
                ? "Try adjusting your filters or search query"
                : "Get started by creating your first task"}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all border ${
                  isDark
                    ? "bg-white/10 text-slate-300 hover:bg-white/15 border-white/10"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                }`}
              >
                <RotateCcw size={18} />
                Clear Filters
              </button>
            ) : (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
              >
                <Plus size={18} />
                Create a task
              </button>
            )}
          </div>
        ) : (
          <div
            className={`border rounded-2xl overflow-hidden transition-colors ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            {/* Scrollable container */}
            <div
              className="overflow-y-auto max-h-[calc(100vh-320px)] min-h-[300px] p-4"
              style={{ scrollbarWidth: "thin" }}
            >
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={openDeleteConfirm}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>

            {/* Task count footer */}
            <div
              className={`px-4 py-3 border-t text-sm flex items-center justify-between ${
                isDark
                  ? "border-white/10 text-slate-400"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              <span>
                Showing{" "}
                <span
                  className={
                    isDark ? "text-white" : "text-gray-900 font-medium"
                  }
                >
                  {filteredTasks.length}
                </span>{" "}
                of{" "}
                <span
                  className={
                    isDark ? "text-white" : "text-gray-900 font-medium"
                  }
                >
                  {tasks.length}
                </span>{" "}
                tasks
              </span>
              {filteredTasks.length > 0 && (
                <span className="text-xs opacity-60">Scroll to see more</span>
              )}
            </div>
          </div>
        )}

        {/* Floating Action Button - Mobile */}
        <button
          onClick={openCreateModal}
          className="fixed bottom-6 right-6 md:hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-full shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all z-40 hover:-translate-y-1 active:translate-y-0"
          aria-label="Create new task"
        >
          <Plus size={24} />
        </button>

        {/* Task Modal */}
        <TaskModal
          key={modalKey}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          task={editingTask}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
              className={`backdrop-blur-xl border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200 transition-colors ${
                isDark
                  ? "bg-slate-900/95 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Icon & Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/20 mb-4">
                  <AlertTriangle
                    className={`w-7 h-7 transition-colors ${
                      isDark ? "text-red-400" : "text-red-500"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-bold mb-2 transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Delete Task
                </h3>
                <p
                  className={`text-sm transition-colors ${
                    isDark ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  Are you sure you want to delete this task?
                </p>
                <p
                  className={`font-medium mt-2 px-4 py-2 rounded-xl border transition-colors ${
                    isDark
                      ? "text-white bg-white/5 border-white/10"
                      : "text-gray-900 bg-gray-50 border-gray-200"
                  }`}
                >
                  "{deleteConfirm.taskTitle}"
                </p>
              </div>

              {/* Warning */}
              <div
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${
                    isDark ? "text-red-400" : "text-red-500"
                  }`}
                />
                <p
                  className={`text-sm transition-colors ${
                    isDark ? "text-red-300" : "text-red-700"
                  }`}
                >
                  This action cannot be undone. The task will be permanently
                  removed from your list.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={closeDeleteConfirm}
                  className={`flex-1 px-4 py-3 font-medium rounded-xl transition-all border ${
                    isDark
                      ? "text-slate-300 hover:bg-white/10 border-white/10"
                      : "text-gray-700 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-500/25"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
