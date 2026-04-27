import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handle() {
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isLogin && !form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success("Welcome back! 👋");
        navigate("/"); // ✅ redirect after login
      } else {
        await register(form.name.trim(), form.email, form.password);
        toast.success("Account created! Let's learn! 🎉");
        navigate("/"); // ✅ redirect after register (optional)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    padding: "14px 16px",
    borderRadius: 12,
    width: "100%",
    border: "1px solid rgba(99,102,241,.3)",
    background: "#020617",
    color: "#e2e8f0",
    fontSize: 15,
    outline: "none",
    transition: "0.2s",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl text-white font-bold mb-2">SpeakUp</h1>
          <p className="text-blue-200 text-sm">
            🗣️ Your smart English learning companion
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-extrabold text-gray-200 mb-1">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            {isLogin
              ? "Continue your learning journey"
              : "Start your English journey today"}
          </p>

          {/* Toggle */}
          <div className="flex bg-slate-900 rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setForm({ name: "", email: "", password: "" });
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : "text-slate-400"
              }`}
            >
              🔐 Sign In
            </button>

            <button
              onClick={() => {
                setIsLogin(false);
                setForm({ name: "", email: "", password: "" });
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : "text-slate-400"
              }`}
            >
              📝 Register
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            {!isLogin && (
              <input
                style={inputStyle}
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                onFocus={(e) => (e.target.style.border = "1px solid #6366f1")}
                onBlur={(e) =>
                  (e.target.style.border = "1px solid rgba(99,102,241,.3)")
                }
              />
            )}

            <input
              style={inputStyle}
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              onFocus={(e) => (e.target.style.border = "1px solid #6366f1")}
              onBlur={(e) =>
                (e.target.style.border = "1px solid rgba(99,102,241,.3)")
              }
            />

            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handle()}
              onFocus={(e) => (e.target.style.border = "1px solid #6366f1")}
              onBlur={(e) =>
                (e.target.style.border = "1px solid rgba(99,102,241,.3)")
              }
            />
          </div>

          {/* Button */}
          <button
            onClick={handle}
            disabled={loading}
            className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login →"
                : "Create Account →"}
          </button>

          {/* Footer */}
          <p className="text-xs text-gray-300 text-center mt-5">
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <span
              className="text-indigo-400 font-bold cursor-pointer hover:underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setForm({ name: "", email: "", password: "" });
              }}
            >
              {isLogin ? "Sign up free" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
