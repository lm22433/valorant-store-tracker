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

// First, let's define the types for the Valorant API response
interface ValorantSkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string;
  displayIcon: string;
  wallpaper: string;
  assetPath: string;
  chromas: {
    uuid: string;
    displayName: string;
    displayIcon: string;
    fullRender: string;
    swatch: string;
    streamedVideo: string;
    assetPath: string;
  }[];
  levels: {
    uuid: string;
    displayName: string;
    levelItem: string;
    displayIcon: string;
    streamedVideo: string;
    assetPath: string;
  }[];
}

interface ValorantAPIResponse {
  status: number;
  data: ValorantSkin[];
}

interface ProcessedStoreItem {
  uuid: string;
  displayName: string;
  displayIcon: string;
  cost: number;
  category: string;
  skinData?: ValorantSkin;
}

interface ProcessedStoreData {
  dailyStore: ProcessedStoreItem[];
  nightMarket: ProcessedStoreItem[];
  timeUntilReset: number;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<PlayerInfoResponse | null>(null);
  const [store, setStore] = useState<StorefrontResponse | null>(null);
  const [skinData, setSkinData] = useState<ValorantSkin[]>([]);
  
  const [dailyStore, setDailyStore] = useState<ProcessedStoreItem[]>([]);
  const [nightMarket, setNightMarket] = useState<ProcessedStoreItem[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);

  // Helper function to fetch skin data from Valorant API
  const fetchSkinData = async (): Promise<ValorantSkin[]> => {
    try {
      const response = await fetch('https://valorant-api.com/v1/weapons/skins');
      const data: ValorantAPIResponse = await response.json();
      
      if (data.status === 200) {
        return data.data;
      }
      throw new Error(`API returned status ${data.status}`);
    } catch (error) {
      console.error('Failed to fetch skin data:', error);
      return [];
    }
  };

  // Helper function to process store data
  const processStoreData = (
    storeResponse: StorefrontResponse, 
    skins: ValorantSkin[]
  ): ProcessedStoreData => {
    const skinMap = new Map(skins.map(skin => [skin.uuid, skin]));
    
    // Process daily store (SingleItemStoreOffers)
    const dailyStoreItems: ProcessedStoreItem[] = storeResponse.SkinsPanelLayout.SingleItemStoreOffers.map(offer => {
      const skinInfo = skinMap.get(offer.OfferID);
      console.log("Offer ID:", offer.OfferID);

       for (let i = 0; i < skins.length; i++) {
        const skin = skins[i];
        if (skin.levels[0].uuid === offer.OfferID) {
          return {
            uuid: skin.uuid,
            displayName: skin.displayName,
            displayIcon: skin.displayIcon,
            cost: offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"] || 0,
            category: 'Weapon Skin',
            skinData: skin
          };
        }
       }

       return {
         uuid: offer.OfferID,
         displayName: skinInfo?.displayName || 'Unknown Skin',
         displayIcon: skinInfo?.displayIcon || '',
         cost: offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"] || 0,
         category: 'Weapon Skin',
         skinData: skinInfo
       };
    });

    console.log("Processed Daily Store Items:", dailyStoreItems);

    // Process night market (if available in AccessoryStore or other stores)
    // Note: Night Market structure might be different - adjust based on actual API response
    const nightMarketItems: ProcessedStoreItem[] = [];
    
    // You might need to check other stores for night market
    // For example, if night market is in AccessoryStore:
    storeResponse.AccessoryStore.AccessoryStoreOffers.forEach(offer => {
      const reward = offer.Offer.Rewards[0];
      const skinInfo = skinMap.get(reward.ItemID);
      const cost = offer.Offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"] || 0;
      
      nightMarketItems.push({
        uuid: reward.ItemID,
        displayName: skinInfo?.displayName || 'Unknown Item',
        displayIcon: skinInfo?.displayIcon || '',
        cost: cost,
        category: 'Accessory',
        skinData: skinInfo
      });
    });

    // Calculate time until reset
    const timeUntilReset = storeResponse.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds || 0;

    return {
      dailyStore: dailyStoreItems,
      nightMarket: nightMarketItems,
      timeUntilReset
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [userInfo, storeResponse, skins]: [PlayerInfoResponse, StorefrontResponse, ValorantSkin[]] = await Promise.all([
          invoke("get_account_info_command"),
          invoke("get_store_data"),
          fetchSkinData()
        ]);

        setUser(userInfo);
        setStore(storeResponse);
        setSkinData(skins);

        const processedStore = processStoreData(storeResponse, skinData);
        setDailyStore(processedStore.dailyStore);
        setNightMarket(processedStore.nightMarket);

        // Set up timer with the processed data
        setupTimer(processedStore.timeUntilReset);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Separate function to handle timer setup
  const setupTimer = (resetTime: number) => {
    const updateTimer = () => {
      const remaining = resetTime * 1000 - (Date.now() % (24 * 60 * 60 * 1000));
      
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
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="home">
      <Header user={user} />
      <main className="main-content">
        <StoreCountdown timeRemaining={timeRemaining} />
        
        {/* Daily Store Section */}
        <section className="store-section">
          <h3 className="section-title">Daily Store</h3>
          <StoreItems items={dailyStore} />
        </section>

        {/* Night Market Section (if available) */}
        {nightMarket.length > 0 && (
          <section className="store-section">
            <h3 className="section-title">Night Market</h3>
            <StoreItems items={nightMarket} />
          </section>
        )}
      </main>
    </div>
  );
};

// Update StoreItems component to work with ProcessedStoreItem
const StoreItems: React.FC<{ items: ProcessedStoreItem[] }> = ({ items }) => (
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
);

// Update StoreItemCard to work with ProcessedStoreItem
const StoreItemCard: React.FC<{ item: ProcessedStoreItem }> = ({ item }) => (
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

// Keep existing components
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

export default App;