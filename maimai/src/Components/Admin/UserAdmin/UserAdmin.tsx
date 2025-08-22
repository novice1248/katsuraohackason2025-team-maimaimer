import { useState, useEffect } from 'react';
import { functions } from '../../../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import './UserAdmin.css';

// ユーザーデータの型を定義
type User = {
  uid: string;
  email?: string;
  isAdmin: boolean;
  isApproved: boolean;
};

// Cloud Functionsを呼び出すための準備
const getAllUsersCallable = httpsCallable(functions, 'getAllUsers');
const addAdminRoleCallable = httpsCallable(functions, 'addAdminRole');
const removeAdminRoleCallable = httpsCallable(functions, 'removeAdminRole');
const toggleUserApprovalCallable = httpsCallable(functions, 'toggleUserApproval');

export const UserAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ユーザーリストを取得する関数
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAllUsersCallable();
      setUsers(result.data as User[]);
    } catch (err) {
      setError('ユーザー情報の取得に失敗しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントが最初に表示されたときにユーザーを取得
  useEffect(() => {
    fetchUsers();
  }, []);

  // 承認状態を切り替える関数
  const handleToggleApproval = async (user: User) => {
    const newStatus = !user.isApproved;
    const confirmation = window.confirm(
      `${user.email} を「${newStatus ? '承認済み' : '未認証'}」に変更しますか？`
    );
    if (!confirmation) return;

    try {
      await toggleUserApprovalCallable({ uid: user.uid, isApproved: newStatus });
      await fetchUsers(); // リストを再取得
    } catch (err) {
      alert('承認状態の変更に失敗しました。');
      console.error(err);
    }
  };

  // 管理者権限を操作する関数
  const handleAdminRole = async (user: User) => {
    const action = user.isAdmin ? removeAdminRoleCallable : addAdminRoleCallable;
    const actionText = user.isAdmin ? '削除' : '付与';

    const confirm1 = window.confirm(`${user.email} の管理者権限を${actionText}します。よろしいですか？`);
    if (!confirm1) return;

    const confirm2 = window.prompt(`この操作は危険です。確認のため、「${user.email}」と入力してください。`);
    if (confirm2 !== user.email) {
      alert('入力が一致しません。操作はキャンセルされました。');
      return;
    }

    try {
      await action({ email: user.email });
      await fetchUsers(); // リストを再取得
    } catch (err) {
      alert('管理者権限の操作に失敗しました。');
      console.error(err);
    }
  };


  if (loading) return <div>ユーザーを読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-admin-container">
      <h2>ユーザー管理</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>メールアドレス</th>
            <th>承認状態</th>
            <th>役割</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.email || '(メールアドレスなし)'}</td>
              <td>
                <span className={`status-badge ${user.isApproved ? 'approved' : 'pending'}`}>
                  {user.isApproved ? '承認済み' : '未認証'}
                </span>
              </td>
              <td>{user.isAdmin ? '管理者' : '一般ユーザー'}</td>
              <td className="action-buttons">
                <button
                  onClick={() => handleToggleApproval(user)}
                  className="approval-button"
                >
                  {user.isApproved ? '未認証に戻す' : '承認する'}
                </button>
                <button
                  onClick={() => handleAdminRole(user)}
                  className="admin-role-button"
                >
                  管理者権限
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
