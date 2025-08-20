import { useAuth } from '../../hooks/useAuth'; // パスを更新
import './Header.css';

export const Header = () => {
  // AuthContextから現在のユーザー情報とログアウト関数を取得
  const { currentUser, logout } = useAuth();

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
        </div>
      </div>
    </header>
  );
};
