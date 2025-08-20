import { createContext } from 'react';
import type { User } from 'firebase/auth';

// Contextが提供するデータの型を定義
export type AuthContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
};

// Contextオブジェクトを作成してエクスポート
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
