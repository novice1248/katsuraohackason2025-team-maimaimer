import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignUp } from "./SignUp";

const meta: Meta<typeof SignUp> = {
	title: "Forms/SignUp",
	component: SignUp,
	tags: ["autodocs"],
	parameters: {
		// Canvasの中央にコンポーネントを配置します
		layout: "centered",
	},
	// このコンポーネントは内部で状態を管理するため、argTypesの設定は不要です
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ### ユーザー登録フォーム
 *
 * メールアドレスとパスワードを入力して新規登録を行うフォームです。
 * Storybook上で実際に入力し、バリデーションやエラー表示の挙動を確認できます。
 * （Firebaseへの実際の登録処理は行われません）
 */
export const Default: Story = {};
