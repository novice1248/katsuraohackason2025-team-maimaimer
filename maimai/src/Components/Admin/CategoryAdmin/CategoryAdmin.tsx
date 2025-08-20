import { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ItemAdmin } from '../ItemAdmin/ItemAdmin';

type Place = { id: string; name: string; };
type Category = { id: string; name: string; };

interface CategoryAdminProps {
  place: Place;
}

export const CategoryAdmin = ({ place }: CategoryAdminProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    setSelectedCategory(null); // 場所が切り替わったら選択をリセット
    const q = query(collection(db, 'places', place.id, 'categories'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    });
    return unsubscribe;
  }, [place]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;
    await addDoc(collection(db, 'places', place.id, 'categories'), { name: newCategoryName });
    setNewCategoryName('');
  };
  
  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('この施設を削除しますか？')) {
      await deleteDoc(doc(db, 'places', place.id, 'categories', id));
      setSelectedCategory(null);
    }
  };

  return (
    <>
      <div className="column">
        <div className="column-header">
          <h3>施設 ({place.name})</h3>
        </div>
        <div className="column-content">
          <ul className="item-list">
            {categories.map((category) => (
              <li
                key={category.id}
                className={`list-item ${selectedCategory?.id === category.id ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <span>{category.name}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }} className="delete-button-small">×</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddCategory} className="add-form">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="新しい施設を追加"
            />
            <button type="submit">+</button>
          </form>
        </div>
      </div>
      
      {selectedCategory && <ItemAdmin placeId={place.id} category={selectedCategory} />}
    </>
  );
};
