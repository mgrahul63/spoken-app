import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const navLink = (to, label, icon, mobile = false) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200
        ${
          pathname === to
            ? "bg-blue-900 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }
        ${mobile ? "w-full" : ""}
      `}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#2b293e] border-b border-gray-700 shadow-sm sticky top-[52px] z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-playfair text-2xl font-bold text-white">
          SpeakUp
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLink("/", "Home", "🏠")}
          {navLink("/dashboard", "Progress", "📊")}
          {navLink("/words", "Words", "📚")}
          {navLink("/verbs", "Verbs", "📖")}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* User info */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-xs">
              <p className="font-bold text-gray-300">{user?.name}</p>
              <p className="text-gray-400">🔥 {user?.streak} day streak</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="hidden md:block text-xs border border-gray-500 px-3 py-1.5 rounded-lg text-gray-400 hover:border-red-300 hover:text-red-500 transition-all font-bold"
          >
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Mobile Slide Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-72 bg-[#2b293e] shadow-xl z-50 transform transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-white text-2xl"
        >
          ✕
        </button>

        <div className="mt-12 px-4 space-y-3">
          {navLink("/", "Home", "🏠", true)}
          {navLink("/dashboard", "Progress", "📊", true)}
          {navLink("/words", "Words", "📚", true)}
          {navLink("/verbs", "Verbs", "📖", true)}
        </div>

        {/* User info */}
        <div className="px-4 mt-6 border-t border-gray-700 pt-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-xs">
            <p className="font-bold text-gray-300">{user?.name}</p>
            <p className="text-gray-400">🔥 {user?.streak} day streak</p>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 mt-4">
          <button
            onClick={logout}
            className="w-full text-left text-xs border border-gray-500 px-3 py-2 rounded-lg text-gray-400 hover:border-red-300 hover:text-red-500 transition-all font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
