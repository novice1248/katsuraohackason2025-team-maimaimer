import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react'; // ReactNodeを型としてインポート
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Contextが提供するデータの型を定義
type AuthContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>; // ログアウト関数を追加
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Contextの値をどこからでも簡単に使えるようにするためのカスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// アプリ全体に認証情報を提供するコンポーネント
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(tokenResult.claims.admin === true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ログアウト処理を行う関数
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    logout, // logout関数をvalueに追加
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
