import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
	title: "Components/Input",
	component: Input,
	tags: ["autodocs"],
	argTypes: {
		primary: { control: "boolean" },
		backgroundColor: { control: "color" },
		size: { control: "radio", options: ["small", "medium", "large"] },
		error: { control: "text" },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		id: "primary-input",
		primary: true,
		label: "Primary Input",
		value: "",
	},
};

export const Secondary: Story = {
	args: {
		id: "secondary-input",
		primary: false,
		label: "Secondary Input",
		value: "",
	},
};

export const WithError: Story = {
	args: {
		id: "error-input",
		label: "Error Input",
		value: "invalid value",
		error: "This field is required.",
	},
};

export const Large: Story = {
	args: {
		id: "large-input",
		size: "large",
		label: "Large Input",
	},
};

export const Small: Story = {
	args: {
		id: "small-input",
		size: "small",
		label: "Small Input",
	},
};
