import type React from "react";
import type { ComponentProps } from "react";
import { Input } from "../Input/Input"; // 以前作成したInputコンポーネント

// Inputコンポーネントが受け取るPropsの型を継承し、不要なものを除外
type InheritedInputProps = Omit<
	ComponentProps<typeof Input>,
	"id" | "label" | "size"
>;

// LabeledInputコンポーネント独自のPropsを定義
interface LabeledInputProps extends InheritedInputProps {
	/**
	 * フィールドのタイトル (例: "1. 排水流量計")
	 */
	title: string;
	/**
	 * Inputコンポーネントに渡すラベル
	 */
	label: string;
	/**
	 * 入力値
	 */
	value: string;
	/**
	 * エラーメッセージ（文字列があればエラースタイルが適用される）
	 */
	error?: string;
	/**
	 * プレースホルダーのテキスト
	 */
	placeholder?: string;
}

/**
 * タイトルとInputを組み合わせたフォームフィールド
 */
export const LabeledInput: React.FC<LabeledInputProps> = ({
	title,
	label,
	...otherProps
}) => {
	return (
		<div>
			<p style={{ marginTop: "24px" }}>{title}</p>
			<Input
				id={label} // 簡単のためlabelをidとして使用
				label={label}
				size="small"
				{...otherProps}
			/>
		</div>
	);
};
