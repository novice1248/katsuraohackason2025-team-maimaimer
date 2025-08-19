import "./input.css";

// コンポーネントが受け取るprops（データ）の型を定義
interface InputProps {
	/**
	 * input要素のID
	 */
	id: string;
	/**
	 * 入力欄の上に表示されるラベルのテキスト
	 */
	label: string;
	/**
	 * プライマリーかどうか
	 */
	primary?: boolean;
	/**
	 * 背景色
	 */
	backgroundColor?: string;
	/**
	 * サイズ (small, medium, large)
	 */
	size?: "small" | "medium" | "large";
	/**
	 * input要素のtype属性
	 */
	type?: "text" | "email" | "password" | "number";
	/**
	 * プレースホルダーのテキスト
	 */
	placeholder?: string;
	/**
	 * 現在の入力値
	 */
	value: string;
	/**
	 * 入力値が変更されたときに呼ばれる関数
	 */
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	/**
	 * エラーメッセージ（文字列があればエラースタイルが適用される）
	 */
	error?: string;
}

/**
 * ラベル付きの汎用的な入力フォームコンポーネント
 */
export const Input = ({
	id,
	label,
	primary = false,
	size = "medium",
	backgroundColor,
	type = "text",
	placeholder,
	value,
	onChange,
	error,
	...props
}: InputProps) => {
	const mode = primary
		? "storybook-input--primary"
		: "storybook-input--secondary";
	const errorClassName = error ? "storybook-input--error-state" : "";

	return (
		<div className="input-wrapper">
			<label htmlFor={id} className="input-label">
				{label}
			</label>
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				className={[
					"storybook-input",
					`storybook-input--${size}`,
					mode,
					errorClassName,
				].join(" ")}
				style={backgroundColor ? { backgroundColor } : {}}
				value={value}
				onChange={onChange}
				{...props}
			/>
			{error && <p className="storybook-input-error">{error}</p>}
		</div>
	);
};
