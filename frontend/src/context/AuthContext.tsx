import { createContext, useState, ReactNode, useEffect } from 'react';
import { UserRole } from '@/types/user';
import axios from '@/config/axiosConfig';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  role: UserRole;
  firstname: string;
  lastname: string;
  email: string;
}

interface AuthContextType {
  role: UserRole | null;
  accessToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [role, setRole] = useState<UserRole | null>(() => localStorage.getItem('role') as UserRole | null);
  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      try {
        const decoded: { userData: User } = jwtDecode(storedToken);
        return decoded.userData;
      } catch (error) {
        console.error('Invalid token:', error);
        return null;
      }
    }
    return null;
  });

  const logout = () => {
    setAccessToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  useEffect(() => {
    if (accessToken) {
      try {
        const decodedToken: { exp?: number | undefined; userData: User } = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          logout();
          return;
        }
        axios.get('/auth/exist').catch((err) => {
          if (err.response?.status === 404 || err.response?.status === 403) {
            console.warn('User no longer exists, logging out.');
            logout();
          }
        });

        localStorage.setItem('accessToken', accessToken);
        setRole(decodedToken.userData.role);
        setUser(decodedToken.userData);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      localStorage.removeItem('accessToken');
      logout();
    }
  }, [accessToken]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>('login', { email, password });
      const data = response.data.data;
      const { accessToken, userData } = data;

      setRole(userData.role);
      setAccessToken(accessToken);
      setUser(userData);

      localStorage.setItem('role', userData.role);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ role, accessToken, setAccessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    userData: User;
  };
}
