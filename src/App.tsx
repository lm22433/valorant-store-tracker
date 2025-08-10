import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { PlayerInfoResponse, StorefrontResponse } from "./types";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const is_logged_in = await invoke("is_logged_in");
        if (is_logged_in) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    })();

    const unlisten = listen("logged-in", async () => {
      setIsLoggedIn(true);
    });

    return () => {
      unlisten.then(f => f());
    };
  }, []);

  const handleLogin = async () => {
    await invoke("initiate_auth_flow");
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <Home />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div className="login-container">
    <div className="login-card">
      <div className="logo-section">
        <h1 className="app-title">Valorant Store</h1>
        <p className="app-subtitle">Track your daily shop rotation</p>
      </div>
      <button className="login-button" onClick={onLogin}>
        <span className="login-icon">🔐</span>
        Continue with Riot Games
      </button>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [user, setUser] = useState<PlayerInfoResponse | null>(null);
  const [storeData, setStoreData] = useState<StorefrontResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userInfo, store]: [PlayerInfoResponse, StorefrontResponse] = await Promise.all([
          invoke("get_account_info_command"),
          invoke("get_store_data"),
          fetch
        ]);
        setUser(userInfo);
        setStoreData(store);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!storeData?.timeUntilReset) return;

    const updateTimer = () => {
      const remaining = storeData.timeUntilReset * 1000 - (Date.now() % (24 * 60 * 60 * 1000));
      
      if (remaining <= 0) {
        setTimeRemaining("00:00:00");
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [storeData?.timeUntilReset]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="home">
      <Header user={user} />
      <main className="main-content">
        <StoreCountdown timeRemaining={timeRemaining} />
        <StoreItems items={storeData?.items || []} />
      </main>
    </div>
  );
};

const LoadingScreen: React.FC = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <div className="loading-spinner"></div>
      <h2>Loading your store...</h2>
      <p>Fetching the latest items and deals</p>
    </div>
  </div>
);

const Header: React.FC<{ user: PlayerInfoResponse | null }> = ({ user }) => (
  <header className="header">
    <div className="header-content">
      <div className="user-info">
        <div className="avatar">
          {user?.username?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="user-details">
          <h2 className="welcome-text">Welcome back</h2>
          <p className="username">{user?.username || 'Agent'}</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="refresh-button" title="Refresh Store">
          ↻
        </button>
      </div>
    </div>
  </header>
);

const StoreCountdown: React.FC<{ timeRemaining: string }> = ({ timeRemaining }) => (
  <section className="countdown-section">
    <div className="countdown-card">
      <div className="countdown-content">
        <h3 className="countdown-title">Store Rotation</h3>
        <p className="countdown-subtitle">Next refresh in</p>
        <div className="countdown-display">
          {timeRemaining.split(':').map((unit, index) => (
            <div key={index} className="time-unit">
              <span className="time-number">{unit}</span>
              <span className="time-label">
                {index === 0 ? 'HRS' : index === 1 ? 'MIN' : 'SEC'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const StoreItems: React.FC<{ items: StoreItem[] }> = ({ items }) => (
  <section className="store-section">
    <h3 className="section-title">Featured Items</h3>
    <div className="store-grid">
      {items.length > 0 ? (
        items.map((item, index) => (
          <StoreItemCard key={item.uuid || index} item={item} />
        ))
      ) : (
        Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="store-item-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-image"></div>
              <div className="placeholder-text">
                <div className="placeholder-line"></div>
                <div className="placeholder-line short"></div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </section>
);

const StoreItemCard: React.FC<{ item: StoreItem }> = ({ item }) => (
  <div className="store-item">
    <div className="item-image-container">
      <img 
        src={item.displayIcon} 
        alt={item.displayName}
        className="item-image"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
    <div className="item-details">
      <h4 className="item-name">{item.displayName}</h4>
      <p className="item-category">{item.category}</p>
      <div className="item-price">
        <span className="currency">VP</span>
        <span className="amount">{item.cost.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

export default App;