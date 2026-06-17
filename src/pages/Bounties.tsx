import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBountyPlatform } from '../hooks/useBountyPlatform';
import { Search, SlidersHorizontal, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { BountyStatus } from '../types';
import { USDC_ADDRESS } from '../config/web3';

export const Bounties: React.FC = () => {
  const { bounties, refreshData } = useBountyPlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'closed'>('all');

  // Filter logic
  const filteredBounties = bounties.filter((bounty) => {
    // 1. Search Query
    const matchesSearch = bounty.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bounty.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Status Filter
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = bounty.status === BountyStatus.Active;
    if (statusFilter === 'paused') matchesStatus = bounty.status === BountyStatus.Paused;
    if (statusFilter === 'closed') matchesStatus = bounty.status === BountyStatus.Closed;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BountyStatus) => {
    switch (status) {
      case BountyStatus.Active:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950 bg-emerald-950/20 px-2.5 py-1 text-[11px] font-semibold text-[#00FF88] shadow-[0_0_8px_rgba(0,255,136,0.15)] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88] animate-pulse"></span>
            ACTIVE
          </span>
        );
      case BountyStatus.Paused:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-950 bg-amber-950/20 px-2.5 py-1 text-[11px] font-semibold text-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.15)] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]"></span>
            PAUSED
          </span>
        );
      case BountyStatus.Closed:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 px-2.5 py-1 text-[11px] font-semibold text-zinc-500 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500"></span>
            CLOSED
          </span>
        );
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="bounties-page-container">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
            Smart Contract Security Bounties
          </h1>
          <p className="mt-1 text-sm text-cyber-text-sec">
            Browse active exploit bounty pools on Arc. Spot security vulnerabilities and claims rewards securely on-chain.
          </p>
        </div>

        {/* Sync Trigger button */}
        <button
          onClick={refreshData}
          className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-black/40 px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-cyber-silver hover:border-cyber-red hover:text-white transition-all self-start md:self-auto"
          id="sync-bounties-btn"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh State</span>
        </button>
      </div>

      {/* Query Search / Filter Bar */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0c0000]/40 border border-zinc-900 p-4 rounded-2xl">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search auditing targets or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-900 bg-black/80 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-cyber-red/50 focus:outline-none focus:ring-1 focus:ring-cyber-red/50"
            id="search-bounties-query"
          />
        </div>

        {/* Categories / Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500 mr-2 flex items-center gap-1 uppercase tracking-wider">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </span>
          
          {(['all', 'active', 'paused', 'closed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-xl px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                statusFilter === filter
                  ? 'bg-red-950/80 border border-cyber-red text-white shadow-[0_0_12px_rgba(255,0,0,0.3)]'
                  : 'border border-zinc-900 bg-black/60 text-cyber-text-sec hover:border-zinc-800 hover:text-white'
              }`}
              id={`filter-btn-${filter}`}
            >
              {filter}
            </button>
          ))}
        </div>

      </div>

      {/* Results Count Info */}
      <p className="mt-6 text-xs text-zinc-500 uppercase font-mono">
        Showing <span className="text-white font-bold">{filteredBounties.length}</span> security targets found
      </p>

      {/* Primary Grid list of bounties */}
      {filteredBounties.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-zinc-900 bg-black/40 py-20 text-center text-cyber-text-sec">
          <AlertCircle className="h-12 w-12 text-cyber-red/50 mb-4 stroke-[1.5]" />
          <p className="font-heading text-lg font-bold text-white uppercase tracking-wider">No Targets Match Your Search</p>
          <p className="mt-2 text-sm text-zinc-500 max-w-sm">
            Try correcting typos, broadening your query words or resetting the ACTIVE filters.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2" id="all-bounties-cards-grid">
          {filteredBounties.map((bounty) => {
            const isUSDC = bounty.rewardToken.toLowerCase() === USDC_ADDRESS.toLowerCase();
            const tokenSymbol = isUSDC ? 'USDC' : 'EURC';

            return (
              <div
                key={bounty.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-red-900/20 bg-[#0F0000] p-6 shadow-md transition-all duration-300 hover:border-red-500/40 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,0,0,0.15)]"
                id={`audit-bounty-paged-card-${bounty.id}`}
              >
                <div>
                  
                  {/* Card Header (Project + Status) */}
                  <div className="flex items-start justify-between gap-4 border-b border-zinc-950 pb-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-white tracking-wide group-hover:text-cyber-accent transition-all">
                        {bounty.projectName}
                      </h3>
                      <span className="mt-1 block font-mono text-[10px] text-zinc-500 hover:text-cyber-red cursor-pointer truncate max-w-[280px] md:max-w-md">
                        LOC: {bounty.contractAddress}
                      </span>
                    </div>
                    {getStatusBadge(bounty.status)}
                  </div>

                  {/* Description text */}
                  <p className="mt-4 text-xs text-cyber-text-sec leading-relaxed line-clamp-3">
                    {bounty.description}
                  </p>

                  {/* SEVERITIES TIERS DETAILS SCREEN */}
                  <div className="mt-6">
                    <span className="text-[10px] font-heading font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Severity Reward Matrix</span>
                    
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 font-number">
                      {/* Critical */}
                      <div className="rounded-lg bg-red-950/10 border border-red-950/40 p-2.5 hover:bg-red-950/20 hover:border-red-600/30 transition-all text-center">
                        <span className="text-[9px] text-[#FF0000] font-bold block uppercase leading-none">Critical</span>
                        <span className="mt-1 font-bold text-xs text-white block">
                          {(Number(bounty.rewardCritical) / 1e6).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-zinc-500 block leading-none mt-0.5">{tokenSymbol}</span>
                      </div>

                      {/* High */}
                      <div className="rounded-lg bg-orange-950/10 border border-orange-950/40 p-2.5 hover:bg-orange-950/20 hover:border-orange-600/30 transition-all text-center">
                        <span className="text-[9px] text-[#FF6B00] font-bold block uppercase leading-none">High</span>
                        <span className="mt-1 font-bold text-xs text-white block">
                          {(Number(bounty.rewardHigh) / 1e6).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-zinc-500 block leading-none mt-0.5">{tokenSymbol}</span>
                      </div>

                      {/* Medium */}
                      <div className="rounded-lg bg-yellow-950/10 border border-yellow-950/40 p-2.5 hover:bg-yellow-950/20 hover:border-yellow-600/30 transition-all text-center">
                        <span className="text-[9px] text-[#FFD700] font-bold block uppercase leading-none">Medium</span>
                        <span className="mt-1 font-bold text-xs text-white block">
                          {(Number(bounty.rewardMedium) / 1e6).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-zinc-500 block leading-none mt-0.5">{tokenSymbol}</span>
                      </div>

                      {/* Low */}
                      <div className="rounded-lg bg-blue-950/10 border border-blue-950/40 p-2.5 hover:bg-blue-950/20 hover:border-blue-600/30 transition-all text-center">
                        <span className="text-[9px] text-[#00BFFF] font-bold block uppercase leading-none">Low</span>
                        <span className="mt-1 font-bold text-xs text-white block">
                          {(Number(bounty.rewardLow) / 1e6).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-zinc-500 block leading-none mt-0.5">{tokenSymbol}</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Card Footer info */}
                <div className="mt-6 pt-4 border-t border-zinc-950 flex flex-wrap items-center justify-between gap-4">
                  
                  {/* Pool size info */}
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase leading-none">Bounty Lock Pool</span>
                      <span className="mt-1 font-number font-black text-sm text-white">
                        {(Number(bounty.totalPool) / 1e6).toLocaleString()} <span className="text-xs text-cyber-red">{tokenSymbol}</span>
                      </span>
                    </div>

                    <div className="flex flex-col border-l border-zinc-900 pl-6">
                      <span className="text-[9px] text-zinc-500 uppercase leading-none">Submissions</span>
                      <span className="mt-1 font-number font-bold text-sm text-zinc-300">
                        {bounty.reportsCount} <span className="text-[10px] text-zinc-500 uppercase">items</span>
                      </span>
                    </div>
                  </div>

                  {/* Audit Button */}
                  <Link
                    to={`/bounty/${bounty.id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 to-red-800 border border-cyber-red/30 px-5 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-white hover:opacity-90 shadow-[0_0_10px_rgba(255,0,0,0.15)] transition-all"
                    id={`enter-audit-target-btn-${bounty.id}`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Audit Scope</span>
                  </Link>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
