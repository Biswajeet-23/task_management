import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import {
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
        isDark
          ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gray-50"
      }`}
    >
      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-3 rounded-xl transition-all border shadow-sm ${
          isDark
            ? "bg-white/5 border-white/10 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            : "bg-white border-gray-200 text-gray-500 hover:text-orange-500 hover:bg-orange-50"
        }`}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25 mb-4">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1
            className={`text-3xl font-bold tracking-tight transition-colors ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            TaskFlow
          </h1>
          <p
            className={`mt-2 text-sm transition-colors ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Sign in to manage your tasks
          </p>
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl p-8 shadow-2xl backdrop-blur-xl border transition-colors duration-300 ${
            isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          {error && (
            <div
              className={`mb-6 flex items-start gap-3 p-4 rounded-xl border text-sm transition-colors ${
                isDark
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 transition-colors ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 transition-colors ${
                      isDark
                        ? "text-slate-500 group-focus-within:text-blue-400"
                        : "text-gray-400 group-focus-within:text-blue-600"
                    }`}
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? "bg-slate-800/50 border-white/10 text-white placeholder-slate-500 focus:ring-blue-500/50 focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 transition-colors ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 transition-colors ${
                      isDark
                        ? "text-slate-500 group-focus-within:text-blue-400"
                        : "text-gray-400 group-focus-within:text-blue-600"
                    }`}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? "bg-slate-800/50 border-white/10 text-white placeholder-slate-500 focus:ring-blue-500/50 focus:border-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${
                    isDark
                      ? "text-slate-500 hover:text-slate-300"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            className={`mt-8 text-center text-sm transition-colors ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`font-medium transition-colors ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Create one
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div
          className={`mt-8 flex items-center justify-center gap-6 text-xs transition-colors ${
            isDark ? "text-slate-500" : "text-gray-400"
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
  );
}
