import { useAuth } from '../../../hooks/useAuth';
import { type Place } from '../../../hooks/useFormStructure';

// このコンポーネントが受け取るpropsの型を定義
interface ConfirmationScreenProps {
  formStructure: Place[];
  inputValues: Record<string, string | boolean>;
  details: Record<string, string>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * 入力内容の最終確認画面を表示するUIコンポーネント
 */
export const ConfirmationScreen = ({ formStructure, inputValues, details, onBack, onSubmit, isSubmitting }: ConfirmationScreenProps) => {
  const { currentUser } = useAuth();

  return (
    <div className="confirmation-screen">
      <h2>入力内容の確認</h2>
      <div className="confirmation-summary">
        <p><strong>日時:</strong> {new Date().toLocaleDateString('ja-JP')}</p>
        <p><strong>担当者:</strong> {currentUser?.displayName || currentUser?.email}</p>
      </div>

      {formStructure.map(place => (
        <div key={place.id} className="confirmation-place">
          <h3>{place.name}</h3>
          {place.categories.map(category => (
            <div key={category.id} className="confirmation-category">
              <h4>{category.name}</h4>
              <ul>
                {category.items.map(item => {
                  const value = inputValues[item.id];
                  let displayValue: string;
                  if (item.type === 'checkbox') {
                    displayValue = value ? '正常' : `異常あり (${details[item.id] || '詳細未入力'})`;
                  } else {
                    displayValue = (value as string) || '未入力';
                  }
                  return <li key={item.id}><strong>{item.label}:</strong> {displayValue}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      ))}

      <div className="confirmation-actions">
        <button type="button" onClick={onBack} className="back-button">修正する</button>
        <button type="button" onClick={onSubmit} className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : 'この内容で送信する'}
        </button>
      </div>
    </div>
  );
};
