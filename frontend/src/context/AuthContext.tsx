import { createContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types/user';

interface AuthContextType {
  user: { role: UserRole; username: string } | null;
  login: (role: UserRole, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user'] | null>(() => {
    const storedRole = localStorage.getItem('role') as UserRole | null;
    const storedUsername = localStorage.getItem('username');
    return storedRole && storedUsername ? { role: storedRole, username: storedUsername } : null;
  });
  const login = async (role: UserRole, username: string, password: string) => {
    console.log('Logging in...');

    await new Promise((resolve) => setTimeout(resolve, 5000));

    setUser({ role, username });
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    console.log('Login successful!', { role, username });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export { AuthContext };
