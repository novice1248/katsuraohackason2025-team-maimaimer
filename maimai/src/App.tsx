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

  if (loading) {
    return <div>読み込み中...</div>;
  }

  const renderContent = () => {
    if (!currentUser) {
      return <AuthForms />; // 未ログインの場合
    }
    if (isAdmin) {
      return <LocationAdmin />; // 管理者の場合
    }
    return <UserDashboard />; // 一般ユーザーの場合
  };

  return (
    <div className="App">
      {/* Headerコンポーネントをここに配置 */}
      <Header />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
