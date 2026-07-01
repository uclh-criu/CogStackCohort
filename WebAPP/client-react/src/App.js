import { useEffect, useRef, useState } from 'react';
import { mountCohorterApp } from './alpine-runtime';
import LoginModal from './LoginModal';

function App() {
  const rootRef = useRef(null);
  const [isAuthorized, setIsAuthorized] = useState(
    sessionStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    // Listen for logouts initiated by the Alpine runtime UI layout
    const handleGlobalLogout = () => {
      setIsAuthorized(false);
    };

    window.addEventListener('auth-logout', handleGlobalLogout);
    // Only mount the Alpine app once the user is authorized and the DOM node exists
    if (!isAuthorized || !rootRef.current) return undefined;

    let dispose = () => {};
    let cancelled = false;

    mountCohorterApp(rootRef.current).then((cleanup) => {
      if (!cancelled) {
        dispose = cleanup;
      }
    }).catch((err) => {
      console.error(err);
      if (rootRef.current) {
        rootRef.current.innerHTML =
          '<div class=\"p-4 text-red-700\">Failed to load app template.</div>';
      }
    });

return () => {
      cancelled = true;
      dispose();
      window.removeEventListener('auth-logout', handleGlobalLogout);
    };
  }, [isAuthorized]); // Triggers when isAuthorized changes to true

  return (
    <>
      {/* 1. The Gatekeeper: Shown only if not authorized */}
      {!isAuthorized && (
        <LoginModal onLoginSuccess={() => setIsAuthorized(true)} />
      )}

      {/* 2. The Alpine App Container: Only renders in DOM once logged in */}
      {isAuthorized && <div ref={rootRef} />}
    </>
  );
}

export default App;
