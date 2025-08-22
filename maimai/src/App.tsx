import { Header } from './components/Header/Header';
import { useAuth } from './hooks/useAuth';

// ページコンポーネントをインポート
import { AuthPage } from './pages/AuthPage';
import { AdminMenu } from './pages/AdminMenu';
import { UserMenu } from './pages/UserMenu';
import { useState, useEffect } from 'react'; // useStateとuseEffectをインポート

function App() {
  const { currentUser, isAdmin, loading } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // システムのダークモード設定を初期値として取得
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as 'light' | 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  // ログイン状態に応じて表示するメインコンテンツを決定
  const renderMainContent = () => {
    if (!currentUser) {
      return <AuthPage />; // 未ログインの場合
    }
    if (isAdmin) {
      return <AdminMenu />; // 管理者の場合はAdminMenuを表示
    }
    return <UserMenu />; // 一般ユーザーの場合はUserMenuを表示
  };

  return (
    <div className="App">
      <Header theme={theme} setTheme={setTheme} /> {/* themeとsetThemeをHeaderに渡す */}
      <main className="main-content">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;
