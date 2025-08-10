import { useEffect, useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./App.css";
import LoadingScreen from "./components/common/LoadingScreen";
import LoginScreen from "./components/auth/LoginScreen";
import Home from "./components/Home.tsx";

// App root now only handles auth gating and high-level layout
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuthStatus = async () => {
      try {
        const loggedIn = await invoke<boolean>("is_logged_in");
        if (isMounted) setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error("Failed to check auth status:", error);
        if (isMounted) setIsLoggedIn(false);
      } finally {
        if (isMounted) setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();

    const unlistenPromise = listen("logged-in", () => {
      setIsLoggedIn(true);
    });

    return () => {
      isMounted = false;
      unlistenPromise.then(f => f());
    };
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      await invoke("initiate_auth_flow");
    } catch (error) {
      console.error("Failed to initiate auth flow:", error);
    }
  }, []);

  if (isCheckingAuth) return <LoadingScreen message="Checking authentication..." />;

  return (
    <div className="app">
      {isLoggedIn ? <Home /> : <LoginScreen onLogin={handleLogin} />}
    </div>
  );
}

export default App;