import type { Meta, StoryObj } from "@storybook/react-vite";
import { GoogleSignInButton } from "./GoogleSignInButton";

const meta: Meta<typeof GoogleSignInButton> = {
	title: "Components/GoogleSignInButton",
	component: GoogleSignInButton,
	tags: ["autodocs"],
	parameters: {
		// Canvasの中央にコンポーネントを配置します
		layout: "centered",
	},
	// このコンポーネントはpropsを受け取らないため、argTypesの設定は不要です
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ### Googleサインインボタン
 *
 * デフォルト表示です。Storybook上でこのボタンをクリックすると、
 * 実際のアプリケーションと同様に、Firebaseの認証ポップアップが起動します。
 */
export const Default: Story = {};
