import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@groundtruth/shared';

const DEMO_PERSONAS: UserProfile[] = [
  {
    id: 'usr-kailash-01',
    name: 'Pochiraju Kailash',
    email: 'kailash@groundtruth.internal',
    role: 'ADMIN',
    department: 'Operations & Safety Engineering'
  },
  {
    id: 'usr-sarah-02',
    name: 'Sarah Chen',
    email: 'sarah.chen@groundtruth.internal',
    role: 'INSPECTOR',
    department: 'Site Compliance'
  },
  {
    id: 'usr-marcus-03',
    name: 'Marcus Vance',
    email: 'marcus.vance@groundtruth.internal',
    role: 'VERIFIER',
    department: 'Quality Assurance'
  },
  {
    id: 'usr-elena-04',
    name: 'Elena Rostova',
    email: 'elena.rostova@groundtruth.internal',
    role: 'MANAGER',
    department: 'Facilities Leadership'
  }
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  switchPersona: (personaId: string) => void;
  logout: () => void;
  personas: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gt_active_user');
    return saved ? JSON.parse(saved) : DEMO_PERSONAS[0];
  });

  const login = (email: string, role: UserRole = 'ADMIN') => {
    const existing = DEMO_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase());
    const profile: UserProfile = existing || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      department: 'Safety & Field Operations'
    };
    setUser(profile);
    localStorage.setItem('gt_active_user', JSON.stringify(profile));
  };

  const switchPersona = (personaId: string) => {
    const persona = DEMO_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      setUser(persona);
      localStorage.setItem('gt_active_user', JSON.stringify(persona));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gt_active_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      switchPersona,
      logout,
      personas: DEMO_PERSONAS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
