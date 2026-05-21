import { useEffect, useState, useCallback } from "react";
import { useTasks } from "../hooks/useTasks";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import KanbanBoard from "../components/kanban/KanbanBoard";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  TrendingUp,
  Calendar,
  LayoutGrid,
  BarChart3,
} from "lucide-react";
import type { Task, UpdateTaskDto } from "../types";

export default function DashboardPage() {
  const {
    dashboard,
    fetchDashboard,
    isLoading,
    tasks,
    fetchTasks,
    updateTask,
  } = useTasks();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [view, setView] = useState<"stats" | "kanban">("stats");
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
    fetchTasks();
  }, [fetchDashboard, fetchTasks]);

  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: string) => {
      setUpdatingTaskId(taskId);
      try {
        const updateData: UpdateTaskDto = {
          status: newStatus as Task["status"],
        };
        await updateTask(taskId, updateData);
        await fetchDashboard();
      } finally {
        setUpdatingTaskId(null);
      }
    },
    [updateTask, fetchDashboard],
  );

  const handleEdit = useCallback(
    (task: Task) => {
      navigate("/tasks", { state: { editTask: task } });
    },
    [navigate],
  );

  const handleDelete = useCallback(
    (task: Task) => {
      navigate("/tasks", { state: { deleteTask: task } });
    },
    [navigate],
  );

  const stats = [
    {
      label: "Total Tasks",
      value: dashboard?.total || 0,
      icon: ClipboardList,
      gradient: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/20",
      textColor: isDark ? "text-blue-400" : "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "To Do",
      value: dashboard?.byStatus["To Do"] || 0,
      icon: Clock,
      gradient: "from-slate-500 to-slate-400",
      shadow: "shadow-slate-500/20",
      textColor: isDark ? "text-slate-400" : "text-slate-600",
      bgColor: "bg-slate-500/10",
    },
    {
      label: "In Progress",
      value: dashboard?.byStatus["In Progress"] || 0,
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-400",
      shadow: "shadow-amber-500/20",
      textColor: isDark ? "text-amber-400" : "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Done",
      value: dashboard?.byStatus["Done"] || 0,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-400",
      shadow: "shadow-emerald-500/20",
      textColor: isDark ? "text-emerald-400" : "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-3xl font-bold tracking-tight transition-colors ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Dashboard
            </h1>
            <p
              className={`mt-1 flex items-center gap-2 transition-colors ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Overview of your tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div
              className={`backdrop-blur-xl border rounded-xl p-1 flex items-center transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => setView("stats")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === "stats"
                    ? "bg-blue-500 text-white"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Stats</span>
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === "kanban"
                    ? "bg-blue-500 text-white"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <LayoutGrid size={16} />
                <span className="hidden sm:inline">Board</span>
              </button>
            </div>
            <button
              onClick={() => navigate("/tasks", { state: { openModal: true } })}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>

        {/* Overdue Alert */}
        {dashboard && dashboard.overdue > 0 && (
          <div
            className={`border rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm transition-colors ${
              isDark
                ? "bg-red-500/10 border-red-500/20"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div
              className={`p-3 rounded-xl transition-colors ${
                isDark ? "bg-red-500/20" : "bg-red-100"
              }`}
            >
              <AlertTriangle
                className={`w-6 h-6 transition-colors ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <p
                className={`font-semibold transition-colors ${
                  isDark ? "text-red-300" : "text-red-700"
                }`}
              >
                You have {dashboard.overdue} overdue{" "}
                {dashboard.overdue === 1 ? "task" : "tasks"}
              </p>
              <p
                className={`text-sm mt-0.5 transition-colors ${
                  isDark ? "text-red-400/70" : "text-red-600/70"
                }`}
              >
                Don't forget to check your task list and update their status
              </p>
            </div>
            <button
              onClick={() => navigate("/tasks")}
              className={`font-medium text-sm flex items-center gap-1 transition-colors ${
                isDark
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-600 hover:text-red-500"
              }`}
            >
              View tasks
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Stats View */}
        {view === "stats" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`backdrop-blur-xl border rounded-2xl p-6 transition-all hover:-translate-y-1 group cursor-pointer ${
                      isDark
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => navigate("/tasks")}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadow} shadow-lg`}
                      >
                        <Icon className="text-white w-5 h-5" />
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 transition-colors ${
                          isDark
                            ? "text-slate-600 group-hover:text-slate-400"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-sm font-medium transition-colors ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {stat.label}
                    </p>
                    <p
                      className={`text-3xl font-bold mt-1 transition-colors ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {isLoading ? (
                        <span
                          className={`animate-pulse rounded-lg h-8 w-16 inline-block transition-colors ${
                            isDark ? "bg-slate-700" : "bg-gray-200"
                          }`}
                        ></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Status Breakdown */}
            <div
              className={`backdrop-blur-xl border rounded-2xl p-8 transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-semibold mb-6 flex items-center gap-2 transition-colors ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <TrendingUp
                  className={`w-5 h-5 transition-colors ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                Task Status Breakdown
              </h2>
              {dashboard && (
                <div className="space-y-6">
                  {[
                    {
                      label: "To Do",
                      count: dashboard.byStatus["To Do"],
                      color: "bg-slate-500",
                      gradient: "from-slate-500 to-slate-400",
                      textColor: isDark ? "text-slate-400" : "text-slate-600",
                    },
                    {
                      label: "In Progress",
                      count: dashboard.byStatus["In Progress"],
                      color: "bg-amber-500",
                      gradient: "from-amber-500 to-orange-400",
                      textColor: isDark ? "text-amber-400" : "text-amber-600",
                    },
                    {
                      label: "Done",
                      count: dashboard.byStatus["Done"],
                      color: "bg-emerald-500",
                      gradient: "from-emerald-500 to-teal-400",
                      textColor: isDark
                        ? "text-emerald-400"
                        : "text-emerald-600",
                    },
                  ].map((item) => {
                    const percentage =
                      dashboard.total > 0
                        ? (item.count / dashboard.total) * 100
                        : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm font-medium flex items-center gap-2 transition-colors ${
                              isDark ? "text-slate-300" : "text-gray-700"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${item.color}`}
                            />
                            {item.label}
                          </span>
                          <span
                            className={`text-sm transition-colors ${
                              isDark ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            {item.count}{" "}
                            <span
                              className={`transition-colors ${
                                isDark ? "text-slate-500" : "text-gray-400"
                              }`}
                            >
                              ({Math.round(percentage)}%)
                            </span>
                          </span>
                        </div>
                        <div
                          className={`h-3 rounded-full overflow-hidden transition-colors ${
                            isDark ? "bg-slate-800" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Kanban Board View */}
        {view === "kanban" && (
          <div className="space-y-4">
            <div
              className={`flex items-center justify-between ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              <p className="text-sm">
                Drag and drop tasks between columns to update their status
              </p>
              {updatingTaskId && (
                <span className="text-xs flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                  Updating...
                </span>
              )}
            </div>
            <KanbanBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div
          className={`backdrop-blur-xl border rounded-2xl p-8 transition-colors ${
            isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-6 transition-colors ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/tasks", { state: { openModal: true } })}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus size={18} />
              Create New Task
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all border hover:-translate-y-0.5 active:translate-y-0 ${
                isDark
                  ? "bg-white/10 text-slate-300 hover:bg-white/15 border-white/10"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
              }`}
            >
              View All Tasks
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
