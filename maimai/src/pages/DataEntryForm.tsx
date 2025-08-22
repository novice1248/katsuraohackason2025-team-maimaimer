import { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { type Item } from '../components/Admin/ItemAdmin/ItemAdmin';
import { useFormStructure, type Category } from '../hooks/useFormStructure';
import { FormField } from '../components/DataEntryForm/FormField/FormField';
import { ConfirmationScreen } from '../components/DataEntryForm/ConfirmationScreen/ConfirmationScreen';
import './DataEntryForm.css';

// GASに送信するデータ用の型定義
type ReportItemValue = number | boolean | string;
type ReportCategoryData = Record<string, ReportItemValue>;
type ReportPlaceData = Record<string, ReportCategoryData>;
type ReportData = Record<string, ReportPlaceData>;

export const DataEntryForm = () => {
  const { currentUser } = useAuth();
  const { formStructure, loading } = useFormStructure();
  
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [details, setDetails] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateField = (item: Item, value: string | boolean): string => {
    if (item.type === 'number') {
      const numValue = parseFloat(value as string);
      if (isNaN(numValue)) {
        if ((value as string).trim() === '') return '必須項目です。';
        return '数値を入力してください。';
      }
      if (typeof item.standardValue === 'number' && typeof item.errorThreshold === 'number') {
        const lowerBound = item.standardValue - item.errorThreshold;
        const upperBound = item.standardValue + item.errorThreshold;
        if (numValue < lowerBound || numValue > upperBound) {
          return `異常値です。(${lowerBound} ~ ${upperBound}の範囲で入力)`;
        }
      }
    }
    if (item.type === 'checkbox' && value === false && !details[item.id]?.trim()) {
      return 'エラー詳細を入力してください。';
    }
    return '';
  };

  const handleValueChange = (item: Item, value: string | boolean) => {
    setInputValues(prev => ({ ...prev, [item.id]: value }));
    if (item.type === 'checkbox' && value === true) {
      setDetails(prev => ({ ...prev, [item.id]: '' }));
      setErrors(prev => ({ ...prev, [item.id]: '' }));
    } else {
      const errorMessage = validateField(item, value);
      setErrors(prev => ({ ...prev, [item.id]: errorMessage }));
    }
  };

  const handleDetailChange = (item: Item, detailValue: string) => {
    setDetails(prev => ({...prev, [item.id]: detailValue}));
    if (detailValue.trim()) {
      setErrors(prev => ({ ...prev, [item.id]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      alert('ログインしていません。');
      return;
    }
    setIsSubmitting(true);

    const reportData: ReportData = {};
    formStructure.forEach(place => {
      reportData[place.name] = {};
      place.categories.forEach(category => {
        reportData[place.name][category.name] = {};
        category.items.forEach(item => {
          const value = inputValues[item.id];
          if (item.type === 'checkbox') {
            reportData[place.name][category.name][item.label] = value === false ? details[item.id] || 'エラー' : true;
          } else {
            reportData[place.name][category.name][item.label] = parseFloat(value as string) || 0;
          }
        });
      });
    });

    try {
      await addDoc(collection(db, 'reports'), {
        submittedAt: serverTimestamp(),
        submittedBy: {
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.email,
        },
        values: reportData,
      });
    } catch (error) {
      console.error('Firestoreへの保存に失敗しました:', error);
      alert('データベースへの保存に失敗しました。');
      setIsSubmitting(false);
      return;
    }

    const gasUrl = 'https://script.google.com/macros/s/AKfycbxWDBfbzGqxeE9jgylxyB_cg8gN_qfcGE9k1w6syinw0-tgIQW47RS2A3q1YjApYBRe/exec';
    const jsonData = {
      'タイムスタンプ': new Date().toLocaleString('ja-JP'),
      '担当者名': currentUser.displayName || currentUser.email || '不明',
      'データ': reportData
    };

    try {
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      });
      alert('データが正常に送信されました。');
      setInputValues({});
      setDetails({});
      setErrors({});
      setShowConfirmation(false);
      setSelectedCategoryId(null);
      setSelectedPlaceId(null);
    } catch (error) {
      console.error('GASへの送信エラー:', error);
      alert('スプレッドシートへの送信中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // カテゴリが完了しているかチェックする関数
  const isCategoryComplete = (category: Category) => {
    return category.items.every(item => {
      const value = inputValues[item.id];
      if (value === undefined) return false;
      if (item.type === 'checkbox' && value === false && !details[item.id]?.trim()) return false;
      if (item.type === 'number' && (value === '' || isNaN(parseFloat(value as string)))) return false;
      return true;
    });
  };

  // 全ての項目が完了しているかチェックする関数
  const isAllComplete = () => {
    if (formStructure.length === 0) return false;
    return formStructure.every(place => 
      place.categories.every(isCategoryComplete)
    );
  };

  if (loading) {
    return <div style={{padding: '20px', textAlign: 'center'}}>フォームを読み込んでいます...</div>;
  }

  const selectedPlace = formStructure.find(p => p.id === selectedPlaceId);
  const selectedCategory = selectedPlace?.categories.find(c => c.id === selectedCategoryId);

  // 確認画面の表示
  if (showConfirmation) {
    return (
      <ConfirmationScreen
        formStructure={formStructure}
        inputValues={inputValues}
        details={details}
        onBack={() => setShowConfirmation(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="data-entry-form">
      <div className="navigation-header">
        {selectedPlace && (
          <button className="back-button-nav" onClick={() => { setSelectedCategoryId(null); setSelectedPlaceId(null); }}>← 場所選択に戻る</button>
        )}
        {selectedCategory && (
          <button className="back-button-nav" onClick={() => setSelectedCategoryId(null)}>← 施設選択に戻る</button>
        )}
      </div>

      {/* 3. 項目入力画面 */}
      {selectedPlace && selectedCategory ? (
        <div className="form-section">
          <h2>{selectedPlace.name} - {selectedCategory.name}</h2>
          {selectedCategory.items.map(item => (
            <FormField
              key={item.id}
              item={item}
              value={inputValues[item.id]}
              error={errors[item.id]}
              detail={details[item.id]}
              onValueChange={handleValueChange}
              onDetailChange={handleDetailChange}
            />
          ))}
        </div>
      ) : /* 2. 施設選択画面 */
      selectedPlace ? (
        <div className="menu-section">
          <h2>{selectedPlace.name}</h2>
          <p>施設を選択してください。</p>
          <ul className="menu-list">
            {selectedPlace.categories.map(category => (
              <li key={category.id} onClick={() => setSelectedCategoryId(category.id)}>
                {category.name}
                {isCategoryComplete(category) && <span className="completion-check">✔</span>}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* 1. 場所選択画面 */
        <div className="menu-section">
          <h2>場所を選択してください</h2>
          <ul className="menu-list">
            {formStructure.map(place => (
              <li key={place.id} onClick={() => setSelectedPlaceId(place.id)}>
                {place.name}
                {place.categories.every(isCategoryComplete) && <span className="completion-check">✔</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 全て入力完了したら確認ボタンを表示 */}
      {isAllComplete() && !selectedPlaceId && (
        <div className="submit-area">
          <button onClick={() => setShowConfirmation(true)} className="submit-button">
            入力内容を確認して送信する
          </button>
        </div>
      )}
    </div>
  );
};
