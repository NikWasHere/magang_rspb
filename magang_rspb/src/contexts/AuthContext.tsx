"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Normalize image paths coming from the API so relative paths become absolute URLs
const normalizeImageUrl = (image?: string | null, baseUrl?: string) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const root = (baseUrl || "http://localhost:3001").replace(/\/$/, "");
  return image.startsWith("/") ? `${root}${image}` : `${root}/${image}`;
};

// NOTE: Auth now talks to the backend API. Backend endpoint: POST {NEXT_PUBLIC_API_URL}/login
// Expected request body: { email, password }
// Expected response: { message, user }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Fetch full user profile after token is loaded
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("currentUser");

    if (savedToken && savedUser) {
      // Fetch latest user profile from backend
      const fetchUserProfile = async () => {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          const res = await fetch(
            `${baseUrl.replace(/\/$/, "")}/users/profile/me`,
            {
              headers: { Authorization: `Bearer ${savedToken}` },
            }
          );

          if (res.ok) {
            const data = await res.json();
            const userData = data.user;
            const base = baseUrl.replace(/\/$/, "");
            const fullUser: User = {
              id: String(userData.id),
              email: userData.email,
              name: userData.name || "",
              role:
                userData.role === "admin" || userData.role === "dokter"
                  ? "admin"
                  : "user",
              image: normalizeImageUrl(userData.image, base),
            };
            setUser(fullUser);
            localStorage.setItem("currentUser", JSON.stringify(fullUser));
            setToken(savedToken);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error("fetch profile error", err);
        }
      };

      fetchUserProfile();
    } else if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    remember: boolean = false
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        setIsLoading(false);
        return false;
      }

      const data = await res.json();
      const tkn = data.token as string | undefined;

      if (tkn) {
        setToken(tkn);
        localStorage.setItem("token", tkn);

        // Fetch full profile with image
        try {
          const profileRes = await fetch(
            `${baseUrl.replace(/\/$/, "")}/users/profile/me`,
            {
              headers: { Authorization: `Bearer ${tkn}` },
            }
          );

          if (profileRes.ok) {
            const profileData = await profileRes.json();
            const userData = profileData.user;
            const base = baseUrl.replace(/\/$/, "");
            const fullUser: User = {
              id: String(userData.id),
              email: userData.email,
              name: userData.name || "",
              role:
                userData.role === "admin" || userData.role === "dokter"
                  ? "admin"
                  : "user",
              image: normalizeImageUrl(userData.image, base),
            };
            setUser(fullUser);
            localStorage.setItem("currentUser", JSON.stringify(fullUser));
            setIsLoading(false);
            return true;
          }
        } catch (err) {
          console.error("fetch profile error", err);
        }
      }

      setIsLoading(false);
      return false;
    } catch (err) {
      console.error("login error", err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  const refreshUser = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/users/profile/me`,
        {
          headers: { Authorization: `Bearer ${savedToken}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const userData = data.user;
        const base = baseUrl.replace(/\/$/, "");
        const fullUser: User = {
          id: String(userData.id),
          email: userData.email,
          name: userData.name || "",
          role:
            userData.role === "admin" || userData.role === "dokter"
              ? "admin"
              : "user",
          image: normalizeImageUrl(userData.image, base),
        };
        setUser(fullUser);
        localStorage.setItem("currentUser", JSON.stringify(fullUser));
      }
    } catch (err) {
      console.error("refresh user error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshUser, isLoading, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
