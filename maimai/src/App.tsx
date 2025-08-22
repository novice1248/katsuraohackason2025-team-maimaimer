import { Header } from './components/Header/Header';
import { useAuth } from './hooks/useAuth';

// ページコンポーネントをインポート
import { AuthPage } from './pages/AuthPage';
import { AdminMenu } from './pages/AdminMenu';
import { UserMenu } from './pages/UserMenu';

function App() {
  const { currentUser, isAdmin, loading } = useAuth();

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
      <Header />
      <main className="main-content">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;
