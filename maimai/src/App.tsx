import { useState, useEffect } from 'react';
import { Header } from './Components/Header/Header';
import { type Page } from './Components/Menu/Menu';
import { ProfilePage } from './Components/Profile/ProfilePage';
import { LocationAdmin } from './Components/LocationAdmin/LocationAdmin';
import { useAuth } from './hooks/useAuth';

// ページコンポーネントをインポート
import { Dashboard } from './pages/DashBoard';
import { DataEntryForm } from './pages/DataEntryForm';
import { AuthPage } from './pages/AuthPage';

function App() {
  const { currentUser, isAdmin, loading } = useAuth();
  const [activePage, setActivePage] = useState<Page | 'dashboard'>('dashboard');

  useEffect(() => {
    if (currentUser) {
      setActivePage('dashboard');
    }
  }, [currentUser]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  const renderLoggedInContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} isAdmin={isAdmin} />;
      case 'profile':
        return <ProfilePage />;
      case 'form-management':
        return isAdmin ? <LocationAdmin /> : <p>アクセス権限がありません。</p>;
      case 'data-entry':
        return <DataEntryForm />;
      default:
        return <Dashboard setActivePage={setActivePage} isAdmin={isAdmin} />;
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        {currentUser ? (
          <div className="page-content" style={{ padding: '20px' }}>
            {/* メニュー以外のページで「戻る」ボタンを表示 */}
            {activePage !== 'dashboard' && (
              <button
                onClick={() => setActivePage('dashboard')}
                style={{
                  display: 'block',
                  marginBottom: '20px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  fontWeight: 'bold'
                }}
              >
                ← メニューに戻る
              </button>
            )}
            {renderLoggedInContent()}
          </div>
        ) : (
          <AuthPage />
        )}
      </main>
    </div>
  );
}

export default App;
