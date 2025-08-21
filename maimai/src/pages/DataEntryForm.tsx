import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { type Item } from '../components/Admin/ItemAdmin/ItemAdmin';
import { Input } from '../components/Input/Input';
import { Checkbox } from '../components/Checkbox/Checkbox';
import './DataEntryForm.css';

// Firestoreから取得するデータの型定義
type Category = {
  id: string;
  name: string;
  items: Item[];
};

type Place = {
  id: string;
  name: string;
  categories: Category[];
};

// GASに送信するデータ用の、より具体的な型を定義
type ReportItemValue = number | boolean;
type ReportCategoryData = Record<string, ReportItemValue>;
type ReportPlaceData = Record<string, ReportCategoryData>;
type ReportData = Record<string, ReportPlaceData>;


export const DataEntryForm = () => {
  const { currentUser } = useAuth();
  const [formStructure, setFormStructure] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string | boolean>>({});

  // フォームの構造をFirestoreから読み込む
  useEffect(() => {
    const fetchFormStructure = async () => {
      setLoading(true);
      try {
        const placesQuery = query(collection(db, 'places'), orderBy('name'));
        const placesSnapshot = await getDocs(placesQuery);
        
        const structurePromises = placesSnapshot.docs.map(async (placeDoc) => {
          const placeData: Place = { id: placeDoc.id, name: placeDoc.data().name, categories: [] };

          const categoriesQuery = query(collection(db, 'places', placeDoc.id, 'categories'), orderBy('name'));
          const categoriesSnapshot = await getDocs(categoriesQuery);

          const categoryPromises = categoriesSnapshot.docs.map(async (categoryDoc) => {
            const categoryData: Category = { id: categoryDoc.id, name: categoryDoc.data().name, items: [] };

            const itemsQuery = query(collection(db, 'places', placeDoc.id, 'categories', categoryDoc.id, 'items'), orderBy('label'));
            const itemsSnapshot = await getDocs(itemsQuery);
            
            categoryData.items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as Item));
            return categoryData;
          });
          
          placeData.categories = await Promise.all(categoryPromises);
          return placeData;
        });

        const structure = await Promise.all(structurePromises);
        setFormStructure(structure);

      } catch (error) {
        console.error("フォーム構造の読み込みに失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormStructure();
  }, []);

  // 入力値が変更されたときのハンドラ
  const handleValueChange = (itemId: string, value: string | boolean) => {
    setInputValues(prev => ({ ...prev, [itemId]: value }));
  };
  
  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const gasUrl = 'https://script.google.com/macros/s/AKfycbx1QTUCO42fCZDuK7_tB_rYf_wlWsv1ocTzlDO-6T5W7-_yx6-LzukvzdQHgXUhEgDg/exec';

    // GASに送信するデータを動的に整形
    const reportData: ReportData = {};
    formStructure.forEach(place => {
      reportData[place.name] = {};
      place.categories.forEach(category => {
        reportData[place.name][category.name] = {};
        category.items.forEach(item => {
          const value = inputValues[item.id];
          reportData[place.name][category.name][item.label] = item.type === 'number' ? parseFloat(value as string) || 0 : (value as boolean) || false;
        });
      });
    });

    const jsonData = {
      'タイムスタンプ': new Date().toLocaleString('ja-JP'),
      '担当者名': currentUser?.displayName || currentUser?.email || '不明',
      'データ': reportData
    };

    try {
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });
      alert('データが正常に送信されました。');
      setInputValues({});
    } catch (error) {
      console.error('Error:', error);
      alert('データの送信中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{padding: '20px', textAlign: 'center'}}>フォームを読み込んでいます...</div>;
  }

  return (
    <form className="data-entry-form" onSubmit={handleSubmit}>
      {formStructure.map(place => (
        <div key={place.id} className="place-section">
          <h2>{place.name}</h2>
          {place.categories.map(category => (
            <div key={category.id} className="category-section">
              <h3>{category.name}</h3>
              {category.items.map(item => (
                <div key={item.id} className="form-item">
                  {item.type === 'number' ? (
                    <Input
                      id={item.id}
                      label={item.label}
                      type="number"
                      value={(inputValues[item.id] as string) || ''}
                      onChange={e => handleValueChange(item.id, e.target.value)}
                    />
                  ) : (
                    <Checkbox
                      label={item.label}
                      checked={(inputValues[item.id] as boolean) || false}
                      onChange={e => handleValueChange(item.id, e.target.checked)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      <div className="submit-area">
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : '保存する'}
        </button>
      </div>
    </form>
  );
};
