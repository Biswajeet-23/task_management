export interface User {
    id: string;
    email: string;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'To Do' | 'In Progress' | 'Done';
    dueDate: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    total: number;
    byStatus: {
        'To Do': number;
        'In Progress': number;
        'Done': number;
    };
    overdue: number;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export interface TaskContextType {
    tasks: Task[];
    dashboard: DashboardStats | null;
    isLoading: boolean;
    error: string | null;
    filters: TaskFilters;
    setFilters: (filters: TaskFilters) => void;
    fetchTasks: () => Promise<void>;
    fetchDashboard: () => Promise<void>;
    createTask: (task: CreateTaskDto) => Promise<void>;
    updateTask: (id: string, task: UpdateTaskDto) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    clearError: () => void;
}

export interface TaskFilters {
    status: string;
    priority: string;
    sortBy: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}