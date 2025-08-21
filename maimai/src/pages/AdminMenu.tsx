import { useState } from 'react';
import { ProfilePage } from '../components/Profile/ProfilePage';
import { LocationAdmin } from '../components/Admin/LocationAdmin/LocationAdmin';
import { UserAdmin } from '../components/Admin/UserAdmin/UserAdmin'; // UserAdminをインポート
import { DataEntryForm } from './DataEntryForm';
import './Dashboard.css';

// 表示するページの種類を定義
type AdminPageType = 'profile' | 'form-management' | 'user-management' | 'data-entry';

// メニューボタンを表示する部分
const AdminDashboard = ({ setActivePage }: { setActivePage: (page: AdminPageType) => void }) => (
    <div className="dashboard-container">
        <h2>管理者メニュー</h2>
        <p>操作を選択してください。</p>
        <div className="dashboard-buttons">
            <button className="dashboard-button" onClick={() => setActivePage('profile')}>プロフィール設定</button>
            <button className="dashboard-button" onClick={() => setActivePage('form-management')}>フォーム管理</button>
            {/* ユーザー管理へのボタンを追加 */}
            <button className="dashboard-button" onClick={() => setActivePage('user-management')}>ユーザー管理</button>
            <button className="dashboard-button" onClick={() => setActivePage('data-entry')}>データ入力</button>
        </div>
    </div>
);

// 管理者ページの本体
export const AdminMenu = () => {
    const [activePage, setActivePage] = useState<AdminPageType | 'dashboard'>('dashboard');

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <AdminDashboard setActivePage={setActivePage} />;
            case 'profile':
                return <ProfilePage />;
            case 'form-management':
                return <LocationAdmin />;
            case 'user-management': // UserAdminを表示するケースを追加
                return <UserAdmin />;
            case 'data-entry':
                return <DataEntryForm />;
            default:
                return <AdminDashboard setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="page-content" style={{ padding: '20px' }}>
            {activePage !== 'dashboard' && (
                <button
                    onClick={() => setActivePage('dashboard')}
                    style={{
                        display: 'block', marginBottom: '20px', cursor: 'pointer',
                        background: 'none', border: 'none', color: '#007bff', fontWeight: 'bold'
                    }}
                >
                    ← メニューに戻る
                </button>
            )}
            {renderContent()}
        </div>
    );
};
