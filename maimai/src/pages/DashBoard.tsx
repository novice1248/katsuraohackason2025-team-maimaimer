import type { Page } from '../components/Menu/Menu';
import './Dashboard.css';

interface DashboardProps {
  setActivePage: (page: Page) => void;
  isAdmin: boolean;
}

export const Dashboard = ({ setActivePage, isAdmin }: DashboardProps) => (
  <div className="dashboard-container">
    <h2>メニュー</h2>
    <p>操作を選択してください。</p>
    <div className="dashboard-buttons">
      <button className="dashboard-button" onClick={() => setActivePage('profile')}>
        プロフィール設定
      </button>
      {isAdmin && (
        <button className="dashboard-button" onClick={() => setActivePage('form-management')}>
          フォーム管理
        </button>
      )}
      <button className="dashboard-button" onClick={() => setActivePage('data-entry')}>
        データ入力
      </button>
    </div>
  </div>
);
