import React, { useState } from 'react';

import { Input } from '../Input/Input.jsx';
import { Checkbox } from '../Checkbox/Checkbox.jsx';
import { Button } from '../Button/Button.jsx';
import './inputform.css';

export const Inputform = () => {
  // --- 状態管理(State)の定義 ---

  // 1. 排水流量計
  const [drainageFlow, setDrainageFlow] = useState('');
  const [drainageFlowError, setDrainageFlowError] = useState('');

  // 2. 濁度計
  const [turbidity, setTurbidity] = useState('');
  const [turbidityError, setTurbidityError] = useState('');

  // 3. 計器盤のチェック状態 (初期値: false = チェックなし)
  const [isPanelOk, setIsPanelOk] = useState(false); 

  // 4. エラー詳細
  const [errorDetails, setErrorDetails] = useState('');
  const [errorDetailsError, setErrorDetailsError] = useState('');

  // 5. 確認ボタン表示用
  const [showConfirmationButton, setShowConfirmationButton] = useState(false);


  // --- バリデーションを実行する関数 ---
  const validateForm = () => {
    let isValid = true;

    // 排水流量計のバリデーション
    const dfValue = Number(drainageFlow);
    if (drainageFlow === '') {
      setDrainageFlowError('入力は必須です。');
      isValid = false;
    } else if (isNaN(dfValue)) {
      setDrainageFlowError('数値を入力してください。');
      isValid = false;
    } else if (dfValue < 0 || dfValue > 1000) {
      setDrainageFlowError('0から1000の範囲で入力してください。');
      isValid = false;
    } else {
      setDrainageFlowError('');
    }

    // 濁度のバリデーション
    const tValue = Number(turbidity);
    if (turbidity === '') {
      setTurbidityError('入力は必須です。');
      isValid = false;
    } else if (isNaN(tValue)) {
      setTurbidityError('数値を入力してください。');
      isValid = false;
    } else if (tValue < 0 || tValue > 0.1) {
      setTurbidityError('0から0.1の範囲で入力してください。');
      isValid = false;
    } else {
      setTurbidityError('');
    }
    
    // 計器盤のバリデーション
    if (!isPanelOk && errorDetails === '') {
      setErrorDetailsError('エラーがあった場合は、その詳細を入力してください。');
      isValid = false;
    } else {
      setErrorDetailsError('');
    }
    
    return isValid;
  };

  // --- イベントハンドラ ---

  // 「次へ」ボタンがクリックされたときの処理
  const handleNextClick = () => {
    const isValid = validateForm();
    if (isValid) {
      // バリデーション成功時
      alert('入力内容が正常です。次のステップに進みます。');
      setShowConfirmationButton(false);
    } else {
      // バリデーション失敗時
      console.log('入力内容にエラーがあります。');
      setShowConfirmationButton(true);
    }
  };

  // 確認ボタンが押されたときの処理
  const handleConfirmAndProceed = () => {
  // window.confirmで確認ダイアログを表示
  const isConfirmed = window.confirm('エラーが残っていますが、本当に次に進みますか？');

  // ユーザーが「OK」を押した場合(isConfirmedがtrue)のみ、処理を続行
  if (isConfirmed) {
    console.log('Proceeding with form data despite errors...');
    // ここでエラーがある状態でもデータを送信するなどの処理を実行する
    
    // 処理が完了したらボタンを非表示に
    setShowConfirmationButton(false); 
  } else {
    // ユーザーが「キャンセル」を押した場合は何もしない
    console.log('Proceed was cancelled by the user.');
  }
};

  // チェックボックスの状態が変更されたときの処理
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsPanelOk(isChecked);
    
    if (isChecked) {
      setErrorDetails('');
      setErrorDetailsError('');
    }
  };

  // --- レンダリングされるコンポーネント ---
  return (
    <article>
      <section className="storybook-inputform">
        <h2>入力フォームの例</h2>
        <h3>浄水場（管理棟)</h3>
        
        <p>1. 排水流量計</p>
        <Input
          label="排水流量計"
          placeholder="例: 50"
          size="small"
          value={drainageFlow}
          onChange={(e) => setDrainageFlow(e.target.value)}
          error={drainageFlowError}
        />
        
        <p style={{marginTop: '24px'}}>2. 計器盤のエラーの有無の確認</p>
        <Checkbox
          label="エラーなし"
          checked={isPanelOk}
          onChange={handleCheckboxChange}
        />
        
        {/* isPanelOkがfalse（エラーあり）の場合にこのブロックが表示される */}
        {!isPanelOk && (
          <div className="error-details-wrapper" style={{ marginLeft: '20px', marginTop: '12px' }}>
            <p style={{ margin: '0 0 4px 0' }}>エラーの詳細を入力してください:</p>
            <Input
              label="エラー詳細"
              value={errorDetails}
              onChange={(e) => setErrorDetails(e.target.value)}
              error={errorDetailsError}
              placeholder="例: E-01が点滅"
              size="small"
            />
          </div>
        )}
        
        <p style={{marginTop: '24px'}}>3.浄水色濁計の確認(濁度)</p>
        <Input
          label="濁度"
          placeholder="例: 0.05"
          size="small"
          value={turbidity}
          onChange={(e) => setTurbidity(e.target.value)}
          error={turbidityError}
        />
        
        <p style={{marginTop: '32px'}}>
          <Button
            primary
            size="small"
            label="次へ"
            onClick={handleNextClick}
          />
          
          {/* 確認ボタンを条件付きで表示 */}
          {showConfirmationButton && (
            <Button
              style={{ marginLeft: '12px' }}
              size="small"
              primary={false} 
              backgroundColor="#fce4e4" 
              label="本当にこれで次に進みますか？"
              onClick={handleConfirmAndProceed}
            />
          )}
        </p>
      </section>
    </article>
  );
};