import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // コンポーネントが表示されたとき、またはユーザー情報が更新されたときに
  // 現在の表示名を入力欄の初期値として設定します。
  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  // 「保存する」ボタンが押されたときの処理
  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;

    // 現在の名前から変更がない場合は何もしない
    if (currentUser.displayName === displayName.trim()) {
      setMessage('変更はありません。');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 1. Firebase Authenticationのプロフィールを更新
      await updateProfile(currentUser, {
        displayName: displayName.trim(),
      });

      // 2. Firestoreのユーザー情報も更新
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: displayName.trim(),
      });

      setMessage('ユーザー名を更新しました！');
    } catch (error) {
      console.error("プロフィールの更新に失敗しました:", error);
      setMessage('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
      <h2>プロフィール設定</h2>
      <form onSubmit={handleSaveProfile}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="displayName" style={{ display: 'block', marginBottom: '5px' }}>ユーザー名</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="表示名を入力"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? '保存中...' : '保存する'}
        </button>
        {message && <p style={{ marginTop: '10px', color: '#333' }}>{message}</p>}
      </form>
    </div>
  );
};
