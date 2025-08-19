import { useState } from "react";
// Buttonコンポーネントが Button/Button.tsx にあると仮定します
import { Button } from "../Button/Button";
import { LabeledInput } from "../LabeledInput/LabeledInput";
import "./DynamicInputForm.css";

// 各入力フィールドの状態を表す型
type FormField = {
	id: string;
	title: string;
	label: string;
	value: string;
	error: string;
};

/**
 * 管理者が入力項目を動的に追加・削除できるフォーム
 */
export const DynamicInputForm = () => {
	// フォームフィールドのリストをstateで管理
	const [fields, setFields] = useState<FormField[]>([
		{
			id: crypto.randomUUID(), // 初期表示用の項目
			title: "1. 排水流量計",
			label: "排水流量計",
			value: "",
			error: "",
		},
	]);

	// 入力値が変更されたときの処理
	const handleInputChange = (id: string, newValue: string) => {
		setFields(
			fields.map((field) =>
				field.id === id ? { ...field, value: newValue } : field,
			),
		);
	};

	// 新しい入力フィールドを追加する処理
	const addField = () => {
		const newField: FormField = {
			id: crypto.randomUUID(),
			title: `${fields.length + 1}. 新しい項目`,
			label: "項目名",
			value: "",
			error: "",
		};
		setFields([...fields, newField]);
	};

	// 入力フィールドを削除する処理
	const removeField = (id: string) => {
		// フィールドが1つの場合は削除しない
		if (fields.length <= 1) {
			alert("最後の項目は削除できません。");
			return;
		}
		setFields(fields.filter((field) => field.id !== id));
	};

	return (
		<div className="dynamic-form-container">
			<h2>動的入力フォーム</h2>
			{fields.map((field) => (
				<div key={field.id} className="dynamic-field-wrapper">
					<LabeledInput
						title={field.title}
						label={field.label}
						value={field.value}
						error={field.error}
						onChange={(e) => handleInputChange(field.id, e.target.value)}
					/>
					<button
						type="button"
						className="remove-button"
						onClick={() => removeField(field.id)}
						aria-label={`${field.title}を削除`}
					>
						×
					</button>
				</div>
			))}
			<div className="form-actions">
				<Button
					label="項目を追加"
					onClick={addField}
					primary={false}
					size="small"
				/>
			</div>
		</div>
	);
};
