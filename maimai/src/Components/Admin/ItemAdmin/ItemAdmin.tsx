import { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';

// Dnd-kitからのインポート (DragEndEventを型としてインポート)
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Category = { id: string; name: string; };
export type Item = {
  id: string;
  label: string;
  type: 'number' | 'checkbox';
  standardValue?: number;
  errorThreshold?: number;
  order: number;
};

// 新規項目用の型を定義（数値入力は文字列として扱う）
type NewItemState = {
  label: string;
  type: 'number' | 'checkbox';
  standardValue: string;
  errorThreshold: string;
}

// Draggableなリストアイテムのための個別コンポーネント
const SortableItem = ({ item, onDelete }: { item: Item, onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 'auto', // ドラッグ中に他の要素の上に表示
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`list-item-detailed ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        ⠿
      </div>
      <div className="item-content">
        <div className="item-name"><strong>{item.label}</strong> ({item.type})</div>
        {item.type === 'number' && (
          <small>基準値: {item.standardValue}, 許容差: {item.errorThreshold}</small>
        )}
      </div>
      <button onClick={() => onDelete(item.id)} className="delete-button-small">×</button>
    </li>
  );
}


interface ItemAdminProps {
  placeId: string;
  category: Category;
}

export const ItemAdmin = ({ placeId, category }: ItemAdminProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<NewItemState>({
    label: '', type: 'number', standardValue: '0', errorThreshold: '0'
  });

  useEffect(() => {
    const q = query(collection(db, 'places', placeId, 'categories', category.id, 'items'), orderBy('order'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item)));
    });
    return unsubscribe;
  }, [placeId, category]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.label.trim() === '') return;
    
    const itemToAdd = {
      label: newItem.label.trim(),
      type: newItem.type,
      order: items.length,
      ...(newItem.type === 'number' && {
        standardValue: parseFloat(newItem.standardValue) || 0,
        errorThreshold: parseFloat(newItem.errorThreshold) || 0,
      }),
    };

    await addDoc(collection(db, 'places', placeId, 'categories', category.id, 'items'), itemToAdd);
    setNewItem({ label: '', type: 'number', standardValue: '0', errorThreshold: '0' });
  };
  
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('この項目を削除しますか？')) {
      await deleteDoc(doc(db, 'places', placeId, 'categories', category.id, 'items', id));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      const batch = writeBatch(db);
      newItems.forEach((item, index) => {
        const docRef = doc(db, 'places', placeId, 'categories', category.id, 'items', item.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
    }
  };

  return (
    <div className="column">
      <div className="column-header"><h3>計測項目 ({category.name})</h3></div>
      <div className="column-content">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ul className="item-list-detailed">
              {items.map((item) => (
                <SortableItem key={item.id} item={item} onDelete={handleDeleteItem} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        
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
                <input id="item-std-val" type="number" step="any" value={newItem.standardValue} onChange={e => setNewItem({...newItem, standardValue: e.target.value})} />
              </div>
              <div className="form-row">
                <label htmlFor="item-err-thresh">許容差 (±)</label>
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
