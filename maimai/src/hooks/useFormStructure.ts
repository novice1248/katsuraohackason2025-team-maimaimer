import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy, type Unsubscribe } from 'firebase/firestore';
import { type Item } from '../components/Admin/ItemAdmin/ItemAdmin';

// --- 型定義 ---
export type Category = { id: string; name: string; items: Item[]; };
export type Place = { id: string; name: string; categories: Category[]; };

/**
 * Firestoreからフォームの構造データをリアルタイムで取得するためのカスタムフック
 */
export const useFormStructure = () => {
  const [formStructure, setFormStructure] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // placesコレクションをリアルタイムで監視
    const placesQuery = query(collection(db, 'places'), orderBy('order'));
    const unsubscribePlaces = onSnapshot(placesQuery, (placesSnapshot) => {
      
      const placesData: Place[] = placesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        categories: [], // カテゴリは後から非同期で追加
      }));

      // 各placeのサブコレクションを監視するためのunsubscribe関数を格納する配列
      const allUnsubscribes: Unsubscribe[] = [];

      placesData.forEach((place, placeIndex) => {
        const categoriesQuery = query(collection(db, 'places', place.id, 'categories'), orderBy('order'));
        const unsubscribeCategories = onSnapshot(categoriesQuery, (categoriesSnapshot) => {
          
          categoriesSnapshot.docs.forEach((categoryDoc, categoryIndex) => {
            const itemsQuery = query(collection(db, 'places', place.id, 'categories', categoryDoc.id, 'items'), orderBy('order'));
            const unsubscribeItems = onSnapshot(itemsQuery, (itemsSnapshot) => {
              
              const items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as Item));
              
              // 状態を更新
              setFormStructure(currentStructure => {
                const newStructure = [...currentStructure];
                if (newStructure[placeIndex]) {
                  if (newStructure[placeIndex].categories[categoryIndex]) {
                    newStructure[placeIndex].categories[categoryIndex].items = items;
                  } else {
                    newStructure[placeIndex].categories[categoryIndex] = { id: categoryDoc.id, name: categoryDoc.data().name, items };
                  }
                }
                return newStructure;
              });

            });
            allUnsubscribes.push(unsubscribeItems); // itemsの監視解除関数を追加
          });
          
          // カテゴリの更新を反映
          setFormStructure(currentStructure => {
            const newStructure = [...currentStructure];
            if (newStructure[placeIndex]) {
              newStructure[placeIndex].categories = categoriesSnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                // itemsはitemsのonSnapshotで更新されるので、ここでは空のまま
                items: newStructure[placeIndex]?.categories.find(c => c.id === doc.id)?.items || []
              }));
            }
            return newStructure;
          });

        });
        allUnsubscribes.push(unsubscribeCategories); // categoriesの監視解除関数を追加
      });

      setFormStructure(placesData); // まずは場所だけをセット
      setLoading(false);

      // このuseEffectがクリーンアップされるときに、すべてのサブコレクションの監視を解除する
      return () => {
        allUnsubscribes.forEach(unsub => unsub());
      };
    });

    // placesの監視を解除する
    return () => {
      unsubscribePlaces();
    };
  }, []);

  return { formStructure, loading };
};
