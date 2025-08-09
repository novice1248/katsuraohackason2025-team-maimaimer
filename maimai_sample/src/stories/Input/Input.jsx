import React from "react";

import PropTypes from "prop-types";

import "./input.css";

/** Primary UI component for user interaction */
export const input = ({
  primary = false,
  backgroundColor = null,
  size = "medium",
  ...props
}) => {
  const mode = primary ? "storybook-input--primary" : "storybook-input--secondary";
  return (
      <input
        type="input"
        className={["storybook-input", `storybook-input--${size}`, mode].join(
          " "
        )}
        style={backgroundColor && { backgroundColor }}
        {...props}
      ></input>
  );
};

input.propTypes = {
  /** Is this the principal call to action on the page? */
  primary: PropTypes.bool,
  /** What background color to use */
  backgroundColor: PropTypes.string,
  /** How large should the input be? */
  size: PropTypes.oneOf(["small", "medium", "large"]),
  /** input contents */
  label: PropTypes.string.isRequired,
  /** Optional click handler */
  onClick: PropTypes.func,
};
