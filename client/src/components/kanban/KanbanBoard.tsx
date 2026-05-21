import { useState, useCallback, useRef } from "react";
import { useTheme } from "../../hooks/useTheme";
import { format, isPast, parseISO } from "date-fns";
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  GripVertical,
} from "lucide-react";
import type { Task } from "../../types";

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

type StatusColumn = "To Do" | "In Progress" | "Done";

const columns: { id: StatusColumn; label: string; color: string }[] = [
  { id: "To Do", label: "To Do", color: "slate" },
  { id: "In Progress", label: "In Progress", color: "amber" },
  { id: "Done", label: "Done", color: "emerald" },
];

const priorityDot = {
  Low: "bg-emerald-400",
  Medium: "bg-amber-400",
  High: "bg-red-400",
};

export default function KanbanBoard({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  const { isDark } = useTheme();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggingId(task._id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task._id);
    // Create a clean drag image
    const el = e.currentTarget as HTMLElement;
    if (el) {
      e.dataTransfer.setDragImage(el, 20, 20);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverColumn(null);
    dragCounter.current = 0;
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      dragCounter.current += 1;
      setDragOverColumn(columnId);
    },
    [],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, columnId: StatusColumn) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragOverColumn(null);

      const taskId = e.dataTransfer.getData("text/plain");
      if (!taskId) return;

      const task = tasks.find((t) => t._id === taskId);
      if (!task || task.status === columnId) {
        setDraggingId(null);
        return;
      }

      setUpdatingId(taskId);
      setDraggingId(null);

      try {
        await onStatusChange(taskId, columnId);
      } finally {
        setUpdatingId(null);
      }
    },
    [tasks, onStatusChange],
  );

  const getTasksByStatus = (status: StatusColumn) =>
    tasks.filter((t) => t.status === status);

  const columnHeaderBg = (color: string) => {
    if (isDark) {
      switch (color) {
        case "slate":
          return "bg-slate-500/15 border-slate-500/25";
        case "amber":
          return "bg-amber-500/15 border-amber-500/25";
        case "emerald":
          return "bg-emerald-500/15 border-emerald-500/25";
      }
    }
    switch (color) {
      case "slate":
        return "bg-slate-100 border-slate-300";
      case "amber":
        return "bg-amber-50 border-amber-300";
      case "emerald":
        return "bg-emerald-50 border-emerald-300";
    }
    return "";
  };

  const columnHeaderText = (color: string) => {
    if (isDark) {
      switch (color) {
        case "slate":
          return "text-slate-300";
        case "amber":
          return "text-amber-300";
        case "emerald":
          return "text-emerald-300";
      }
    }
    switch (color) {
      case "slate":
        return "text-slate-700";
      case "amber":
        return "text-amber-700";
      case "emerald":
        return "text-emerald-700";
    }
    return "";
  };

  const columnDropHighlight = (columnId: string) => {
    if (dragOverColumn !== columnId) return "";
    return isDark
      ? "ring-2 ring-blue-500/40 bg-blue-500/5"
      : "ring-2 ring-blue-400/40 bg-blue-50";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => {
        const colTasks = getTasksByStatus(col.id);
        const isDropTarget = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            className={`flex flex-col rounded-2xl border transition-all duration-200 ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-gray-50/50 border-gray-200"
            } ${columnDropHighlight(col.id)}`}
            onDragEnter={(e) => handleDragEnter(e, col.id)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-t-2xl border-b ${columnHeaderBg(col.color)}`}
            >
              <div className="flex items-center gap-2">
                {col.id === "To Do" && (
                  <Clock size={16} className={columnHeaderText(col.color)} />
                )}
                {col.id === "In Progress" && (
                  <AlertCircle
                    size={16}
                    className={columnHeaderText(col.color)}
                  />
                )}
                {col.id === "Done" && (
                  <CheckCircle2
                    size={16}
                    className={columnHeaderText(col.color)}
                  />
                )}
                <span
                  className={`text-sm font-semibold ${columnHeaderText(col.color)}`}
                >
                  {col.label}
                </span>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isDark
                    ? "bg-white/10 text-slate-400"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex-1 p-3 space-y-3 min-h-[200px] max-h-[calc(100vh-380px)] overflow-y-auto">
              {colTasks.length === 0 && !isDropTarget && (
                <div
                  className={`flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed transition-colors ${
                    isDark
                      ? "border-white/5 text-slate-600"
                      : "border-gray-200 text-gray-400"
                  }`}
                >
                  <span className="text-xs">Drop tasks here</span>
                </div>
              )}

              {colTasks.map((task) => {
                const isDragging = draggingId === task._id;
                const isUpdating = updatingId === task._id;
                const isOverdue =
                  task.dueDate &&
                  task.status !== "Done" &&
                  isPast(parseISO(task.dueDate));

                return (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className={`group relative rounded-xl border p-4 cursor-move transition-all duration-200 ${
                      isDark
                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                    } ${isDragging ? "opacity-40 rotate-2 scale-95" : ""} ${
                      isUpdating ? "opacity-60" : ""
                    } ${isOverdue ? (isDark ? "border-red-500/30" : "border-red-300") : ""}`}
                  >
                    {/* Drag handle */}
                    <div
                      className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isDark ? "text-slate-600" : "text-gray-400"
                      }`}
                    >
                      <GripVertical size={14} />
                    </div>

                    {/* Priority dot + Title */}
                    <div className="flex items-start gap-2 mb-2 pr-4">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${priorityDot[task.priority]}`}
                      />
                      <h4
                        className={`text-sm font-semibold leading-snug ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>

                    {/* Description (truncated) */}
                    {task.description && (
                      <p
                        className={`text-xs mb-3 line-clamp-2 pl-4 ${
                          isDark ? "text-slate-400" : "text-gray-500"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Footer: Due date + Actions */}
                    <div className="flex items-center justify-between pl-4">
                      {task.dueDate ? (
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            isOverdue
                              ? isDark
                                ? "text-red-400 font-medium"
                                : "text-red-600 font-medium"
                              : isDark
                                ? "text-slate-500"
                                : "text-gray-400"
                          }`}
                        >
                          <Calendar size={12} />
                          {isOverdue ? "Overdue " : ""}
                          {format(parseISO(task.dueDate), "MMM d")}
                        </div>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                          }}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isDark
                              ? "text-slate-500 hover:text-blue-400 hover:bg-blue-500/10"
                              : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task);
                          }}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isDark
                              ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Updating overlay */}
                    {isUpdating && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-[1px]">
                        <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
