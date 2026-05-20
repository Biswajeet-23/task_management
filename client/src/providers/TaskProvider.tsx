import { useState, useCallback, type ReactNode } from "react";
import { tasksApi } from "../services/api";
import { TaskContext } from "../context/TaskContext";
import type {
  Task,
  DashboardStats,
  TaskFilters,
  CreateTaskDto,
  UpdateTaskDto,
} from "../types";

const defaultFilters: TaskFilters = {
  status: "",
  priority: "",
  sortBy: "dueDate",
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TaskFilters>(defaultFilters);

  const setFilters = useCallback((newFilters: TaskFilters) => {
    setFiltersState(newFilters);
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tasksApi.getAll({
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        sortBy: filters.sortBy || undefined,
      });
      setTasks(response.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await tasksApi.getDashboard();
      setDashboard(response.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch dashboard";
      setError(message);
    }
  }, []);

  const createTask = async (task: CreateTaskDto) => {
    setError(null);
    try {
      await tasksApi.create(task);
      await fetchTasks();
      await fetchDashboard();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create task";
      setError(message);
      throw err;
    }
  };

  const updateTask = async (id: string, task: UpdateTaskDto) => {
    setError(null);
    try {
      await tasksApi.update(id, task);
      await fetchTasks();
      await fetchDashboard();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update task";
      setError(message);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    setError(null);
    try {
      await tasksApi.delete(id);
      await fetchTasks();
      await fetchDashboard();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete task";
      setError(message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        dashboard,
        isLoading,
        error,
        filters,
        setFilters,
        fetchTasks,
        fetchDashboard,
        createTask,
        updateTask,
        deleteTask,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
