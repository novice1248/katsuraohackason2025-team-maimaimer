import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useId, useState } from "react"; // useIdをインポート
import { auth } from "../firebaseConfig";

const SignUp = () => {
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
				margin: "40px auto",
				padding: "20px",
				border: "1px solid #ccc",
				borderRadius: "8px",
			}}
		>
			<h2>ユーザー登録</h2>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "15px" }}>
					{/* 生成したIDをhtmlForに設定 */}
					<label htmlFor={emailId}>メールアドレス</label>
					<input
						id={emailId} // 生成したIDをidに設定
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
					/>
				</div>
				<div style={{ marginBottom: "15px" }}>
					{/* 生成したIDをhtmlForに設定 */}
					<label htmlFor={passwordId}>パスワード</label>
					<input
						id={passwordId} // 生成したIDをidに設定
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
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

export default SignUp;
