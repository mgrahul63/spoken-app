import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, registerUser } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("speakup_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await getMe();
          setUser(data?.user);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  async function login(email, password) {
    const { data } = await loginUser(email, password);
    localStorage.setItem("speakup_token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function register(name, email, password) {
    const { data } = await registerUser;
    localStorage.setItem("speakup_token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("speakup_token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
