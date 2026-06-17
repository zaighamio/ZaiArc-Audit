import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

// RainbowKit CSS imports
import '@rainbow-me/rainbowkit/styles.css';

// Client Web3 and store custom configurations
import { wagmiConfig } from './config/web3';
import { useBountyPlatform } from './hooks/useBountyPlatform';

// Styling, layouts & widgets
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { CyberBackground } from './components/CyberBackground';

// Pages
import { Home } from './pages/Home';
import { Bounties } from './pages/Bounties';
import { BountyDetail } from './pages/BountyDetail';
import { CreateBounty } from './pages/CreateBounty';
import { Dashboard } from './pages/Dashboard';
import { Leaderboard } from './pages/Leaderboard';
import { Admin } from './pages/Admin';

const queryClient = new QueryClient();

function MainAppLayout() {
  const { engineMode, toggleEngineMode } = useBountyPlatform();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-white bg-cyber-bg font-sans bg-cover selection:bg-red-800/60 selection:text-white" id="zaiarc-app-wrapper">
      
      {/* Sci-fi Cyber Animated Layer Background */}
      <CyberBackground />

      {/* Sticky Navigation Header bar */}
      <Navigation
        engineMode={engineMode}
        onToggleEngineMode={toggleEngineMode}
      />

      {/* Primary Routing Scene */}
      <main className="flex-1 relative pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/bounty/:id" element={<BountyDetail />} />
          <Route path="/create" element={<CreateBounty />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Global Brand Footer component */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#FF0000',
            accentColorForeground: '#FFFFFF',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <BrowserRouter>
            <MainAppLayout />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
