import {
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { Task } from "../../types";
import { useTheme } from "../../hooks/useTheme";
import { format, isPast, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  viewMode?: "list" | "grid";
}

const getPriorityConfig = (isDark: boolean) => ({
  Low: {
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: isDark ? "border-emerald-500/30" : "border-emerald-400/50",
    text: isDark ? "text-emerald-400" : "text-emerald-700",
    dot: "bg-emerald-400",
    label: "Low",
    bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
  },
  Medium: {
    gradient: "from-amber-500/20 to-orange-500/20",
    border: isDark ? "border-amber-500/30" : "border-amber-400/50",
    text: isDark ? "text-amber-400" : "text-amber-700",
    dot: "bg-amber-400",
    label: "Medium",
    bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
  },
  High: {
    gradient: "from-red-500/20 to-rose-500/20",
    border: isDark ? "border-red-500/30" : "border-red-400/50",
    text: isDark ? "text-red-400" : "text-red-700",
    dot: "bg-red-400",
    label: "High",
    bg: isDark ? "bg-red-500/10" : "bg-red-50",
  },
});

const getStatusConfig = (isDark: boolean) => ({
  "To Do": {
    icon: Clock,
    gradient: "from-slate-500/20 to-slate-400/20",
    border: isDark ? "border-slate-500/30" : "border-slate-400/50",
    text: isDark ? "text-slate-400" : "text-slate-700",
    bg: isDark ? "bg-slate-500/10" : "bg-slate-50",
  },
  "In Progress": {
    icon: AlertCircle,
    gradient: "from-amber-500/20 to-orange-500/20",
    border: isDark ? "border-amber-500/30" : "border-amber-400/50",
    text: isDark ? "text-amber-400" : "text-amber-700",
    bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
  },
  Done: {
    icon: CheckCircle2,
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: isDark ? "border-emerald-500/30" : "border-emerald-400/50",
    text: isDark ? "text-emerald-400" : "text-emerald-700",
    bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
  },
});

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  viewMode = "list",
}: TaskCardProps) {
  const { isDark } = useTheme();
  const priorityConfig = getPriorityConfig(isDark);
  const statusConfig = getStatusConfig(isDark);
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  const isOverdue =
    task.dueDate && task.status !== "Done" && isPast(parseISO(task.dueDate));

  // Overdue badge style
  const overdueBadgeStyle = isDark
    ? "bg-red-500/10 text-red-400 border-red-500/20"
    : "bg-red-50 text-red-600 border-red-300";

  if (viewMode === "grid") {
    return (
      <div
        className={`backdrop-blur-xl border rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group relative overflow-hidden ${
          isDark
            ? "bg-white/5 border-white/10 hover:bg-white/10"
            : "bg-white border-gray-200 hover:border-gray-300"
        } ${isOverdue ? (isDark ? "border-red-500/30" : "border-red-300") : ""}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${priority.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${priority.border} ${priority.text} ${priority.bg}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                {priority.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.border} ${status.text} ${status.bg}`}
              >
                <StatusIcon size={12} />
                {task.status}
              </span>
            </div>
          </div>

          <h3
            className={`text-lg font-semibold mb-2 line-clamp-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-sm mb-4 line-clamp-2 ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            {task.dueDate && (
              <div
                className={`flex items-center gap-1.5 text-xs ${
                  isOverdue
                    ? isDark
                      ? "text-red-400 font-medium"
                      : "text-red-600 font-medium"
                    : isDark
                      ? "text-slate-500"
                      : "text-gray-500"
                }`}
              >
                <Calendar size={14} />
                {isOverdue ? "Overdue: " : "Due "}
                {format(parseISO(task.dueDate), "MMM d, yyyy")}
              </div>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "text-slate-500 hover:text-blue-400 hover:bg-blue-500/10"
                    : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                }`}
                title="Edit task"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(task)}
                className={`p-2 rounded-lg transition-all ${
                  isDark
                    ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                    : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                }`}
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div
      className={`backdrop-blur-xl border rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 group ${
        isDark
          ? "bg-white/5 border-white/10 hover:bg-white/10"
          : "bg-white border-gray-200 hover:border-gray-300"
      } ${isOverdue ? (isDark ? "border-red-500/30" : "border-red-300") : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${priority.border} ${priority.text} ${priority.bg}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.border} ${status.text} ${status.bg}`}
            >
              <StatusIcon size={12} />
              {task.status}
            </span>
            {isOverdue && (
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${overdueBadgeStyle}`}
              >
                <AlertCircle size={12} />
                Overdue
              </span>
            )}
          </div>

          <h3
            className={`text-base font-semibold mb-1 truncate transition-colors ${
              isDark
                ? "text-white group-hover:text-blue-400"
                : "text-gray-900 group-hover:text-blue-600"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-sm line-clamp-2 mb-3 ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div
              className={`flex items-center gap-1.5 text-xs ${
                isOverdue
                  ? isDark
                    ? "text-red-400 font-medium"
                    : "text-red-600 font-medium"
                  : isDark
                    ? "text-slate-500"
                    : "text-gray-500"
              }`}
            >
              <Calendar size={14} />
              {isOverdue ? "Overdue: " : "Due "}
              {format(parseISO(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className={`p-2.5 rounded-xl transition-all ${
              isDark
                ? "text-slate-500 hover:text-blue-400 hover:bg-blue-500/10"
                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            }`}
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className={`p-2.5 rounded-xl transition-all ${
              isDark
                ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
            }`}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
