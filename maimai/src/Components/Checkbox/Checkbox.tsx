import "./checkbox.css";

// コンポーネントが受け取るpropsの型を定義
interface CheckboxProps {
	/**
	 * チェックされているかどうか
	 */
	checked: boolean;
	/**
	 * 状態が変更されたときに呼ばれる関数
	 */
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	/**
	 * プライマリーかどうか
	 */
	primary?: boolean;
	/**
	 * サイズ
	 */
	size?: "small" | "medium" | "large";
	/**
	 * チェックボックスの隣に表示されるラベル
	 */
	label: string;
}

/**
 * カスタムスタイルを持つチェックボックスコンポーネント
 */
export const Checkbox = ({
	checked,
	onChange,
	primary = false,
	size = "medium",
	label,
	...props
}: CheckboxProps) => {
	const mode = primary
		? "storybook-checkbox--primary"
		: "storybook-checkbox--secondary";

	return (
		<label
			className={[
				"storybook-checkbox-wrapper",
				`storybook-checkbox-wrapper--${size}`,
			].join(" ")}
		>
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className="storybook-checkbox-input" // 実際のinputは非表示にする
				{...props}
			/>
			{/* 見た目用のチェックボックス */}
			<span className={["storybook-checkbox-visual", mode].join(" ")}></span>
			<span className="storybook-checkbox-label">{label}</span>
		</label>
	);
};
