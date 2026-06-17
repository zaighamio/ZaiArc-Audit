import React from 'react';
import { useBountyPlatform } from '../hooks/useBountyPlatform';
import { Trophy, Award, Search, Users, ShieldAlert, Sparkles } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { leaderboard } = useBountyPlatform();

  // Pick top 3 for the beautiful holographic podium!
  const podium1 = leaderboard.find((item) => item.rank === 1);
  const podium2 = leaderboard.find((item) => item.rank === 2);
  const podium3 = leaderboard.find((item) => item.rank === 3);

  // Remainder list
  const runnersUp = leaderboard.filter((item) => item.rank > 3);

  // Shorten address format
  const maskAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="leaderboard-page-container">
      
      {/* Page Title */}
      <div className="border-b border-zinc-900 pb-6 mb-10">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white flex items-center gap-2.5">
          <Trophy className="h-8 w-8 text-cyber-red animate-pulse" />
          Elite Security Researchers
        </h1>
        <p className="mt-1 text-sm text-cyber-text-sec">
          Honoring researchers safeguarding the Arc network ecosystem. Ranked purely by transparent, verified smart contract audit compensation.
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="rounded-2xl border border-zinc-900 bg-black/40 py-20 text-center text-cyber-text-sec font-mono text-xs">
          No audit reports have been approved for compilation payout yet.
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          
          {/* 1. HOLOGRAPHIC HERO PODIUMS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end justify-center py-6" id="leaderboard-podium-deck">
            
            {/* Rank 2 (Left Podium column) */}
            {podium2 ? (
              <div className="relative flex flex-col items-center p-6 rounded-2xl border border-zinc-900 bg-[#0c0000]/40 order-2 md:order-1 h-72 justify-between">
                <div className="absolute top-2 right-2 text-zinc-500 font-number font-black text-xl select-none">#2</div>
                
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-cyber-silver/30 bg-zinc-800/20 flex items-center justify-center text-cyber-silver mb-3">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono text-zinc-300 font-bold block select-all">{maskAddress(podium2.wallet)}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 block">Approved disclosures: {podium2.reportsApproved}</span>
                </div>

                <div className="w-full text-center border-t border-zinc-950 pt-4 font-number">
                  <span className="text-sm font-bold text-zinc-300 block">{podium2.totalUSDCEarned.toLocaleString()} USDC</span>
                  <span className="text-xs text-zinc-500 block mt-0.5">{podium2.totalEURCEarned.toLocaleString()} EURC</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-950 p-6 h-72 order-2 md:order-1 flex items-center justify-center text-xs text-zinc-650 uppercase font-mono">Scope open</div>
            )}

            {/* Rank 1 (Middle taller Gold Column) */}
            {podium1 ? (
              <div className="relative flex flex-col items-center p-6 rounded-2xl border border-cyber-red/30 bg-gradient-to-t from-red-950/20 to-[#0e0000] order-1 md:order-2 h-80 justify-between shadow-[0_0_30px_rgba(255,0,0,0.1)]">
                <div className="absolute top-2 right-2 text-cyber-red font-number font-black text-2xl select-none">#1</div>
                
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 rounded-full border border-cyber-red/30 bg-red-950/20 flex items-center justify-center text-cyber-red mb-3 shadow-[0_0_15px_rgba(255,0,0,0.30)]">
                    <Trophy className="h-7 w-7 text-cyber-accent" />
                  </div>
                  <span className="text-sm font-mono text-white font-black block select-all">{maskAddress(podium1.wallet)}</span>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1 block">Approved disclosures: {podium1.reportsApproved}</span>
                </div>

                <div className="w-full text-center border-t border-zinc-950 pt-4 font-number">
                  <span className="text-lg font-black text-white text-glow-red block">{podium1.totalUSDCEarned.toLocaleString()} USDC</span>
                  <span className="text-xs text-zinc-400 block mt-0.5">{podium1.totalEURCEarned.toLocaleString()} EURC</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-950 p-6 h-80 order-1 md:order-2 flex items-center justify-center text-xs text-zinc-650 uppercase font-mono">Scope open</div>
            )}

            {/* Rank 3 (Right Podium column) */}
            {podium3 ? (
              <div className="relative flex flex-col items-center p-6 rounded-2xl border border-zinc-900 bg-[#0c0000]/40 order-3 md:order-3 h-64 justify-between">
                <div className="absolute top-2 right-2 text-amber-600 font-number font-black text-xl select-none">#3</div>
                
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-amber-900/30 bg-amber-950/10 flex items-center justify-center text-amber-600 mb-3">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-zinc-300 font-bold block select-all">{maskAddress(podium3.wallet)}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 block">Approved disclosures: {podium3.reportsApproved}</span>
                </div>

                <div className="w-full text-center border-t border-zinc-950 pt-4 font-number">
                  <span className="text-sm font-bold text-zinc-300 block">{podium3.totalUSDCEarned.toLocaleString()} USDC</span>
                  <span className="text-xs text-zinc-500 block mt-0.5">{podium3.totalEURCEarned.toLocaleString()} EURC</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-950 p-6 h-64 order-3 md:order-3 flex items-center justify-center text-xs text-zinc-650 uppercase font-mono">Scope open</div>
            )}

          </div>

          {/* 2. ALL LIST TABLE */}
          {runnersUp.length > 0 && (
            <div className="rounded-2xl border border-zinc-900 bg-cyber-surf/40 p-6 shadow-md" id="leaderboard-table-panel">
              <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-4">
                Global Ranking Index
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" id="leaderboard-runners-table">
                  <thead className="bg-[#0c0000] text-[11px] font-heading font-semibold text-zinc-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Rank</th>
                      <th className="p-3.5">Researcher Address</th>
                      <th className="p-3.5 text-center">Approved Findings</th>
                      <th className="p-3.5 text-right">USDC Compensation</th>
                      <th className="p-3.5 text-right">EURC Compensation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-950 font-sans text-zinc-300">
                    {runnersUp.map((item) => (
                      <tr key={item.rank} className="hover:bg-red-950/5 transition-colors">
                        <td className="p-3.5 font-number font-bold text-cyber-silver">
                          #{item.rank}
                        </td>
                        <td className="p-3.5 font-mono text-white select-all">
                          {item.wallet}
                        </td>
                        <td className="p-3.5 text-center font-number font-bold text-zinc-400">
                          {item.reportsApproved}
                        </td>
                        <td className="p-3.5 text-right font-number font-extrabold text-white">
                          {item.totalUSDCEarned.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right font-number font-semibold text-zinc-400">
                          {item.totalEURCEarned.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
