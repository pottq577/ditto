import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthState {
  userId: string | null;
  coupleId: string | null;
  login: (userId: string, coupleId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 기본 데모 계정으로 초기화 (추후 실제 인증 로직으로 대체)
  const [userId, setUserId] = useState<string | null>("1");
  const [coupleId, setCoupleId] = useState<string | null>("1");

  const login = (uid: string, cid: string) => {
    setUserId(uid);
    setCoupleId(cid);
  };

  const logout = () => {
    setUserId(null);
    setCoupleId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, coupleId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
