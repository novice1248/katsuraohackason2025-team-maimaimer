import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; 
import { FirebaseError } from "firebase/app"; // FirebaseErrorをインポート

const SignUp = () => {
  // 入力フォームの状態を管理するためのstate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // フォームが送信されたときの処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
    setError(""); // エラーメッセージをリセット

    try {
      // Firebaseの`createUserWithEmailAndPassword`関数を呼び出してユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // 成功した場合の処理
      console.log("ユーザー登録成功:", userCredential.user);
      // ここでログイン後のページにリダイレクトするなどの処理を追加できます
      alert(`ようこそ、${userCredential.user.email}さん！`);

    } catch (err) { 
      // エラーが発生した場合の処理
      console.error("ユーザー登録エラー:", err);

      // エラーがFirebaseErrorのインスタンスであるかを確認
      if (err instanceof FirebaseError) {
        // Firebaseからのエラーコードに応じて、分かりやすいメッセージを設定
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
        // Firebase以外の予期せぬエラーの場合
        setError("予期せぬエラーが発生しました。");
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>ユーザー登録</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {/* エラーメッセージがある場合に表示 */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          登録する
        </button>
      </form>
    </div>
  );
};

export default SignUp;
