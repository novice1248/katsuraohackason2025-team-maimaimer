import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { type Item } from '../components/Admin/ItemAdmin/ItemAdmin';
import { useFormStructure, type Category } from '../hooks/useFormStructure';
import { FormField } from '../components/DataEntryForm/FormField/FormField';
import { ConfirmationScreen } from '../components/DataEntryForm/ConfirmationScreen/ConfirmationScreen';
import './DataEntryForm.css';

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
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [details, setDetails] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false); // 完了状態を管理するstate

  const handleResetForm = () => {
    setInputValues({});
    setDetails({});
    setErrors({});
    setWarnings({});
    setShowConfirmation(false);
    setSelectedCategoryId(null);
    setSelectedPlaceId(null);
    setSubmissionComplete(false); // 完了状態をリセット
  };

  useEffect(() => {
    if (loading || formStructure.length === 0 || Object.keys(inputValues).length > 0) return;
    const initialValues: Record<string, string | boolean> = {};
    const initialErrors: Record<string, string> = {};
    const initialWarnings: Record<string, string> = {};
    formStructure.forEach(place => {
      place.categories.forEach(category => {
        category.items.forEach(item => {
          initialValues[item.id] = item.type === 'checkbox' ? false : '';
          let newError = '';
          const value = initialValues[item.id];
          if (item.type === 'number' && (value as string).trim() === '') {
            newError = '必須項目です。';
          } else if (item.type === 'checkbox' && value === false) {
            newError = 'エラー詳細を入力してください。';
          }
          initialErrors[item.id] = newError;
          initialWarnings[item.id] = '';
        });
      });
    });
    setInputValues(initialValues);
    setErrors(initialErrors);
    setWarnings(initialWarnings);
  }, [loading, formStructure, inputValues]);

  const handleValidation = useCallback((item: Item, value: string | boolean, detailValue?: string) => {
    let newError = '';
    let newWarning = '';
    if (item.type === 'number') {
      const strValue = (value as string).trim();
      if (strValue === '') {
        newError = '必須項目です。';
      } else {
        const numValue = parseFloat(strValue);
        if (isNaN(numValue)) {
          newError = '数値を入力してください。';
        } else if (typeof item.standardValue === 'number' && typeof item.errorThreshold === 'number') {
          const lowerBound = item.standardValue - item.errorThreshold;
          const upperBound = item.standardValue + item.errorThreshold;
          if (numValue < lowerBound || numValue > upperBound) {
            newWarning = `異常値です。(${lowerBound} ~ ${upperBound}の範囲)`;
          }
        }
      }
    } else if (item.type === 'checkbox') {
      const currentDetail = detailValue !== undefined ? detailValue : details[item.id];
      if (value === false) {
        if (!currentDetail?.trim()) {
          newError = 'エラー詳細を入力してください。';
        } else {
          newWarning = '異常が記録されています。';
        }
      }
    }
    setErrors(prev => ({ ...prev, [item.id]: newError }));
    setWarnings(prev => ({ ...prev, [item.id]: newWarning }));
  }, [details]);

  const handleValueChange = (item: Item, value: string | boolean) => {
    setInputValues(prev => ({ ...prev, [item.id]: value }));
    handleValidation(item, value);
  };

  const handleDetailChange = (item: Item, detailValue: string) => {
    setDetails(prev => ({...prev, [item.id]: detailValue}));
    const currentValue = inputValues[item.id];
    if (item.type === 'checkbox' && currentValue === false) {
      handleValidation(item, currentValue, detailValue);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) { alert('ログインしていません。'); return; }
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
        submittedBy: { uid: currentUser.uid, name: currentUser.displayName || currentUser.email },
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
      await fetch(gasUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonData) });
      alert('データが正常に送信されました。');
      setSubmissionComplete(true); // 完了状態をtrueに設定
    } catch (error) {
      console.error('GASへの送信エラー:', error);
      alert('スプレッドシートへの送信中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isCategoryComplete = (category: Category) => category.items.every(item => inputValues[item.id] !== undefined && !errors[item.id]);
  const doesCategoryHaveWarnings = (category: Category) => category.items.some(item => !!warnings[item.id]);
  const isAllComplete = () => formStructure.length > 0 && formStructure.every(place => place.categories.every(isCategoryComplete));

  if (loading) return <div style={{padding: '20px', textAlign: 'center'}}>フォームを読み込んでいます...</div>;
  const selectedPlace = formStructure.find(p => p.id === selectedPlaceId);
  const selectedCategory = selectedPlace?.categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="data-entry-form">
      {submissionComplete ? (
        <div className="completion-screen">
          <h2>本日の入力は行われました</h2>
          <p>もし、入力をし直す場合、このボタンを押してください</p>
          <button onClick={handleResetForm} className="submit-button">
            再入力する
          </button>
        </div>
      ) : showConfirmation ? (
        <ConfirmationScreen
          formStructure={formStructure}
          inputValues={inputValues}
          details={details}
          warnings={warnings}
          onBack={() => setShowConfirmation(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <>
          <div className="navigation-header">
            {selectedPlace && <button className="back-button-nav" onClick={() => { setSelectedCategoryId(null); setSelectedPlaceId(null); }}>← 場所選択に戻る</button>}
            {selectedCategory && <button className="back-button-nav" onClick={() => setSelectedCategoryId(null)}>← 施設選択に戻る</button>}
          </div>

          {selectedPlace && selectedCategory ? (
            <div className="form-section">
              <h2>{selectedPlace.name} - {selectedCategory.name}</h2>
              {selectedCategory.items.map(item => (
                <FormField
                  key={item.id}
                  item={item}
                  value={inputValues[item.id]}
                  error={errors[item.id]}
                  warning={warnings[item.id]}
                  detail={details[item.id]}
                  onValueChange={handleValueChange}
                  onDetailChange={handleDetailChange}
                />
              ))}
            </div>
          ) : selectedPlace ? (
            <div className="menu-section">
              <h2>{selectedPlace.name}</h2>
              <p>施設を選択してください。</p>
              <ul className="menu-list">
                {selectedPlace.categories.map(category => (
                  <li key={category.id} onClick={() => setSelectedCategoryId(category.id)}>
                    {category.name}
                    {isCategoryComplete(category) && (
                      doesCategoryHaveWarnings(category) ? <span className="completion-warning">⚠️</span> : <span className="completion-check">✔</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="menu-section">
              <h2>場所を選択してください</h2>
              <ul className="menu-list">
                {formStructure.map(place => {
                  const isPlaceComplete = place.categories.every(isCategoryComplete);
                  const doesPlaceHaveWarnings = place.categories.some(doesCategoryHaveWarnings);
                  return (
                    <li key={place.id} onClick={() => setSelectedPlaceId(place.id)}>
                      {place.name}
                      {isPlaceComplete && (
                        doesPlaceHaveWarnings ? <span className="completion-warning">⚠️</span> : <span className="completion-check">✔</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {isAllComplete() && !selectedPlaceId && (
            <div className="submit-area">
              <button onClick={() => setShowConfirmation(true)} className="submit-button">
                入力内容を確認して送信する
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
