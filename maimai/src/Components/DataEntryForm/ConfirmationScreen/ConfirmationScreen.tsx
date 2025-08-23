import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { type Place } from '../../../hooks/useFormStructure';

interface ConfirmationScreenProps {
  formStructure: Place[];
  inputValues: Record<string, string | boolean>;
  details: Record<string, string>;
  warnings: Record<string, string>; // warnings を props として受け取る
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  formStructure, inputValues, details, warnings, onBack, onSubmit, isSubmitting,
}) => {
  const { currentUser } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 警告が存在するかどうかをチェック
  const hasIssues = Object.values(warnings).some(warning => !!warning);

  const handleSubmitClick = () => {
    if (hasIssues) {
      setShowConfirmDialog(true); // 警告があればダイアログを表示
    } else {
      onSubmit(); // なければそのまま送信
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    onSubmit();
  };

  return (
    <div className="confirmation-screen">
      <h2>入力内容の確認</h2>
      
      <div className="confirmation-summary" style={{ marginBottom: '1rem' }}>
        <p><strong>日時:</strong> {new Date().toLocaleString('ja-JP')}</p>
        <p><strong>担当者:</strong> {currentUser?.displayName || currentUser?.email}</p>
      </div>

      <div className="confirmation-summary">
        {formStructure.map(place => (
          <div key={place.id} className="summary-place">
            <h3>{place.name}</h3>
            {place.categories.map(category => (
              <div key={category.id} className="summary-category">
                <h4>{category.name}</h4>
                <ul>
                  {category.items.map(item => {
                    const value = inputValues[item.id];
                    const detail = details[item.id];
                    const warning = warnings[item.id];
                    const displayValue = item.type === 'checkbox'
                      ? (value ? '正常' : detail || '(詳細未入力)')
                      : (value as string) || '未入力';

                    return (
                      <li key={item.id} className="summary-item">
                        <span className="item-label">{item.label}</span>
                        <div className="item-value-container">
                          <span className="item-value">{displayValue}</span>
                          {/* 警告があれば表示 */}
                          {warning && <span className="item-warning">⚠️ {warning}</span>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="confirmation-actions">
        <button type="button" onClick={onBack} className="back-button">修正する</button>
        <button type="button" onClick={handleSubmitClick} className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : 'この内容で送信する'}
        </button>
      </div>

      {/* 確認ダイアログ */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h4>確認</h4>
            <p>入力内容に警告が含まれています。本当にこの内容で送信しますか？</p>
            <div className="dialog-actions">
              <button onClick={() => setShowConfirmDialog(false)}>キャンセル</button>
              <button onClick={handleConfirmSubmit} className="confirm-button">はい、送信します</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
