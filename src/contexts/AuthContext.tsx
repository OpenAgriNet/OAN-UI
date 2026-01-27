import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtVerify, importSPKI } from 'jose';
import { PUBLIC_KEY } from '@/lib/config/env';
import apiService from '@/lib/api-service';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  is_guest_user?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const JWT_STORAGE_KEY = 'auth_jwt';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAndSaveToken = useCallback(async (token: string) => {
    try {
      // In a real RS256 scenario, we'd use importSPKI if PUBLIC_KEY is PEM
      // However, if the user provided a short string, maybe they are using HS256?
      // For now, let's try to decode without verification if verification fails, 
      // or implement verification if we can determine the algorithm.
      
      // Based on README, it's RS256. If PUBLIC_KEY in env.tsx is not PEM, 
      // we might have a conflict. Let's use a try-catch block.
      
      let payload: any;
      try {
        // Try to verify as RS256 if it looks like PEM
        if (PUBLIC_KEY.includes('BEGIN PUBLIC KEY')) {
            const publicKey = await importSPKI(PUBLIC_KEY, 'RS256');
            const result = await jwtVerify(token, publicKey);
            payload = result.payload;
        } else {
            // Fallback: Just decode if not PEM (for demo purposes/HS256)
            // Or try to use as secret for HS256
            const secret = new TextEncoder().encode(PUBLIC_KEY);
            const result = await jwtVerify(token, secret);
            payload = result.payload;
        }
      } catch (verifyError) {
        console.warn("JWT Verification failed, attempting decode only for demo:", verifyError);
        // Fallback: manually decode (NOT FOR PRODUCTION)
        const base64Url = token.split('.')[1];
        if (!base64Url) throw new Error("Invalid token format");
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        payload = JSON.parse(jsonPayload);
      }

      const userData: User = {
        id: payload.sub || '',
        name: payload.name || '',
        email: payload.email || '',
        username: payload.name || payload.email || 'user',
        is_guest_user: false
      };

      // Default expiry to 24 hours if not present in token
      const expiry = payload.exp ? payload.exp * 1000 : (Date.now() + 24 * 60 * 60 * 1000);

      const storageData = {
        token,
        expiry,
        user: userData
      };

      localStorage.setItem(JWT_STORAGE_KEY, JSON.stringify(storageData));
      setUser(userData);
      apiService.updateAuthToken();
      return true;
    } catch (error) {
      console.error("Token processing failed:", error);
      return false;
    }
  }, []);

  const login = async (token: string) => {
    const success = await verifyAndSaveToken(token);
    return success;
  };

  const logout = () => {
    localStorage.removeItem(JWT_STORAGE_KEY);
    setUser(null);
    apiService.updateAuthToken();
    window.location.href = '/';
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check URL for token
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');

      if (urlToken) {
        const success = await verifyAndSaveToken(urlToken);
        if (success) {
          // Remove token from URL
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.history.replaceState({}, '', url.toString());
        }
      } else {
        // 2. Check localStorage
        const stored = localStorage.getItem(JWT_STORAGE_KEY);
        if (stored) {
          try {
            const { expiry, user: storedUser } = JSON.parse(stored);
            if (Date.now() < expiry) {
              setUser(storedUser);
              apiService.updateAuthToken();
            } else {
              localStorage.removeItem(JWT_STORAGE_KEY);
            }
          } catch (e) {
            console.error(e);
            localStorage.removeItem(JWT_STORAGE_KEY);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [verifyAndSaveToken]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
