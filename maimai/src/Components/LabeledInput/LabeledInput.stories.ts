import type { Meta, StoryObj } from "@storybook/react-vite";
import { LabeledInput } from "./LabeledInput";

const meta: Meta<typeof LabeledInput> = {
	title: "Components/LabeledInput",
	component: LabeledInput,
	tags: ["autodocs"],
	argTypes: {
		title: { control: "text" },
		label: { control: "text" },
		placeholder: { control: "text" },
		error: { control: "text" },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルト状態
export const Default: Story = {
	args: {
		title: "1. 排水流量計",
		label: "排水流量計",
		placeholder: "例: 50",
		value: "",
	},
};

// エラー：数値以外が入力された場合
export const InvalidInput: Story = {
	args: {
		title: "1. 排水流量計",
		label: "排水流量計",
		placeholder: "例: 50",
		value: "abc",
		error: "数値を入力してください。",
		backgroundColor: "#f8d7da",
	},
};

// エラー：数値が基準値から外れている場合
export const OutOfRange: Story = {
	args: {
		title: "1. 排水流量計",
		label: "排水流量計",
		placeholder: "例: 50",
		value: "1500",
		error: "異常値です。0から1000の範囲で入力してください。",
		backgroundColor: "#f8d7da",
	},
};

// エラー：前日から大幅な差がある場合
export const SignificantChange: Story = {
	args: {
		title: "1. 排水流量計",
		label: "排水流量計",
		placeholder: "例: 50",
		value: "800",
		error: "前日から大幅な差があります。(前日値: 50)",
		backgroundColor: "#f8d7da",
	},
};
