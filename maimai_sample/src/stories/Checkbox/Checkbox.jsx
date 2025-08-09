import React from 'react';
import PropTypes from 'prop-types';
import './checkbox.css';

/** Primary UI component for user interaction */
export const Checkbox = ({
  // propsとしてcheckedとonChangeを受け取る
  checked,
  onChange,
  primary = false,
  size = 'medium',
  label,
  ...props
}) => {
  // 内部のuseStateは削除

  const mode = primary ? 'storybook-checkbox--primary' : 'storybook-checkbox--secondary';

  return (
    <label className={['storybook-checkbox-wrapper', `storybook-checkbox-wrapper--${size}`].join(' ')}>
      <input
        type="checkbox"
        // propsで受け取った値と関数を使用
        checked={checked}
        onChange={onChange}
        className="storybook-checkbox"
        {...props}
      />
      <span className={['storybook-checkbox-visual', mode].join(' ')}></span>
      <span className="storybook-checkbox-label">{label}</span>
    </label>
  );
};

Checkbox.propTypes = {
  /**
   * Is the checkbox checked?
   */
  checked: PropTypes.bool,
  /**
   * Function to call when the value changes.
   */
  onChange: PropTypes.func,
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
};