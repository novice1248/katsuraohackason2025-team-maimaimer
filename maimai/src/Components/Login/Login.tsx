import { useState, useId } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // firebase.tsのパスを修正
import { FirebaseError } from "firebase/app";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailId = useId();
  const passwordId = useId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // FirebaseのsignInWithEmailAndPassword関数でログイン処理
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("ログイン成功:", userCredential.user);
      // 成功メッセージはAuthContextが画面を切り替えるので不要なら削除してもOK
      alert(`おかえりなさい、${userCredential.user.email}さん！`);

    } catch (err) {
      console.error("ログインエラー:", err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            setError("メールアドレスまたはパスワードが間違っています。");
            break;
          case "auth/invalid-email":
            setError("有効なメールアドレスを入力してください。");
            break;
          default:
            setError("ログインに失敗しました。");
            break;
        }
      } else {
        setError("予期せぬエラーが発生しました。");
      }
    }
  };

  return (
    <div style={{
        maxWidth: '400px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', /* Add a subtle shadow */
        backgroundColor: '#fff', /* White background for the card */
        color: '#333', /* Darker text color */
    }}>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor={emailId}>メールアドレス</label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#333' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor={passwordId}>パスワード</label>
          <input
            id={passwordId}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#333' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ログインする
        </button>
      </form>
    </div>
  );
};
