import { useState } from "react";
import {
  X,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import type { Task, CreateTaskDto } from "../../types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: CreateTaskDto) => Promise<void>;
  task?: Task | null;
}

const priorities = [
  {
    value: "Low",
    label: "Low",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    value: "Medium",
    label: "Medium",
    color: "amber",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    value: "High",
    label: "High",
    color: "red",
    gradient: "from-red-500 to-rose-400",
  },
];

const statuses = [
  { value: "To Do", label: "To Do", icon: Clock, color: "slate" },
  {
    value: "In Progress",
    label: "In Progress",
    icon: AlertCircle,
    color: "amber",
  },
  { value: "Done", label: "Done", icon: CheckCircle2, color: "emerald" },
];

const getInitialValues = (task: Task | null | undefined) => {
  if (task) {
    return {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    };
  }
  return {
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    dueDate: "",
  };
};

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
}: TaskModalProps) {
  const { isDark } = useTheme();
  const isEditing = !!task;
  const initialValues = getInitialValues(task);

  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [priority, setPriority] = useState(initialValues.priority);
  const [status, setStatus] = useState(initialValues.status);
  const [dueDate, setDueDate] = useState(initialValues.dueDate);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        dueDate: dueDate || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save task";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`backdrop-blur-xl border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-colors ${
          isDark
            ? "bg-slate-900/95 border-white/10"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b transition-colors ${
            isDark ? "border-white/10" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl bg-gradient-to-r ${isEditing ? "from-blue-500 to-cyan-500" : "from-emerald-500 to-teal-500"} shadow-lg`}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {isEditing ? "Edit Task" : "Create New Task"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? "text-slate-500 hover:text-white hover:bg-white/10"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div
              className={`p-4 border rounded-xl flex items-center gap-3 text-sm ${
                isDark
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                isDark
                  ? "bg-slate-800/50 border-white/10 text-white placeholder-slate-500 focus:ring-blue-500/50 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"
              }`}
              placeholder="Enter task title"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                isDark
                  ? "bg-slate-800/50 border-white/10 text-white placeholder-slate-500 focus:ring-blue-500/50 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"
              }`}
              rows={3}
              placeholder="Add a description (optional)"
              maxLength={2000}
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                isDark ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    priority === p.value
                      ? isDark
                        ? `border-${p.color}-500/50 bg-${p.color}-500/20 text-${p.color}-400 ring-1 ring-${p.color}-500/50`
                        : `border-${p.color}-500 bg-${p.color}-50 text-${p.color}-700 ring-1 ring-${p.color}-500/50`
                      : isDark
                        ? "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${p.gradient} mx-auto mb-1.5`}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label
              className={`block text-sm font-medium mb-3 ${
                isDark ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {statuses.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStatus(s.value)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1.5 ${
                      status === s.value
                        ? isDark
                          ? `border-${s.color}-500/50 bg-${s.color}-500/20 text-${s.color}-400 ring-1 ring-${s.color}-500/50`
                          : `border-${s.color}-500 bg-${s.color}-50 text-${s.color}-700 ring-1 ring-${s.color}-500/50`
                        : isDark
                          ? "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={16} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Due Date
            </label>
            <div className="relative">
              <Calendar
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
                size={18}
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isDark
                    ? "bg-slate-800/50 border-white/10 text-white focus:ring-blue-500/50 focus:border-blue-500 [color-scheme:dark]"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500/30 focus:border-blue-500"
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 font-medium rounded-xl transition-all ${
                isDark
                  ? "text-slate-300 hover:bg-white/10"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
