import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBountyPlatform } from '../hooks/useBountyPlatform';
import { Logo } from '../components/Logo';
import { Shield, Sparkles, AlertOctagon, Terminal, Coins, ArrowRight, CheckCircle2, ChevronDown, HelpCircle } from 'lucide-react';
import { Bounty } from '../types';
import { USDC_ADDRESS } from '../config/web3';
import { motion, AnimatePresence } from 'motion/react';

// Clean CountUp Animation Component using standard primitive dependencies
export const CountUp: React.FC<{ end: number; duration?: number; decimals?: boolean }> = ({
  end,
  duration = 1000,
  decimals = false,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = startValue + progress * (end - startValue);

      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  if (decimals) {
    return <span>{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
  }
  return <span>{Math.floor(value).toLocaleString()}</span>;
};

export const Home: React.FC = () => {
  const { bounties, platformStats } = useBountyPlatform();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Get latest 6 active/featured bounties
  const latestBounties = [...bounties]
    .filter((b) => b.status === 0 /* Active */)
    .slice(0, 6);

  const faqItems = [
    {
      title: "Smart Contract Audit Bounty Platform",
      content: "ZaiArc Audit acts as a decentralized sandbox and on-chain protocol where web3 creators lock smart rewards in public escrow pools, allowing professional security researchers to search files, report exploits, and safely claim bounty fees."
    },
    {
      title: "Secure Escrows & Submission Review",
      content: "Contract developers specify critical, high, medium, and low security reward tiers, then deposit USDC or EURC into the escrow pools during creation. This guarantees funds are 100% locked and verified on the blockchain."
    },
    {
      title: "Vulnerability Hunting for Researchers",
      content: "Ethical security researchers and white-hat auditors inspect target contract codebases, prove potential exploits with clear descriptions and proof-of-concept submissions, and earn direct token payouts."
    },
    {
      title: "Ecosystem Backed by Arc Testnet using USDC & EURC",
      content: "All smart operations are fully executed on the lightning-fast Arc Testnet ecosystem. It implements transaction logic with standard stablecoins USDC and EURC to provide high liquid reward backing and zero fee overhead."
    }
  ];

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8" id="home-page-container">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center pt-5 pb-12 text-center md:pt-8 md:pb-16">
        
        {/* Animated pulsing target ring surrounds center logo */}
        <div className="relative mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-red-950/10">
          <div className="absolute inset-0 rounded-full border border-cyber-red/25 animate-[pulse_2s_infinite]"></div>
          <div className="absolute inset-4 rounded-full border border-cyber-silver/10 animate-[spin_12s_infinite_linear]"></div>
          <Logo size={64} showText={false} animate={true} />
        </div>

        {/* Display Heading */}
        <h1 className="font-heading text-[38px] font-black leading-[0.95] tracking-tighter uppercase sm:text-[56px] md:text-[68px] lg:text-[84px] text-white mb-3">
          SECURE <span className="bg-gradient-to-r from-[#FF0000] to-[#C0C0C0] bg-clip-text text-transparent block md:inline">smart contracts.</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-gray-400 leading-relaxed">
          Submit your contract for audit. Find critical vulnerabilities. Earn <span className="text-white font-mono">USDC</span> or <span className="text-white font-mono">EURC</span> rewards on the Arc Testnet ecosystem.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/create"
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold uppercase tracking-widest text-sm rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all hover:scale-[1.02]"
            id="hero-create-bounty-btn"
          >
            Create Bounty
          </Link>
          <Link
            to="/bounties"
            className="px-8 py-4 border border-zinc-700 text-[#C0C0C0] font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white/5 transition-all text-center"
            id="hero-find-bugs-btn"
          >
            Find Bugs
          </Link>
        </div>

      </section>

      {/* 2. STATS BAR (4 Artistic Flair columns) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12" id="stats-bar-grid">
        
        {/* Stat 1 */}
        <div className="p-6 rounded-2xl bg-red-500/[0.03] border border-red-900/20 backdrop-blur-sm relative transition-all hover:border-red-500/20">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Bounties</p>
          <p className="text-3xl font-mono font-bold text-red-500 flex items-baseline gap-1">
            <CountUp end={platformStats.totalBounties} />
          </p>
        </div>

        {/* Stat 2 */}
        <div className="p-6 rounded-2xl bg-red-500/[0.03] border border-red-900/20 backdrop-blur-sm relative transition-all hover:border-red-500/20">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Reports Found</p>
          <p className="text-3xl font-mono font-bold text-white flex items-baseline gap-1">
            <CountUp end={platformStats.totalReports} />
          </p>
        </div>

        {/* Stat 3 */}
        <div className="p-6 rounded-2xl bg-red-500/[0.03] border border-red-900/20 backdrop-blur-sm relative transition-all hover:border-red-500/20">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">USDC Rewarded</p>
          <p className="text-3xl font-mono font-bold text-white tracking-tighter flex items-baseline gap-1">
            <CountUp end={platformStats.totalUSDCRewarded} decimals={true} />
          </p>
        </div>

        {/* Stat 4 */}
        <div className="p-6 rounded-2xl bg-red-500/[0.03] border border-red-900/20 backdrop-blur-sm relative transition-all hover:border-red-500/20">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">EURC Rewarded</p>
          <p className="text-3xl font-mono font-bold text-white tracking-tighter flex items-baseline gap-1">
            <CountUp end={platformStats.totalEURCRewarded} decimals={true} />
          </p>
        </div>

      </section>

      {/* 3. HOW IT WORKS (3 Steps) */}
      <section className="mt-28 py-10" id="how-it-works-section">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
            System Protocol Lifecycle
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-cyber-text-sec">
            A fully transparent smart contract review pipeline secured by escrow pools.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center rounded-2xl border border-zinc-900 bg-black/60 p-8 hover:border-cyber-red/30 transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-950/30 border border-cyber-red/20 text-cyber-red text-xl font-number font-black">
              01
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-white uppercase tracking-wider">Lock Pool Escrow</h3>
            <p className="mt-3 text-sm text-cyber-text-sec leading-relaxed">
              Developers create secure audit pools specifying critical, high, medium, and low security reward tiers, depositing USDC or EURC into the contract.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center rounded-2xl border border-zinc-900 bg-black/60 p-8 hover:border-cyber-red/30 transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-950/30 border border-cyber-red/20 text-cyber-accent text-xl font-number font-black">
              02
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-white uppercase tracking-wider">Exploit Finding Submit</h3>
            <p className="mt-3 text-sm text-cyber-text-sec leading-relaxed">
              Ethical auditors peer-review the specified contract address and submit detailed vulnerabilities alongside clear cryptographic proofs of concept.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center rounded-2xl border border-zinc-900 bg-black/60 p-8 hover:border-cyber-red/30 transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-950/30 border border-cyber-red/20 text-cyber-success text-xl font-number font-black">
              03
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-white uppercase tracking-wider">Verified Payout</h3>
            <p className="mt-3 text-sm text-cyber-text-sec leading-relaxed">
              The contract creator reviews findings. Approvals execute the contract directly, paying tokens securely, while rejections are transparently documented.
            </p>
          </div>

        </div>
      </section>

      {/* 4. ACTIVE MISSION EXPLORER */}
      <section className="mt-20 py-10" id="featured-bounties-list">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-cyber-red">Active Audit Missions</h2>
          <Link
            to="/bounties"
            className="text-[10px] text-gray-500 uppercase cursor-pointer hover:text-white transition-colors"
          >
            View All Explorer →
          </Link>
        </div>

        {latestBounties.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-red-900/20 bg-[#0F0000] p-12 text-center text-gray-500 font-mono text-sm">
            No active audit bounties currently registered on-chain.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestBounties.map((bounty) => {
              const isUSDC = bounty.rewardToken.toLowerCase() === USDC_ADDRESS.toLowerCase();
              return (
                <div
                  key={bounty.id}
                  className="p-5 rounded-2xl bg-[#0F0000] border border-red-900/20 relative group overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-red-500/40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,0,0,0.15)]"
                  id={`featured-bounty-card-${bounty.id}`}
                >
                  <div className="absolute top-0 right-0 p-3">
                    <span className="px-2 py-0.5 rounded text-[8px] bg-red-500/20 text-[#FF0000] font-bold uppercase tracking-tighter">
                      ACTIVE
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-red-500 transition-colors text-white block truncate">
                      {bounty.projectName}
                    </h3>
                    
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed mt-2">
                      {bounty.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-red-900/15">
                    <div>
                      <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-none mb-1">Reward Pool</p>
                      <p className="text-sm font-mono font-bold text-white leading-none">
                        {(Number(bounty.totalPool) / 1e6).toLocaleString()} {isUSDC ? 'USDC' : 'EURC'}
                      </p>
                    </div>

                    <Link
                      to={`/bounty/${bounty.id}`}
                      className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-bold hover:bg-white/10 text-white transition-colors"
                      id={`view-featured-bounty-${bounty.id}`}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. FAQ / INFRASTRUCTURE ACCORDION SECTION */}
      <section className="mt-20 mb-12 py-10 border-t border-red-950/40" id="what-is-zaiarc-section">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-10">
            <span className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-red-950/30 border border-cyber-red/30 mb-3 shadow-[0_0_15px_rgba(255,0,0,0.15)]">
              <HelpCircle className="h-5 w-5 text-red-500 animate-pulse" />
            </span>
            <h2 className="font-heading text-3xl font-black uppercase tracking-wider text-white">
              What is ZaiArc Audit?
            </h2>
            <p className="mt-2 text-sm text-cyber-text-sec">
              Get familiar with our on-chain security audit bounty lifecycle.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-cyber-red bg-[#160000]/80 shadow-[0_0_20px_rgba(255,0,0,0.15)]'
                      : 'border-red-950/30 bg-[#0A0000]/70 hover:border-red-500/30 hover:bg-[#0c0000]/80'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                  >
                    <span className={`font-heading text-sm font-bold uppercase tracking-wide transition-colors ${isOpen ? 'text-cyber-accent text-glow-red' : 'text-white'}`}>
                      {item.title}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-cyber-silver transition-transform duration-300 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-cyber-accent' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-0 border-t border-red-950/20 mt-1">
                          <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed pt-3">
                            {item.content}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};
