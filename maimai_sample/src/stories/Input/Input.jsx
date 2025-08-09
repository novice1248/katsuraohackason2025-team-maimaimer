import React from 'react';
import PropTypes from 'prop-types';
import './input.css';

/**
 * 親コンポーネントから状態を制御される「制御されたコンポーネント」
 */
export const Input = ({
  primary = false,
  backgroundColor = null,
  size = 'medium',
  value,      // 親から受け取る値
  onChange,   // 親から受け取る、値が変更されたときの関数
  error,      // 親から受け取るエラーメッセージ
  ...props
}) => {
  const mode = primary ? 'storybook-input--primary' : 'storybook-input--secondary';
  
  // エラーがある場合に適用するCSSクラス
  const errorClassName = error ? 'storybook-input--error-state' : '';

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={[
          'storybook-input',
          `storybook-input--${size}`,
          mode,
          errorClassName, // エラークラスを追加
        ].join(' ')}
        style={backgroundColor && { backgroundColor }}
        {...props}
      />
      {/* 親から渡されたエラーメッセージがあれば表示 */}
      {error && <p className="storybook-input-error">{error}</p>}
    </>
  );
};

Input.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,     // valueを必須のpropsに変更
  onChange: PropTypes.func.isRequired,  // onChangeを必須のpropsに変更
  error: PropTypes.string,                // エラーメッセージは文字列
};