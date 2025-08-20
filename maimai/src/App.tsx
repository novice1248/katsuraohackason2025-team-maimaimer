import { SignUp } from './Components/SignUp/SignUp';
import{ Login } from './Components/Login/Login';
import { GoogleSignInButton } from './Components/GoogleSignInButton/GoogleSignInButton';
import { useAuth } from './context/AuthContext';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { LocationAdmin } from './Components/LocationAdmin/LocationAdmin';
import { Header } from './Components/Header/Header';

// ログイン後の一般ユーザー向け画面
const UserDashboard = () => {
  const { currentUser } = useAuth();
  return (
    <div>
      <h2>ようこそ、{currentUser?.displayName || currentUser?.email}さん！</h2>
      <p>これは一般ユーザー向けのページです。</p>
      <button onClick={() => signOut(auth)}>ログアウト</button>
    </div>
  );
};

// ログイン前の画面
const AuthForms = () => (
  <>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <SignUp />
      <Login />
    </div>
    <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>または</div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <GoogleSignInButton />
    </div>
  </>
);

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
