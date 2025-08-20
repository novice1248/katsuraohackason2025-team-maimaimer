import { SignUp } from '../components/SignUp/SignUp';
import { Login } from '../components/Login/Login';
import { GoogleSignInButton } from '../components/GoogleSignInButton/GoogleSignInButton';

export const AuthPage = () => (
  <>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
      <SignUp />
      <Login />
    </div>
    <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>または</div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <GoogleSignInButton />
    </div>
  </>
);
