import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'head_teacher' | 'teacher' | 'helper' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subject?: string;
  avatar?: string;
  approved: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
  isHeadTeacher: boolean;
  isTeacher: boolean;
  isHelper: boolean;
  isAuthority: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Dr. Principal Rahman',
    email: 'head@school.edu',
    password: 'head123',
    role: 'head_teacher',
    subject: 'Administration',
    approved: true,
  },
  {
    id: '2',
    name: 'Mr. Karim Ahmed',
    email: 'karim@school.edu',
    password: 'teacher123',
    role: 'teacher',
    subject: 'Mathematics',
    approved: true,
  },
  {
    id: '3',
    name: 'Ms. Fatima Noor',
    email: 'fatima@school.edu',
    password: 'teacher123',
    role: 'teacher',
    subject: 'English',
    approved: true,
  },
  {
    id: '4',
    name: 'Mr. Rahim Helper',
    email: 'helper@school.edu',
    password: 'helper123',
    role: 'helper',
    subject: 'Office Staff',
    approved: true,
  },
];

function getUsers(): (User & { password: string })[] {
  const stored = localStorage.getItem('school_users');
  if (stored) {
    const parsed = JSON.parse(stored);
    // merge defaults if not present
    const ids = parsed.map((u: User) => u.id);
    const missing = DEFAULT_USERS.filter(u => !ids.includes(u.id));
    return [...parsed, ...missing];
  }
  localStorage.setItem('school_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('school_current_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    // ensure default users exist
    getUsers();
  }, []);

  function login(email: string, password: string): { success: boolean; message: string } {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password.' };
    if (!found.approved) return { success: false, message: 'Your account is pending approval.' };
    const { password: _, ...userWithoutPass } = found;
    setUser(userWithoutPass);
    localStorage.setItem('school_current_user', JSON.stringify(userWithoutPass));
    return { success: true, message: 'Login successful.' };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('school_current_user');
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isHeadTeacher: user?.role === 'head_teacher',
      isTeacher: user?.role === 'teacher' || user?.role === 'head_teacher',
      isHelper: user?.role === 'helper',
      isAuthority: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getAllUsers(): (User & { password: string })[] {
  return getUsers();
}

export function addUser(user: User & { password: string }) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('school_users', JSON.stringify(users));
}

export function updateUser(id: string, updates: Partial<User & { password: string }>) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem('school_users', JSON.stringify(users));
  }
}

export function deleteUserById(id: string) {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem('school_users', JSON.stringify(users));
}
