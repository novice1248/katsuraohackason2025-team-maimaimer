import { useAuth } from '../../hooks/useAuth'; // パスを更新
import './Header.css';
import type { Dispatch, SetStateAction } from 'react'; // DispatchとSetStateActionを型としてインポート

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
}

export const Header = ({ theme, setTheme }: HeaderProps) => {
  // AuthContextから現在のユーザー情報とログアウト関数を取得
  const { currentUser, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <h1>点検記録アプリ</h1>
        </div>
        <div className="header-nav">
          {/* currentUserが存在する場合（ログインしている場合） */}
          {currentUser && (
            <div className="user-info">
              <span>{currentUser.displayName || currentUser.email}</span>
              <button onClick={logout} className="logout-button">
                ログアウト
              </button>
            </div>
          )}
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? 'ダークモード' : 'ライトモード'}
          </button>
        </div>
      </div>
    </header>
  );
};
