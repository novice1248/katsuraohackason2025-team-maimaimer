import { GoogleSignInButton } from "./Components/GoogleSignInButton/GoogleSignInButton"; // Googleサインインボタンをインポート
import { SignUp } from "./Components/SignUp/SignUp";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>承認制ログインアプリ</h1>
			</header>
			<main>
				{/* メール/パスワードでのサインアップ */}
				<SignUp />

				<div style={{ textAlign: "center", margin: "20px 0", color: "#888" }}>
					または
				</div>
				{/* Googleでのサインイン */}
				<div style={{ display: "flex", justifyContent: "center" }}>
					<GoogleSignInButton />
				</div>
			</main>
		</div>
	);
}

export default App;
