import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
	title: "Components/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	argTypes: {
		primary: { control: "boolean" },
		size: { control: "radio", options: ["small", "medium", "large"] },
		checked: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		primary: true,
		label: "Primary Checkbox",
		checked: false,
	},
};

export const Secondary: Story = {
	args: {
		primary: false,
		label: "Secondary Checkbox",
		checked: false,
	},
};

export const Checked: Story = {
	args: {
		label: "Checked State",
		checked: true,
	},
};

export const Large: Story = {
	args: {
		size: "large",
		label: "Large Checkbox",
		checked: false,
	},
};
