import { useState } from "react";
import {
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { Task } from "../../types";
import { format, isPast, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  Low: { color: "bg-green-100 text-green-700 border-green-200", label: "Low" },
  Medium: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    label: "Medium",
  },
  High: { color: "bg-red-100 text-red-700 border-red-200", label: "High" },
};

const statusConfig = {
  "To Do": { icon: Clock, color: "text-gray-500" },
  "In Progress": { icon: AlertCircle, color: "text-yellow-600" },
  Done: { icon: CheckCircle2, color: "text-green-600" },
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  const isOverdue =
    task.dueDate && task.status !== "Done" && isPast(parseISO(task.dueDate));

  const handleDelete = () => {
    onDelete(task._id);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`bg-white rounded-xl border ${isOverdue ? "border-red-300 shadow-red-100" : "border-gray-200"} p-5 hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${priority.color}`}
            >
              {priority.label}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}
            >
              <StatusIcon size={14} />
              {task.status}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Overdue
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-gray-900 truncate">
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div
              className={`flex items-center gap-1.5 mt-3 text-xs ${isOverdue ? "text-red-600 font-medium" : "text-gray-400"}`}
            >
              <Calendar size={14} />
              Due {format(parseISO(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>

          {showDeleteConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
