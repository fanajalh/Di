import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  image: string;
  role: 'User' | 'Owner';
  phone?: string;
  address?: string;
  bio?: string;
  joinedDate?: string;
}

export interface Session {
  user: UserProfile;
  token: string;
}

interface AuthContextType {
  session: Session | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  signIn: (email?: string, password?: string, provider?: 'credentials' | 'google' | 'github') => Promise<boolean>;
  signOut: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('loading');

  // Check localStorage for existing session
  useEffect(() => {
    const storedToken = localStorage.getItem('di_token');
    const storedUser = localStorage.getItem('di_user');
    
    if (storedToken && storedUser) {
      try {
        setSession({
          user: JSON.parse(storedUser),
          token: storedToken
        });
        setStatus('authenticated');
      } catch (e) {
        setStatus('unauthenticated');
      }
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const signIn = async (
    email?: string, 
    password?: string, 
    provider: 'credentials' | 'google' | 'github' = 'credentials'
  ): Promise<boolean> => {
    setStatus('loading');
    
    if (provider !== 'credentials') {
      // For future OAuth integration
      setStatus('unauthenticated');
      return false;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      const newSession: Session = {
        user: data.user,
        token: data.token
      };

      setSession(newSession);
      localStorage.setItem('di_token', data.token);
      localStorage.setItem('di_user', JSON.stringify(data.user));
      setStatus('authenticated');
      return true;
    } catch (err) {
      console.error(err);
      setStatus('unauthenticated');
      return false;
    }
  };

  const signOut = () => {
    setStatus('loading');
    setTimeout(() => {
      setSession(null);
      localStorage.removeItem('di_token');
      localStorage.removeItem('di_user');
      setStatus('unauthenticated');
    }, 300);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!session) return;
    
    const updatedUser = {
      ...session.user,
      ...updated
    };

    setSession({
      ...session,
      user: updatedUser
    });
    
    localStorage.setItem('di_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ session, status, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return context;
}
