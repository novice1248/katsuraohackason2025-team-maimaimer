import { useId, useState } from "react";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Input } from "../Input/Input";
import "./inputform.css";

export const Inputform = () => {
	const [drainageFlow, setDrainageFlow] = useState("");
	const [drainageFlowError, setDrainageFlowError] = useState("");
	const [turbidity, setTurbidity] = useState("");
	const [turbidityError, setTurbidityError] = useState("");
	const [isPanelOk, setIsPanelOk] = useState(false);
	const [errorDetails, setErrorDetails] = useState("");
	const [errorDetailsError, setErrorDetailsError] = useState("");
	const [showConfirmationButton, setShowConfirmationButton] = useState(false);

	// ユニークなIDを生成
	const drainageFlowId = useId();
	const errorDetailsId = useId();
	const turbidityId = useId();

	const validateForm = () => {
		let isValid = true;
		const dfValue = Number(drainageFlow);
		if (drainageFlow === "") {
			setDrainageFlowError("入力は必須です。");
			isValid = false;
		} else if (Number.isNaN(dfValue)) {
			// isNaNをNumber.isNaNに変更
			setDrainageFlowError("数値を入力してください。");
			isValid = false;
		} else if (dfValue < 0 || dfValue > 1000) {
			setDrainageFlowError("0から1000の範囲で入力してください。");
			isValid = false;
		} else {
			setDrainageFlowError("");
		}

		const tValue = Number(turbidity);
		if (turbidity === "") {
			setTurbidityError("入力は必須です。");
			isValid = false;
		} else if (Number.isNaN(tValue)) {
			// isNaNをNumber.isNaNに変更
			setTurbidityError("数値を入力してください。");
			isValid = false;
		} else if (tValue < 0 || tValue > 0.1) {
			setTurbidityError("0から0.1の範囲で入力してください。");
			isValid = false;
		} else {
			setTurbidityError("");
		}

		if (!isPanelOk && errorDetails === "") {
			setErrorDetailsError(
				"エラーがあった場合は、その詳細を入力してください。",
			);
			isValid = false;
		} else {
			setErrorDetailsError("");
		}

		return isValid;
	};

	const handleNextClick = () => {
		const isValid = validateForm();
		if (isValid) {
			alert("入力内容が正常です。次のステップに進みます。");
			setShowConfirmationButton(false);
		} else {
			console.log("入力内容にエラーがあります。");
			setShowConfirmationButton(true);
		}
	};

	const handleConfirmAndProceed = () => {
		const isConfirmed = window.confirm(
			"エラーが残っていますが、本当に次に進みますか？",
		);
		if (isConfirmed) {
			console.log("Proceeding with form data despite errors...");
			setShowConfirmationButton(false);
		} else {
			console.log("Proceed was cancelled by the user.");
		}
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setIsPanelOk(isChecked);

		if (isChecked) {
			setErrorDetails("");
			setErrorDetailsError("");
		}
	};

	return (
		<article>
			<section className="storybook-inputform">
				<h2>入力フォームの例</h2>
				<h3>浄水場（管理棟)</h3>

				<p>1. 排水流量計</p>
				<Input
					id={drainageFlowId}
					label="排水流量計"
					placeholder="例: 50"
					size="small"
					value={drainageFlow}
					onChange={(e) => setDrainageFlow(e.target.value)}
					error={drainageFlowError}
				/>

				<p style={{ marginTop: "24px" }}>2. 計器盤のエラーの有無の確認</p>
				<Checkbox
					label="エラーなし"
					checked={isPanelOk}
					onChange={handleCheckboxChange}
				/>

				{!isPanelOk && (
					<div
						className="error-details-wrapper"
						style={{ marginLeft: "20px", marginTop: "12px" }}
					>
						<p style={{ margin: "0 0 4px 0" }}>
							エラーの詳細を入力してください:
						</p>
						<Input
							id={errorDetailsId}
							label="エラー詳細"
							value={errorDetails}
							onChange={(e) => setErrorDetails(e.target.value)}
							error={errorDetailsError}
							placeholder="例: E-01が点滅"
							size="small"
						/>
					</div>
				)}

				<p style={{ marginTop: "24px" }}>3.浄水色濁計の確認(濁度)</p>
				<Input
					id={turbidityId}
					label="濁度"
					placeholder="例: 0.05"
					size="small"
					value={turbidity}
					onChange={(e) => setTurbidity(e.target.value)}
					error={turbidityError}
				/>

				<p style={{ marginTop: "32px" }}>
					<Button primary size="small" label="次へ" onClick={handleNextClick} />

					{showConfirmationButton && (
						<Button
							style={{ marginLeft: "12px" }}
							size="small"
							primary={false}
							backgroundColor="#fce4e4"
							label="本当にこれで次に進みますか？"
							onClick={handleConfirmAndProceed}
						/>
					)}
				</p>
			</section>
		</article>
	);
};
