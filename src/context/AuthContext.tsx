import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  name:string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const expiresAt = localStorage.getItem("sessionExpiresAt");

    if (storedUser && expiresAt) {
      const expiresAtMs = parseInt(expiresAt, 10);

      if (Date.now() < expiresAtMs) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id && parsedUser.email) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem("user");
            localStorage.removeItem("sessionExpiresAt");
          }
        } catch (error) {
          console.error("Error parseando usuario almacenado:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("sessionExpiresAt");
        }
      } else {
        // Sesión expirada
        localStorage.removeItem("user");
        localStorage.removeItem("sessionExpiresAt");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Sesión expira en 2 horas
    localStorage.setItem("sessionExpiresAt", (Date.now() + 2 * 60 * 60 * 1000).toString());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpiresAt");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
