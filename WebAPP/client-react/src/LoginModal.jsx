import React, { useState, useEffect } from 'react';

export default function LoginModal({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isLoggedIn') === 'true' ;
    if (!isAuthenticated) {
      setIsVisible(true);
    } else {
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  // Handle the backend login request
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMessage(''); // Reset error feedback

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.msg === 'ok') {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('role', data.role);

        const isLoggedIn = true;
        const userRole = data.role;


        window.dispatchEvent(
          new CustomEvent('auth-success', {
            detail: { userRole: userRole , isLoggedIn : isLoggedIn}
          })
        );

        setIsVisible(false);
        onLoginSuccess();
      } else {
        // Use error message from server if available, otherwise default
        setAuthMessage(data.error || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthMessage('Unable to connect to the server. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 z-50"
      style={{
        height: '100vh',
        width: '100vw',
        padding: '16px'
      }}
    >
      <div
        className="w-full bg-deep-grey-600 shadow-md rounded-xl"
        style={{
          maxWidth: '384px',
          padding: '32px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >

        {/* Header Block */}
        <div className="flex items-center" style={{ justifyContent: 'space-between' }}>

          {/* Logo Container (50% Width) */}
          <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
            <img
              src="assets/Cogstack-Logo.svg"
              alt="Cogstack Logo"
              style={{ height: '48px', width: '100%', maxWidth: '150px' }}
            />
          </div>

          {/* Text Container (50% Width) */}
          <div style={{ width: '50%', textAlign: 'left' }}>
            <span className="text-s font-semibold text-white">Cohort v2</span>
          </div>
        </div>

        {/* Input Fields Form Block */}
        <form onSubmit={handleLogin} className="space-y-2 mt-6">
          <div>
            <label className="text-sm font-medium text-white mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your Username"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Fixed Error Container */}
          {authMessage && (
            <div
              className="text-orange-600 text-sm font-medium"
              style={{ paddingTop: '4px' }}
            >
              {authMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
            style={{ marginTop: '16px' }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}