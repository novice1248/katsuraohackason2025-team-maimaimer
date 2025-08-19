import type { Meta, StoryObj } from "@storybook/react-vite";
import { DynamicInputForm } from "./DynamicInputForm";

const meta: Meta<typeof DynamicInputForm> = {
	title: "Forms/DynamicInputForm",
	component: DynamicInputForm,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
