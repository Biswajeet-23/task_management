import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  User,
  CheckCircle2,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tasks", label: "Tasks", icon: ListTodo },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gray-50"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white p-2 rounded-xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
                  <CheckCircle2 size={20} />
                </div>
                <span
                  className={`text-xl font-bold tracking-tight transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  TaskFlow
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? isDark
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                            : "bg-blue-50 text-blue-600 border border-blue-200"
                          : isDark
                            ? "text-slate-400 hover:text-white hover:bg-white/10"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User, Theme Toggle & Logout */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all ${
                  isDark
                    ? "text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                    : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
                }`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div
                className={`hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isDark ? "bg-blue-500/20" : "bg-blue-100"
                  }`}
                >
                  <User
                    size={14}
                    className={isDark ? "text-blue-400" : "text-blue-600"}
                  />
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  {user?.email}
                </span>
              </div>

              <button
                onClick={logout}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all border border-transparent ${
                  isDark
                    ? "text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20"
                    : "text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                }`}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-xl transition-all ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t backdrop-blur-xl transition-colors ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white/80 border-gray-200"
            }`}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? isDark
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                        : isDark
                          ? "text-slate-400 hover:text-white hover:bg-white/10"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              <div
                className={`pt-2 mt-2 ${
                  isDark
                    ? "border-t border-white/10"
                    : "border-t border-gray-200"
                }`}
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 ${
                    isDark ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  <User size={16} />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className={`border-t mt-auto transition-colors ${
          isDark ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div
              className={`flex items-center gap-2 text-sm transition-colors ${
                isDark ? "text-slate-500" : "text-gray-500"
              }`}
            >
              <CheckCircle2
                size={16}
                className={isDark ? "text-blue-400" : "text-blue-600"}
              />
              <span>TaskFlow - Manage your tasks efficiently</span>
            </div>
            <div
              className={`flex items-center gap-6 text-xs transition-colors ${
                isDark ? "text-slate-600" : "text-gray-400"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Secure & Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                JWT Authentication
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
