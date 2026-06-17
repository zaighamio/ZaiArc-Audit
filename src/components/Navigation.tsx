import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Logo } from './Logo';
import { Menu, X, ShieldAlert, Cpu, Layers, Wallet, Copy, Check, RefreshCw, Sliders, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  engineMode: 'sandbox' | 'live';
  onToggleEngineMode: (mode: 'sandbox' | 'live') => void;
}

const CustomWalletConnect: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleCopy = async (addressToCopy: string) => {
    try {
      await navigator.clipboard.writeText(addressToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-red-500/50 bg-[#0A0000]/95 text-red-500 hover:text-white text-xs font-heading font-bold uppercase tracking-widest transition-all duration-300 hover:border-red-400 hover:scale-[1.04] hover:shadow-[0_0_25px_rgba(255,0,0,0.455)] shadow-[0_0_15px_rgba(255,0,0,0.15)] cursor-pointer active:scale-95"
                  >
                    {/* Pulsing indicator */}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-650"></span>
                    </span>
                    <Wallet className="w-3.5 h-3.5 transition-transform group-hover:rotate-12 duration-300" />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500 bg-[#1A0000] text-red-400 text-xs font-bold uppercase tracking-widest hover:scale-[1.03] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,0,0.2)] active:scale-95 animate-pulse"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Wrong network</span>
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/25 bg-black/85 hover:border-red-500/40 text-[10px] font-bold text-zinc-300 uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.02] font-mono"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 14,
                          height: 14,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                        className="flex items-center justify-center shrink-0"
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 14, height: 14 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-[9px] tracking-widest font-bold">{chain.name}</span>
                  </button>

                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    type="button"
                    className={`group flex items-center gap-2.5 px-5 py-2 rounded-full border transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] active:scale-95 ${
                      dropdownOpen
                        ? 'border-red-400 bg-red-950/20 text-red-300 scale-[1.02]'
                        : 'border-red-500/30 bg-[#050000]/90 text-red-400 hover:scale-[1.03] hover:border-red-500/60 hover:text-red-300'
                    }`}
                  >
                    {/* Beautiful mini glowing neon avatar */}
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 group-hover:scale-110 transition-transform flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                      <span className="text-[7px] text-white font-sans font-bold select-none leading-none">A</span>
                    </div>

                    <span className="text-[11px] font-bold tracking-tight text-white group-hover:text-red-300 transition-colors">
                      {account.displayName}
                    </span>

                    {account.displayBalance && (
                      <span className="hidden md:inline-block ml-1 pl-1.5 border-l border-red-500/20 text-gray-400 text-[10px] font-normal font-mono">
                        {account.displayBalance}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu Modal */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-3 w-72 origin-top-right rounded-2xl border border-red-500/35 bg-[#090000]/95 backdrop-blur-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.92),0_0_30px_rgba(255,0,0,0.08)] z-[100] overflow-hidden"
                      >
                        {/* Technical cyber grid overlay lines */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none"></div>

                        {/* Dropdown Header Card */}
                        <div className="relative z-10 flex flex-col items-center border-b border-red-950/50 pb-3.5 mb-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-red-650 to-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.45)] mb-2.5">
                            <span className="text-base text-white font-sans font-black">A</span>
                          </div>
                          
                          <span className="text-sm font-mono font-bold text-white tracking-widest">{account.displayName}</span>
                          
                          {account.displayBalance && (
                            <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#180000] border border-red-900/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span className="font-mono text-[10px] text-zinc-300 font-bold">{account.displayBalance}</span>
                            </div>
                          )}
                        </div>

                        {/* Interactive List Grid */}
                        <div className="relative z-10 flex flex-col gap-1.5">
                          
                          {/* Copy Address Row */}
                          <button
                            onClick={() => {
                              handleCopy(account.address);
                            }}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left bg-[#0A0000]/30 text-zinc-200 hover:text-white hover:bg-red-950/20 transition-all duration-300 border border-transparent hover:border-red-500/20 cursor-pointer"
                          >
                            <span className="flex items-center gap-2.5">
                              <Copy className="w-4 h-4 text-cyber-red" />
                              <span className="font-heading font-bold uppercase tracking-wider text-[10px]">Copy Wallet Address</span>
                            </span>
                            {copied ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Copy</span>
                            )}
                          </button>

                          {/* Switch Network Row */}
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              openChainModal();
                            }}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left bg-[#0A0000]/30 text-zinc-200 hover:text-white hover:bg-red-950/20 transition-all duration-300 border border-transparent hover:border-red-500/20 cursor-pointer"
                          >
                            <span className="flex items-center gap-2.5">
                              <RefreshCw className="w-4 h-4 text-cyber-red" />
                              <span className="font-heading font-bold uppercase tracking-wider text-[10px]">Change Network</span>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono text-zinc-400 font-bold">
                              {chain.name}
                            </span>
                          </button>

                          {/* Details / Manage Connection */}
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              openAccountModal();
                            }}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left bg-[#0A0000]/30 text-zinc-200 hover:text-white hover:bg-red-950/20 transition-all duration-300 border border-transparent hover:border-red-500/20 cursor-pointer"
                          >
                            <span className="flex items-center gap-2.5">
                              <Sliders className="w-4 h-4 text-cyber-red" />
                              <span className="font-heading font-bold uppercase tracking-wider text-[10px]">Manage Connection</span>
                            </span>
                          </button>

                          {/* Disconnect Row */}
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              openAccountModal();
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2.5 mt-1 rounded-xl text-left bg-red-950/20 border border-red-900/25 text-[10px] font-heading font-bold uppercase tracking-wider text-red-400 hover:bg-red-900/40 hover:text-white transition-all cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-cyber-red" />
                            <span>Disconnect Connection</span>
                          </button>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export const Navigation: React.FC<NavigationProps> = ({
  engineMode,
  onToggleEngineMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConnected, address } = useAccount();

  // Active styles helper
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 px-3 text-sm font-heading font-semibold uppercase tracking-wider transition-all duration-300 nav-glow-item ${
      isActive
        ? 'text-white text-glow-red after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[3px] after:bg-gradient-to-r after:from-red-500 after:to-white after:shadow-[0_0_15px_rgba(255,0,0,0.85)]'
        : 'text-cyber-silver hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Left */}
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo size={36} />
        </Link>

        {/* Desktop Links Center */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={getLinkClass}>Home</NavLink>
          <NavLink to="/bounties" className={getLinkClass}>Bounties</NavLink>
          <NavLink to="/create" className={getLinkClass}>Create Bounty</NavLink>
          <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>
          <NavLink to="/leaderboard" className={getLinkClass}>Leaderboard</NavLink>
          {address?.toLowerCase() === '0xdc66fcf9312b087bd713d52b6f462dfb78f64f5e' && (
            <NavLink to="/admin" className={getLinkClass}>Admin</NavLink>
          )}
        </nav>

        {/* Connection + Controls Right */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Dual Engine Switcher Widget */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[rgba(255,0,0,0.2)] bg-black/60 p-1">
            <button
              onClick={() => onToggleEngineMode('sandbox')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-number leading-none tracking-wider uppercase transition-all duration-300 ${
                engineMode === 'sandbox'
                  ? 'bg-gradient-to-r from-red-950/80 to-red-800/80 text-white border border-red-500/30 shadow-[0_0_8px_rgba(255,0,0,0.3)]'
                  : 'text-cyber-silver hover:text-white'
              }`}
              title="Runs transaction logic in standard Sandbox with simulated receipts"
              id="sandbox-mode-btn"
            >
              <Cpu className="h-3.5 w-3.5 text-cyber-red animate-pulse" />
              Sandbox
            </button>
            <button
              onClick={() => {
                onToggleEngineMode('live');
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-number leading-none tracking-wider uppercase transition-all duration-300 ${
                engineMode === 'live'
                  ? 'bg-gradient-to-r from-zinc-950/80 to-zinc-800/80 text-white border border-white/20 shadow-[0_0_8px_rgba(192,192,192,0.3)]'
                  : 'text-cyber-silver hover:text-white'
              }`}
              title="Requires connected Web3 wallet on Arc Testnet"
              id="live-mode-btn"
            >
              <Layers className="h-3.5 w-3.5 text-cyber-silver" />
              On-Chain
            </button>
          </div>

          <CustomWalletConnect />
        </div>

        {/* Mobile controls & hamburger toggle */}
        <div className="flex items-center gap-3 md:gap-4 lg:hidden">
          
          <div className="scale-90 sm:scale-100">
            <CustomWalletConnect />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-[rgba(255,0,0,0.2)] p-2 text-cyber-silver hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
            id="mobile-hamburger-btn"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile drop down drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[rgba(255,0,0,0.15)] bg-cyber-bg px-4 py-4 md:hidden" id="mobile-dropdown-menu">
          
          {/* Quick Engine Switcher for Mobile */}
          <div className="mb-4 flex items-center justify-between rounded-xl border border-[rgba(255,0,0,0.15)] bg-black/40 p-2">
            <span className="text-[11px] font-heading font-semibold text-cyber-silver uppercase tracking-wider">Engine:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  onToggleEngineMode('sandbox');
                  setMobileMenuOpen(false);
                }}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-number uppercase ${
                  engineMode === 'sandbox' ? 'bg-red-950 border border-cyber-red text-white' : 'text-cyber-silver'
                }`}
              >
                Sandbox
              </button>
              <button
                onClick={() => {
                  onToggleEngineMode('live');
                  setMobileMenuOpen(false);
                }}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-number uppercase ${
                  engineMode === 'live' ? 'bg-zinc-850 border border-cyber-silver text-white' : 'text-cyber-silver'
                }`}
              >
                On-Chain
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg py-2.5 px-3 text-base font-heading font-medium tracking-wide text-cyber-silver hover:bg-red-950/20 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/bounties"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg py-2.5 px-3 text-base font-heading font-medium tracking-wide text-cyber-silver hover:bg-red-950/20 hover:text-white"
            >
              Bounties
            </Link>
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg py-2.5 px-3 text-base font-heading font-medium tracking-wide text-cyber-silver hover:bg-red-950/20 hover:text-white"
            >
              Create Bounty
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg py-2.5 px-3 text-base font-heading font-medium tracking-wide text-cyber-silver hover:bg-red-950/20 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg py-2.5 px-3 text-base font-heading font-medium tracking-wide text-cyber-silver hover:bg-red-950/20 hover:text-white"
            >
              Leaderboard
            </Link>
            {address?.toLowerCase() === '0xdc66fcf9312b087bd713d52b6f462dfb78f64f5e' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg py-2.5 px-3 text-base font-heading font-medium tracking-wide text-cyber-silver hover:bg-red-950/20 hover:text-white"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
