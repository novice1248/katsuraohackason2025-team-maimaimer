import { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

type Category = { id: string; name: string; };
export type Item = {
  id: string;
  label: string;
  type: 'number' | 'checkbox';
  standardValue?: number;
  errorThreshold?: number;
};

// 新規項目用の型を定義（数値入力は文字列として扱う）
type NewItemState = {
  label: string;
  type: 'number' | 'checkbox';
  standardValue: string;
  errorThreshold: string;
}

interface ItemAdminProps {
  placeId: string;
  category: Category;
}

export const ItemAdmin = ({ placeId, category }: ItemAdminProps) => {
  const [items, setItems] = useState<Item[]>([]);
  // 作成した型をuseStateに適用（初期値も文字列に）
  const [newItem, setNewItem] = useState<NewItemState>({
    label: '', type: 'number', standardValue: '0', errorThreshold: '0'
  });

  useEffect(() => {
    const q = query(collection(db, 'places', placeId, 'categories', category.id, 'items'), orderBy('label'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item)));
    });
    return unsubscribe;
  }, [placeId, category]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.label.trim() === '') return;
    
    const itemToAdd = {
      label: newItem.label,
      type: newItem.type,
      // typeが'number'の場合のみ、文字列を数値に変換して追加
      ...(newItem.type === 'number' && {
        standardValue: parseFloat(newItem.standardValue) || 0,
        errorThreshold: parseFloat(newItem.errorThreshold) || 0,
      }),
    };

    await addDoc(collection(db, 'places', placeId, 'categories', category.id, 'items'), itemToAdd);
    // フォームを初期状態にリセット
    setNewItem({ label: '', type: 'number', standardValue: '0', errorThreshold: '0' });
  };
  
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('この項目を削除しますか？')) {
      await deleteDoc(doc(db, 'places', placeId, 'categories', category.id, 'items', id));
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <h3>計測項目 ({category.name})</h3>
      </div>
      <div className="column-content">
        <ul className="item-list-detailed">
          {items.map((item) => (
            <li key={item.id} className="list-item-detailed">
              {/* このdivにクラスを追加 */}
              <div className="item-name"><strong>{item.label}</strong> ({item.type})</div>
              {item.type === 'number' && (
                <small>基準値: {item.standardValue}, 許容差: {item.errorThreshold}</small>
              )}
              <button onClick={() => handleDeleteItem(item.id)} className="delete-button-small">×</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddItem} className="add-form-detailed">
          <div className="form-row">
            <label htmlFor="item-label">項目名</label>
            <input id="item-label" value={newItem.label} onChange={e => setNewItem({...newItem, label: e.target.value})} placeholder="例: 排水流量計" required />
          </div>
          <div className="form-row">
            <label htmlFor="item-type">入力タイプ</label>
            <select id="item-type" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value as 'number' | 'checkbox'})}>
              <option value="number">数値</option>
              <option value="checkbox">チェック</option>
            </select>
          </div>
          
          {newItem.type === 'number' && (
            <>
              <div className="form-row">
                <label htmlFor="item-std-val">基準値</label>
                {/* onChangeで文字列をそのまま保存するように変更 */}
                <input id="item-std-val" type="number" step="any" value={newItem.standardValue} onChange={e => setNewItem({...newItem, standardValue: e.target.value})} />
              </div>
              <div className="form-row">
                <label htmlFor="item-err-thresh">許容差 (±)</label>
                {/* onChangeで文字列をそのまま保存するように変更 */}
                <input id="item-err-thresh" type="number" step="any" value={newItem.errorThreshold} onChange={e => setNewItem({...newItem, errorThreshold: e.target.value})} />
              </div>
            </>
          )}

          <button type="submit">項目を追加</button>
        </form>
      </div>
    </div>
  );
};
