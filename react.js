import React, { useState } from 'react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 이 부분에서 사용자 정보를 로컬 스토리지에 저장하고, 인증 상태를 관리할 수 있습니다.
    localStorage.setItem('user', JSON.stringify({ email, password }));
    setAuthenticated(true);
  };

  const handleLogout = () => {
    // 로그아웃 시 로컬 스토리지에서 사용자 정보를 제거하고 인증 상태를 false로 설정합니다.
    localStorage.removeItem('user');
    setAuthenticated(false);
  };

  return (
    <div>
      {authenticated ? (
        <div>
          <h1>Welcome, {email}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <p onClick={handleToggle}>
            {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;
