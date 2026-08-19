import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../types/user";
import { authStorage } from "../storage/authStorage";
import { getCurrentUser } from "../api/auth";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const sharedToken = await authStorage.getToken();

        if (!sharedToken) {
          return;
        }

        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch(error) {
        await authStorage.removeToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      };

      bootstrap();
    };
  }, []);

  const login = async (accesToken: string, user: User) => {
    await authStorage.setToken(accesToken);

    setToken(accesToken);
    setUser(user);
  };

  const logout = async () => {
    await authStorage.removeToken();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: token !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("userAuth must be used within an AuthProvider");
  }

  return context;
};