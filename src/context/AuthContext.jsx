import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem("sheearns_is_logged_in") === "true";
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("sheearns_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData || { name: "Queen Becky", avatar: null });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((current) => {
      const base = current || { name: "Queen Becky", avatar: null };
      return {
        ...base,
        ...(typeof updates === "function" ? updates(base) : updates),
      };
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem("sheearns_is_logged_in", String(isLoggedIn));
      if (user) {
        localStorage.setItem("sheearns_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("sheearns_user");
      }
    } catch {
      // Ignore persistence errors (private mode/storage limits).
    }
  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
