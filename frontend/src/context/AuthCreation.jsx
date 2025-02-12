import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load token from localStorage when the app starts
    const token = localStorage.getItem("token");
    if (token) {
      try {
        return { token, ...jwtDecode(token) }; // Decode token to get user info
      } catch (error) {
        console.error("Invalid token", error);
        return null;
      }
    }
    return null;
  });

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token, ...jwtDecode(token) });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
