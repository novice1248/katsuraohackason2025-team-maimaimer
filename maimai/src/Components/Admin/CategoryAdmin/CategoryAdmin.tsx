import { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig'; // Adjusted import path to match the context
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';
import { ItemAdmin } from '../ItemAdmin/ItemAdmin';

// Dnd-kitからのインポート
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Place = { id: string; name: string; order: number; };
type Category = { id: string; name: string; order: number; };

// Draggableなリストアイテム
const SortableCategory = ({ category, selected, onClick, onDelete }: { category: Category, selected: boolean, onClick: () => void, onDelete: () => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 1 : 'auto' };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`list-item ${selected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
            onClick={onClick}
        >
            <div className="drag-handle" {...attributes} {...listeners}>⠿</div>
            <span className="item-content">{category.name}</span>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="delete-button-small">×</button>
        </li>
    );
};

interface CategoryAdminProps {
  place: Place;
}

export const CategoryAdmin = ({ place }: CategoryAdminProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    setSelectedCategory(null);
    const q = query(collection(db, 'places', place.id, 'categories'), orderBy('order'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });
    return unsubscribe;
  }, [place]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;
    await addDoc(collection(db, 'places', place.id, 'categories'), { name: newCategoryName, order: categories.length });
    setNewCategoryName('');
  };
  
  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('この施設を削除しますか？')) {
      await deleteDoc(doc(db, 'places', place.id, 'categories', id));
      setSelectedCategory(null);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        const oldIndex = categories.findIndex((c) => c.id === active.id);
        const newIndex = categories.findIndex((c) => c.id === over.id);
        const newCategories = arrayMove(categories, oldIndex, newIndex);
        setCategories(newCategories);

        const batch = writeBatch(db);
        newCategories.forEach((category, index) => {
            const docRef = doc(db, 'places', place.id, 'categories', category.id);
            batch.update(docRef, { order: index });
        });
        await batch.commit();
    }
  };

  return (
    <>
      <div className="column">
        <div className="column-header"><h3>施設 ({place.name})</h3></div>
        <div className="column-content">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categories} strategy={verticalListSortingStrategy}>
              <ul className="item-list">
                {categories.map((category) => (
                  <SortableCategory
                    key={category.id}
                    category={category}
                    selected={selectedCategory?.id === category.id}
                    onClick={() => setSelectedCategory(category)}
                    onDelete={() => handleDeleteCategory(category.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <form onSubmit={handleAddCategory} className="add-form">
            <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="新しい施設を追加" />
            <button type="submit">+</button>
          </form>
        </div>
      </div>
      {selectedCategory && <ItemAdmin placeId={place.id} category={selectedCategory} />}
    </>
  );
};
