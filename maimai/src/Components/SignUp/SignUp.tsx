import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type React from "react"; // useIdをインポート
import { useId, useState } from "react";
import { auth } from "../../firebaseConfig";

export const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	// ユニークなIDを生成
	const emailId = useId();
	const passwordId = useId();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			console.log("ユーザー登録成功:", userCredential.user);
			alert(`ようこそ、${userCredential.user.email}さん！`);
		} catch (err) {
			console.error("ユーザー登録エラー:", err);
			if (err instanceof FirebaseError) {
				switch (err.code) {
					case "auth/email-already-in-use":
						setError("このメールアドレスは既に使用されています。");
						break;
					case "auth/weak-password":
						setError("パスワードは6文字以上で入力してください。");
						break;
					case "auth/invalid-email":
						setError("有効なメールアドレスを入力してください。");
						break;
					default:
						setError("ユーザー登録に失敗しました。もう一度お試しください。");
						break;
				}
			} else {
				setError("予期せぬエラーが発生しました。");
			}
		}
	};

	return (
		<div
			style={{
				maxWidth: "400px",
				padding: "20px",
				border: "1px solid var(--input-border-color, #ccc)",
				borderRadius: "8px",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", /* Add a subtle shadow */
				backgroundColor: "var(--card-background-color, #fff)", /* White background for the card */
				color: "var(--text-color, #333)", /* Darker text color */
			}}
		>
			<h2>ユーザー登録</h2>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "15px" }}>
					<label htmlFor={emailId}>メールアドレス</label>
					<input
						id={emailId}
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{ width: "100%", padding: "8px", boxSizing: "border-box", backgroundColor: "var(--input-background-color, #fff)", color: "var(--input-text-color, #333)", border: "1px solid var(--input-border-color, #ccc)" }}
					/>
				</div>
				<div style={{ marginBottom: "15px" }}>
					<label htmlFor={passwordId}>パスワード</label>
					<input
						id={passwordId}
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{ width: "100%", padding: "8px", boxSizing: "border-box", backgroundColor: "var(--input-background-color, #fff)", color: "var(--input-text-color, #333)", border: "1px solid var(--input-border-color, #ccc)" }}
					/>
				</div>
				{error && <p style={{ color: "red" }}>{error}</p>}
				<button
					type="submit"
					style={{
						width: "100%",
						padding: "10px",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					登録する
				</button>
			</form>
		</div>
	);
};
