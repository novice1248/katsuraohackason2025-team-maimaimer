import { useAuth } from '../../hooks/useAuth';
import './Menu.css';

// Appコンポーネントで管理するページの種類
export type Page = 'profile' | 'form-management' | 'data-entry';

interface MenuProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export const Menu = ({ activePage, setActivePage }: MenuProps) => {
  const { isAdmin } = useAuth();

  return (
    <nav className="app-menu">
      <button
        onClick={() => setActivePage('profile')}
        className={activePage === 'profile' ? 'active' : ''}
      >
        プロフィール
      </button>
      
      {/* 管理者の場合のみ「フォーム管理」を表示 */}
      {isAdmin && (
        <button
          onClick={() => setActivePage('form-management')}
          className={activePage === 'form-management' ? 'active' : ''}
        >
          フォーム管理
        </button>
      )}

      <button
        onClick={() => setActivePage('data-entry')}
        className={activePage === 'data-entry' ? 'active' : ''}
      >
        データ入力
      </button>
    </nav>
  );
};
