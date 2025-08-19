import type React from "react";
import "./button.css"; // Button用のCSSファイル

// Buttonコンポーネントが受け取るpropsの型を定義
interface ButtonProps {
	/**
	 * プライマリーボタンかどうか
	 */
	primary?: boolean;
	/**
	 * 背景色
	 */
	backgroundColor?: string;
	/**
	 * ボタンのサイズ
	 */
	size?: "small" | "medium" | "large";
	/**
	 * ボタンに表示されるテキスト
	 */
	label: string;
	/**
	 * クリックされたときのイベントハンドラ
	 */
	onClick?: () => void;
	/**
	 * 外部からスタイルを適用するためのstyleオブジェクト
	 */
	style?: React.CSSProperties;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
	primary = false,
	size = "medium",
	backgroundColor,
	label,
	style, // styleプロパティを受け取る
	...props
}: ButtonProps) => {
	const mode = primary
		? "storybook-button--primary"
		: "storybook-button--secondary";
	return (
		<button
			type="button"
			className={["storybook-button", `storybook-button--${size}`, mode].join(
				" ",
			)}
			// 受け取ったstyleとbackgroundColorを適用
			style={{ ...style, ...(backgroundColor && { backgroundColor }) }}
			{...props}
		>
			{label}
		</button>
	);
};
