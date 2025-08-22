import { useState } from 'react';
import { ProfilePage } from '../components/Profile/ProfilePage';
import { DataEntryForm } from './DataEntryForm';
import './Dashboard.css'; // 管理者メニューと同じCSSを再利用

// 表示するページの種類を定義
type UserPageType = 'profile' | 'data-entry';

// メニューボタンを表示する部分
const UserDashboard = ({ setActivePage }: { setActivePage: (page: UserPageType) => void }) => (
    <div className="dashboard-container">
        <h2>メニュー</h2>
        <p>操作を選択してください。</p>
        <div className="dashboard-buttons">
            <button className="dashboard-button" onClick={() => setActivePage('profile')}>プロフィール設定</button>
            <button className="dashboard-button" onClick={() => setActivePage('data-entry')}>データ入力</button>
        </div>
    </div>
);

// 一般ユーザーページの本体
export const UserMenu = () => {
    const [activePage, setActivePage] = useState<UserPageType | 'dashboard'>('dashboard');

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <UserDashboard setActivePage={setActivePage} />;
            case 'profile':
                return <ProfilePage />;
            case 'data-entry':
                return <DataEntryForm />;
            default:
                return <UserDashboard setActivePage={setActivePage} />;
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
