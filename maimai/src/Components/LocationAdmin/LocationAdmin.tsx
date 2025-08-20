import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { CategoryAdmin } from '../Admin/CategoryAdmin/CategoryAdmin';
import './LocationAdmin.css';

type Place = { id: string; name: string; };

export const LocationAdmin = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'places'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPlaces(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    });
    return unsubscribe;
  }, []);

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaceName.trim() === '') return;
    await addDoc(collection(db, 'places'), { name: newPlaceName });
    setNewPlaceName('');
  };

  const handleDeletePlace = async (id: string) => {
    if (window.confirm('この場所を削除すると、関連する施設や項目もすべて削除されます。よろしいですか？')) {
      // 注意: サブコレクションのドキュメントは自動では削除されません。
      // 本番環境ではCloud Functionsで再帰的に削除する実装が必要です。
      await deleteDoc(doc(db, 'places', id));
      setSelectedPlace(null);
    }
  };

  return (
    <div className="form-management-layout">
      {/* --- 場所カラム --- */}
      <div className="column">
        <div className="column-header">
          <h3>場所</h3>
        </div>
        <div className="column-content">
          <ul className="item-list">
            {places.map((place) => (
              <li
                key={place.id}
                className={`list-item ${selectedPlace?.id === place.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlace(place)}
              >
                <span>{place.name}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeletePlace(place.id); }} className="delete-button-small">×</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddPlace} className="add-form">
            <input
              type="text"
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              placeholder="新しい場所を追加"
            />
            <button type="submit">+</button>
          </form>
        </div>
      </div>

      {/* --- 施設カラム --- */}
      {selectedPlace && <CategoryAdmin place={selectedPlace} />}
    </div>
  );
};
