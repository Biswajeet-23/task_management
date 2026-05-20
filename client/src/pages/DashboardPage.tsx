import { useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const { dashboard, fetchDashboard, isLoading } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = [
    {
      label: "Total Tasks",
      value: dashboard?.total || 0,
      icon: ClipboardList,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-700",
    },
    {
      label: "To Do",
      value: dashboard?.byStatus["To Do"] || 0,
      icon: Clock,
      color: "bg-gray-500",
      lightColor: "bg-gray-50 text-gray-700",
    },
    {
      label: "In Progress",
      value: dashboard?.byStatus["In Progress"] || 0,
      icon: AlertTriangle,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Done",
      value: dashboard?.byStatus["Done"] || 0,
      icon: CheckCircle2,
      color: "bg-green-500",
      lightColor: "bg-green-50 text-green-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your tasks</p>
        </div>
        <button
          onClick={() => navigate("/tasks")}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Overdue Alert */}
      {dashboard && dashboard.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-600 shrink-0" size={20} />
          <div>
            <p className="text-red-800 font-medium">
              You have {dashboard.overdue} overdue{" "}
              {dashboard.overdue === 1 ? "task" : "tasks"}
            </p>
            <p className="text-red-600 text-sm">
              Don't forget to check your task list
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {isLoading ? (
                      <span className="animate-pulse bg-gray-200 rounded h-8 w-12 inline-block"></span>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`${stat.lightColor} p-2.5 rounded-lg`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Task Status Breakdown
        </h2>
        {dashboard && (
          <div className="space-y-4">
            {[
              {
                label: "To Do",
                count: dashboard.byStatus["To Do"],
                color: "bg-gray-500",
                bg: "bg-gray-100",
              },
              {
                label: "In Progress",
                count: dashboard.byStatus["In Progress"],
                color: "bg-yellow-500",
                bg: "bg-yellow-100",
              },
              {
                label: "Done",
                count: dashboard.byStatus["Done"],
                color: "bg-green-500",
                bg: "bg-green-100",
              },
            ].map((item) => {
              const percentage =
                dashboard.total > 0 ? (item.count / dashboard.total) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className={`h-2.5 rounded-full ${item.bg}`}>
                    <div
                      className={`h-2.5 rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions - Always show Create Task button */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/tasks", { state: { openModal: true } })}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-gray-700 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Create New Task
          </button>
          <button
            onClick={() => navigate("/tasks")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors"
          >
            View All Tasks
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate("/tasks")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Manage Tasks
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
