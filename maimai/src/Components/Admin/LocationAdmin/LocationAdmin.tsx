import { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig'; // Adjusted import path to match the context
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';
import { CategoryAdmin } from '../CategoryAdmin/CategoryAdmin';
import './LocationAdmin.css';

// Dnd-kitからのインポート
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Place = { id: string; name: string; order: number; };

// Draggableなリストアイテム
const SortablePlace = ({ place, selected, onClick, onDelete }: { place: Place, selected: boolean, onClick: () => void, onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: place.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 1 : 'auto' };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`list-item ${selected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
    >
      <div className="drag-handle" {...attributes} {...listeners}>⠿</div>
      <span className="item-content">{place.name}</span>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="delete-button-small">×</button>
    </li>
  );
};

export const LocationAdmin = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'places'), orderBy('order'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPlaces(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Place)));
    });
    return unsubscribe;
  }, []);

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaceName.trim() === '') return;
    await addDoc(collection(db, 'places'), { name: newPlaceName, order: places.length });
    setNewPlaceName('');
  };

  const handleDeletePlace = async (id: string) => {
    if (window.confirm('この場所を削除すると、関連する施設や項目もすべて削除されます。よろしいですか？')) {
      await deleteDoc(doc(db, 'places', id));
      setSelectedPlace(null);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = places.findIndex((p) => p.id === active.id);
      const newIndex = places.findIndex((p) => p.id === over.id);
      const newPlaces = arrayMove(places, oldIndex, newIndex);
      setPlaces(newPlaces);

      const batch = writeBatch(db);
      newPlaces.forEach((place, index) => {
        const docRef = doc(db, 'places', place.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
    }
  };

  return (
    <div className="form-management-layout">
      <div className="column">
        <div className="column-header"><h3>場所</h3></div>
        <div className="column-content">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={places} strategy={verticalListSortingStrategy}>
              <ul className="item-list">
                {places.map((place) => (
                  <SortablePlace
                    key={place.id}
                    place={place}
                    selected={selectedPlace?.id === place.id}
                    onClick={() => setSelectedPlace(place)}
                    onDelete={() => handleDeletePlace(place.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <form onSubmit={handleAddPlace} className="add-form">
            <input type="text" value={newPlaceName} onChange={(e) => setNewPlaceName(e.target.value)} placeholder="新しい場所を追加" />
            <button type="submit">+</button>
          </form>
        </div>
      </div>
      {selectedPlace && <CategoryAdmin place={selectedPlace} />}
    </div>
  );
};
