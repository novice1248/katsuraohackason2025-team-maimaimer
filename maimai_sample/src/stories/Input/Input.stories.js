import { fn } from 'storybook/test';

import { input } from './Input.jsx';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Example/input',
  component: input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal = {
  args: {
    label: 'input',
    backgroundColor: "white",
  },
};

export const Success = {
  args: {
    label: 'input',
    backgroundColor: "#D4E1EF",
  },
};

export const Error = {
  args: {
    label: 'input',
    backgroundColor: "#F8D7DA",
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'input',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: 'input',
  },
};
