import React from 'react';
import { Login } from '../Components/Login/Login';
import { SignUp } from '../Components/SignUp/SignUp';
import { GoogleSignInButton } from '../Components/GoogleSignInButton/GoogleSignInButton';

export const AuthPage = () => {
  const [showLogin, setShowLogin] = React.useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleSignInButton />
      </div>
      {showLogin ? (
        <>
        <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>または</div>
          <Login />
          <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>
            アカウントをお持ちでないですか？
            <button onClick={() => setShowLogin(false)} style={{ color: 'blue', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>
              サインアップ
            </button>
          </div>
        </>
      ) : (
        <>
        <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>または</div>
          <SignUp />
          <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>
            すでにアカウントをお持ちですか？
            <button onClick={() => setShowLogin(true)} style={{ color: 'blue', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>
              ログイン
            </button>
          </div>
        </>
      )}
    </div>
  );
};
