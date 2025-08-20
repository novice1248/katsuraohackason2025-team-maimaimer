import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; // firebase.tsのパスを修正
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from 'firebase/firestore';
import './LocationAdmin.css';

// 場所のデータの型を定義
type Place = {
  id: string;
  name: string;
};

export const LocationAdmin = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [loading, setLoading] = useState(true);

  // コンポーネントが最初に表示されたときにFirestoreからデータを取得
  useEffect(() => {
    const placesCollectionRef = collection(db, 'places');
    // nameフィールドでアルファベット順に並び替え
    // --- 以下の行を修正 ---
    // 一時的にorderByをコメントアウトして、シンプルなクエリを試す
    const q = query(placesCollectionRef /*, orderBy('name') */);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const placesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setPlaces(placesData);
      setLoading(false);
    }, (error) => { // エラーハンドリングを追加
      console.error("Snapshot listener error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 「追加」ボタンが押されたときの処理
  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaceName.trim() === '') {
      alert('場所の名前を入力してください。');
      return;
    }
    try {
      await addDoc(collection(db, 'places'), {
        name: newPlaceName,
      });
      setNewPlaceName(''); // 入力欄をクリア
    } catch (error) {
      console.error("場所の追加エラー:", error);
      alert('場所の追加に失敗しました。');
    }
  };

  // 「削除」ボタンが押されたときの処理
  const handleDeletePlace = async (id: string) => {
    if (window.confirm('本当にこの場所を削除しますか？')) {
      try {
        await deleteDoc(doc(db, 'places', id));
      } catch (error) {
        console.error("場所の削除エラー:", error);
        alert('場所の削除に失敗しました。');
      }
    }
  };

  if (loading) {
    return <div>場所を読み込み中...</div>;
  }

  return (
    <div className="admin-container">
      <h2>場所の管理</h2>
      
      {/* 場所を追加するフォーム */}
      <form onSubmit={handleAddPlace} className="add-form">
        <input
          type="text"
          value={newPlaceName}
          onChange={(e) => setNewPlaceName(e.target.value)}
          placeholder="新しい場所の名前"
          className="add-input"
        />
        <button type="submit" className="add-button">追加</button>
      </form>

      {/* 場所の一覧 */}
      <ul className="item-list">
        {places.map((place) => (
          <li key={place.id} className="list-item">
            <span>{place.name}</span>
            <button 
              onClick={() => handleDeletePlace(place.id)}
              className="delete-button"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
