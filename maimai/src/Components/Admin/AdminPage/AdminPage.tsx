import { useState } from 'react';
import { LocationAdmin } from '../LocationAdmin/LocationAdmin';
import { UserAdmin } from '../UserAdmin/UserAdmin'; // UserAdminをインポート
import { useAuth } from '../../../hooks/useAuth';
import './AdminPage.css';

// 表示するページの種類を更新
type AdminPageType = 'form-management' | 'user-management' | 'data-entry';

// データ入力フォームの仮コンポーネント
const DataEntryForm = () => (
  <div className="page-placeholder">
    <h2>データ入力フォーム</h2>
    <p>ここに、管理者が作成した構造に基づいた入力フォームが表示されます。</p>
  </div>
);

export const AdminPage = () => {
  // 初期ページを'form-management'に設定
  const [activePage, setActivePage] = useState<AdminPageType>('form-management');
  const { logout } = useAuth();

  const renderActivePage = () => {
    switch (activePage) {
      case 'form-management':
        return <LocationAdmin />;
      case 'user-management': // 新しいケースを追加
        return <UserAdmin />;
      case 'data-entry':
        return <DataEntryForm />;
      default:
        return <LocationAdmin />;
    }
  };

  return (
    <div className="admin-page-layout">
      <nav className="admin-menu">
        <button
          onClick={() => setActivePage('form-management')}
          className={activePage === 'form-management' ? 'active' : ''}
        >
          フォーム管理
        </button>
        {/* ↓↓↓ このボタンが追加されています ↓↓↓ */}
        <button
          onClick={() => setActivePage('user-management')}
          className={activePage === 'user-management' ? 'active' : ''}
        >
          ユーザー管理
        </button>
        <button
          onClick={() => setActivePage('data-entry')}
          className={activePage === 'data-entry' ? 'active' : ''}
        >
          データ入力
        </button>
        <div className="admin-menu-spacer" />
        <button onClick={logout} className="logout-button-menu">
          ログアウト
        </button>
      </nav>
      <div className="admin-content">
        {renderActivePage()}
      </div>
    </div>
  );
};
