import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebaseConfig"; // Firebase設定ファイルをインポート

const GoogleSignInButton = () => {
	const [error, setError] = useState("");

	const handleGoogleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		setError("");

		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			console.log("Googleログイン成功:", user);
			alert(`ようこそ、${user.displayName}さん！`);
		} catch (err) {
			console.error("Googleログインエラー:", err);
			setError("Googleログインに失敗しました。");
			if (err instanceof FirebaseError) {
				if (err.code === "auth/popup-closed-by-user") {
					setError("");
				}
			}
		}
	};

	return (
		<div style={{ marginTop: "20px" }}>
			<button
				type="button" // ボタンのタイプを明示
				onClick={handleGoogleSignIn}
				style={{
					padding: "10px 20px",
					backgroundColor: "#4285F4",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					gap: "10px",
				}}
			>
				<svg
					width="18"
					height="18"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 48 48"
					aria-hidden="true"
				>
					<title>Google icon</title>{" "}
					{/* アクセシビリティのためのタイトルを追加 */}
					<path
						fill="#EA4335"
						d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
					></path>
					<path
						fill="#4285F4"
						d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.09-10.36 7.09-17.65z"
					></path>
					<path
						fill="#FBBC05"
						d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
					></path>
					<path
						fill="#34A853"
						d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
					></path>
					<path fill="none" d="M0 0h48v48H0z"></path>
				</svg>
				Googleでサインイン
			</button>
			{error && <p style={{ color: "red" }}>{error}</p>}
		</div>
	);
};

export default GoogleSignInButton;
