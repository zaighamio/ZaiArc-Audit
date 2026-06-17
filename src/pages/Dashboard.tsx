import React, { useState } from 'react';
import { useBountyPlatform } from '../hooks/useBountyPlatform';
import { BountyStatus, ReportStatus, Severity } from '../types';
import { OWNER_ADDRESS, USDC_ADDRESS } from '../config/web3';
import { useAccount, useDisconnect } from 'wagmi';
import {
  ShieldAlert,
  Folders,
  Calendar,
  Layers,
  Sparkles,
  ClipboardList,
  Terminal,
  Activity,
  UserCheck,
  ToggleLeft,
  DollarSign,
  AlertOctagon,
  Power,
  ChevronRight,
  ExternalLink,
  Hourglass,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TxNotification } from '../components/TxNotification';

export const Dashboard: React.FC = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const {
    bounties,
    reports,
    txSubmitting,
    txSuccessHash,
    txError,
    clearTxState,
    approveReport,
    rejectReport,
    updateBountyStatus,
    withdrawRemainingPool,
    refreshData
  } = useBountyPlatform();

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'creator' | 'researcher'>('creator');

  // Simulation fallback states (when no real wallet is connected)
  const [simulatedAccount, setSimulatedAccount] = useState<'none' | 'creator' | 'researcher'>('none');

  // Determine active address matching context
  const getActiveAddress = () => {
    if (isConnected && connectedAddress) return connectedAddress.toLowerCase();
    if (simulatedAccount === 'creator') return '0xdc66fcf9312b087bd713d52b6f462dfb78f64f5e';
    if (simulatedAccount === 'researcher') return '0xf68285cf6fd6782806dfdd67bc01aab6c8f7fab';
    return null;
  };

  const activeAddress = getActiveAddress();

  // Filter My Bounties (Created campaigns)
  const myBounties = bounties.filter((b) => b.creator.toLowerCase() === activeAddress);

  // Filter My Reports submitted
  const myReports = reports.filter((r) => r.researcher.toLowerCase() === activeAddress);

  // Get all reports that are pending review for MY bounties
  const pendingReportsForMe = reports.filter((report) => {
    const isAssociatedWithMyBounty = bounties.some(
      (b) => b.id === report.bountyId && b.creator.toLowerCase() === activeAddress
    );
    return isAssociatedWithMyBounty && report.status === ReportStatus.Pending;
  });

  const getBountyStatusBadge = (status: BountyStatus) => {
    switch (status) {
      case BountyStatus.Active:
        return <span className="text-[10px] bg-emerald-950/20 border border-emerald-900/60 text-[#00FF88] px-2 py-0.5 rounded font-bold uppercase tracking-wider">ACTIVE</span>;
      case BountyStatus.Paused:
        return <span className="text-[10px] bg-amber-950/20 border border-amber-900/60 text-[#FFD700] px-2 py-0.5 rounded font-bold uppercase tracking-wider">PAUSED</span>;
      case BountyStatus.Closed:
        return <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">CLOSED</span>;
    }
  };

  const getReportStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.Pending:
        return <span className="text-[10px] bg-yellow-950/10 border border-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">PENDING REVIEW</span>;
      case ReportStatus.Approved:
        return <span className="text-[10px] bg-emerald-950/20 border border-emerald-900/40 text-[#00FF88] px-2 py-0.5 rounded font-bold uppercase tracking-wider">APPROVED & PAID</span>;
      case ReportStatus.Rejected:
        return <span className="text-[10px] bg-zinc-950 border border-zinc-900 text-zinc-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">REJECTED</span>;
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case Severity.Low: return <span className="text-[9px] text-[#00BFFF] border border-[#00BFFF]/20 bg-blue-950/10 px-1.5 py-0.5 rounded uppercase font-bold">Low</span>;
      case Severity.Medium: return <span className="text-[9px] text-[#FFD700] border border-[#FFD700]/20 bg-yellow-950/10 px-1.5 py-0.5 rounded uppercase font-bold">Medium</span>;
      case Severity.High: return <span className="text-[9px] text-[#FF6B00] border border-[#FF6B00]/20 bg-orange-950/10 px-1.5 py-0.5 rounded uppercase font-bold">High</span>;
      case Severity.Critical: return <span className="text-[9px] text-[#FF0000] border border-[#FF0000]/20 bg-red-950/10 px-1.5 py-0.5 rounded uppercase font-bold">Critical</span>;
    }
  };

  // Helper to estimate reward payment
  const getPayoutString = (report: any) => {
    const b = bounties.find((bo) => bo.id === report.bountyId);
    if (!b) return '0';
    let reward = 0n;
    switch (report.severity) {
      case Severity.Low: reward = b.rewardLow; break;
      case Severity.Medium: reward = b.rewardMedium; break;
      case Severity.High: reward = b.rewardHigh; break;
      case Severity.Critical: reward = b.rewardCritical; break;
    }
    const isUS = b.rewardToken.toLowerCase() === USDC_ADDRESS.toLowerCase();
    return `${(Number(reward) / 1e6).toLocaleString()} ${isUS ? 'USDC' : 'EURC'}`;
  };

  const getBountyName = (bId: number) => {
    const b = bounties.find((bo) => bo.id === bId);
    return b ? b.projectName : `Campaign Scope #${bId}`;
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="dashboard-page-container">
      
      {/* Transaction Overlay Status Banner */}
      <TxNotification
        submitting={txSubmitting}
        successHash={txSuccessHash}
        error={txError}
        onClose={clearTxState}
      />

      {/* 1. SANDBOX PERSONA SIMULATOR PANEL */}
      {!isConnected && (
        <div className="mb-8 rounded-2xl border border-cyber-red/25 bg-[#120000] p-5 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950/30 border border-cyber-red/30">
                <Sliders className="h-5 w-5 text-cyber-accent animate-pulse" />
              </span>
              <div>
                <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  Cyber Sandbox Account Simulator
                </h4>
                <p className="text-xs text-cyber-text-sec leading-relaxed mt-0.5">
                  No Web3 wallet is currently connected. You can test complete developer escrow management or auditor submit actions by selecting a simulated account persona:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => {
                  setSimulatedAccount('creator');
                  setActiveTab('creator');
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-heading font-bold uppercase border transition-all ${
                  simulatedAccount === 'creator'
                    ? 'bg-red-955 border-cyber-red text-white shadow-[0_0_10px_rgba(255,0,0,0.30)]'
                    : 'bg-black/60 border-zinc-900 text-cyber-text-sec hover:border-zinc-850 hover:text-white'
                }`}
                id="select-sim-creator-btn"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Simulate Creator Wallet</span>
              </button>

              <button
                onClick={() => {
                  setSimulatedAccount('researcher');
                  setActiveTab('researcher');
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-heading font-bold uppercase border transition-all ${
                  simulatedAccount === 'researcher'
                    ? 'bg-red-955 border-cyber-red text-white shadow-[0_0_10px_rgba(255,0,0,0.30)]'
                    : 'bg-black/60 border-zinc-900 text-cyber-text-sec hover:border-zinc-850 hover:text-white'
                }`}
                id="select-sim-researcher-btn"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Simulate Auditor Wallet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile summary status details block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-6 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
            Security Control Panel
          </h1>
          
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-cyber-text-sec font-mono">
            <Activity className="h-4.5 w-4.5 text-cyber-red animate-pulse" />
            <span>Active Account Context:</span>
            {activeAddress ? (
              <span className="font-bold text-white select-all">{activeAddress}</span>
            ) : (
              <span className="text-zinc-600 italic">No account initialized. Select a persona or connect wallet.</span>
            )}
          </div>
        </div>

        {/* Sync Trigger button */}
        <button
          onClick={refreshData}
          className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-black/40 px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-cyber-silver hover:border-cyber-red hover:text-white transition-all self-start md:self-auto"
          id="sync-dashboard-btn"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Sync Ledger Data</span>
        </button>
      </div>

      {/* Tabs list switch selection */}
      <div className="flex border-b border-zinc-950 gap-2">
        <button
          onClick={() => setActiveTab('creator')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-heading font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'creator'
              ? 'border-cyber-red text-white text-glow-red bg-red-950/10'
              : 'border-transparent text-cyber-text-sec hover:text-white'
          }`}
          id="dashboard-tab-creator"
        >
          <Folders className="h-4.5 w-4.5" />
          <span>My Code Campaigns ({myBounties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('researcher')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-heading font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'researcher'
              ? 'border-cyber-red text-white text-glow-red bg-red-950/10'
              : 'border-transparent text-cyber-text-sec hover:text-white'
          }`}
          id="dashboard-tab-researcher"
        >
          <ClipboardList className="h-4.5 w-4.5" />
          <span>My Vulnerability Reports ({myReports.length})</span>
        </button>
      </div>

      {/* Tab Context Container */}
      <div className="mt-8" id="dashboard-panels-root">
        
        {/* ====================================================
            TAB 1: CREATOR PORTAL
            ==================================================== */}
        {activeTab === 'creator' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" id="dashboard-creator-panel">
            
            {/* Left Block: Created Campaigns List (8 columns) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-cyber-red" />
                Deployed Escrow Campaigns
              </h3>

              {myBounties.length === 0 ? (
                <div className="rounded-2xl border border-zinc-900 bg-black/40 py-16 text-center text-cyber-text-sec font-mono text-xs">
                  <p>You have not registered any smart contract auditing scopes under this account address.</p>
                  <Link to="/create" className="mt-4 inline-block rounded-xl bg-red-950/30 border border-cyber-red/30 hover:border-cyber-red px-5 py-2.5 text-xs font-heading font-bold text-white uppercase tracking-wider transition-all">
                    Register Campaign Scope
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {myBounties.map((bounty) => {
                    const isUS = bounty.rewardToken.toLowerCase() === USDC_ADDRESS.toLowerCase();
                    const tokenName = isUS ? 'USDC' : 'EURC';

                    return (
                      <div
                        key={bounty.id}
                        className="rounded-2xl border border-zinc-900 bg-[#0c0000]/60 p-5 md:p-6 shadow-md"
                        id={`my-bounty-row-${bounty.id}`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] text-zinc-500 font-mono tracking-wider block">ID: #{bounty.id}</span>
                            <h4 className="mt-0.5 font-heading text-lg font-bold text-white tracking-wide">
                              {bounty.projectName}
                            </h4>
                            <span className="font-mono text-[10px] text-zinc-500 block leading-none select-all mt-1">
                              ADDR: {bounty.contractAddress}
                            </span>
                          </div>

                          <div>
                            {getBountyStatusBadge(bounty.status)}
                          </div>
                        </div>

                        {/* Middle status bars info */}
                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 border-t border-b border-zinc-950 py-4 font-number">
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase leading-none block">Escrow Pool Locked</span>
                            <span className="text-sm font-bold text-white block mt-1">
                              {(Number(bounty.totalPool) / 1e6).toLocaleString()} <span className="text-[10px] font-sans text-cyber-red">{tokenName}</span>
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase leading-none block">Critical Compensation Target</span>
                            <span className="text-sm font-bold text-white block mt-1">
                              {(Number(bounty.rewardCritical) / 1e6).toLocaleString()} <span className="text-[10px] font-sans text-cyber-accent">{tokenName}</span>
                            </span>
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-[9px] text-zinc-500 uppercase leading-none block">Campaign Scope link</span>
                            <Link to={`/bounty/${bounty.id}`} className="inline-flex items-center gap-1 text-[11px] font-heading font-medium text-cyber-red hover:text-white transition-colors mt-1.5 uppercase tracking-wider">
                              <span>Audit details</span>
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>

                        {/* Actions Control list */}
                        <div className="mt-4 flex flex-wrap justify-end gap-2.5">
                          
                          {/* Close/Activate toggle button actions */}
                          {bounty.status === BountyStatus.Active ? (
                            <button
                              onClick={() => updateBountyStatus(bounty.id, BountyStatus.Paused)}
                              className="rounded border border-amber-955 bg-amber-951/20 hover:bg-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase text-[#FFD700] hover:text-[#FFEE88] transition-all cursor-pointer"
                              id={`action-pause-bounty-${bounty.id}`}
                            >
                              Pause Submissions
                            </button>
                          ) : (
                            bounty.status === BountyStatus.Paused && (
                              <button
                                onClick={() => updateBountyStatus(bounty.id, BountyStatus.Active)}
                                className="rounded border border-emerald-955 bg-emerald-951/20 hover:bg-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
                                id={`action-resume-bounty-${bounty.id}`}
                              >
                                Activate Campaign
                              </button>
                            )
                          )}

                          {/* Terminate trigger */}
                          {bounty.status !== BountyStatus.Closed && (
                            <button
                              onClick={() => updateBountyStatus(bounty.id, BountyStatus.Closed)}
                              className="rounded border border-zinc-800 hover:border-red-650 hover:bg-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase text-zinc-500 hover:text-white transition-all cursor-pointer"
                              id={`action-close-bounty-${bounty.id}`}
                            >
                              Terminate Campaign
                            </button>
                          )}

                          {/* Withdraw Pool if Closed or empty */}
                          {bounty.totalPool > 0n && (
                            <button
                              onClick={() => withdrawRemainingPool(bounty.id)}
                              className="rounded border border-cyber-red/20 bg-red-955/10 hover:bg-[#120000] hover:border-cyber-red px-3 py-1.5 text-xs font-semibold uppercase text-white transition-all cursor-pointer"
                              id={`action-withdraw-bounty-${bounty.id}`}
                              title="Withdraw all remaining escrow pool balances"
                            >
                              Withdraw Remaining pool
                            </button>
                          )}

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Right Block: Pending submissions assigned for Review (4 columns) */}
            <div className="lg:col-span-4" id="dashboard-reviews-sidebar">
              <div className="rounded-2xl border border-cyber-red/20 bg-[#120101] p-5 shadow-lg">
                
                <div className="flex items-center gap-2 border-b border-red-950 pb-3.5 mb-4">
                  <ShieldAlert className="h-5 w-5 text-cyber-red animate-pulse" />
                  <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">
                    Findings Docket
                  </h3>
                </div>

                {pendingReportsForMe.length === 0 ? (
                  <p className="text-xs font-mono text-zinc-500 text-center py-8">
                    No pending audits require review under your owned repositories.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {pendingReportsForMe.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-zinc-900 bg-black/60 p-4"
                        id={`pending-review-docket-${item.id}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-heading font-bold text-white tracking-wide truncate max-w-[160px]">
                            {item.title}
                          </h4>
                          {getSeverityBadge(item.severity)}
                        </div>

                        <span className="mt-1 block text-[10px] text-zinc-500 font-sans truncate uppercase">
                          Target: {getBountyName(item.bountyId)}
                        </span>

                        <span className="mt-1 text-[11px] font-number font-bold text-emerald-400 block">
                          Payout Pending: {getPayoutString(item)}
                        </span>

                        <p className="mt-2 text-xs text-cyber-text-sec line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="mt-4 flex gap-2 justify-end border-t border-zinc-950 pt-2.5">
                          <button
                            onClick={() => rejectReport(item.id)}
                            className="rounded bg-zinc-950 border border-zinc-800 hover:border-red-500 px-2 py-1 text-[10px] font-bold uppercase text-zinc-400 hover:text-white transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                          
                          <button
                            onClick={() => approveReport(item.id)}
                            className="rounded bg-red-950/20 border border-cyber-red/30 hover:border-cyber-red px-2.5 py-1 text-[10px] font-bold uppercase text-white transition-all cursor-pointer"
                          >
                            Approve finding
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* ====================================================
            TAB 2: RESEARCHER PORTAL
            ==================================================== */}
        {activeTab === 'researcher' && (
          <div className="flex flex-col gap-6" id="dashboard-researcher-panel">
            
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5 text-cyber-red" />
              Your Security Disclosures
            </h3>

            {myReports.length === 0 ? (
              <div className="rounded-2xl border border-zinc-900 bg-black/40 py-16 text-center text-cyber-text-sec font-mono text-xs">
                <p>You have not submitted any smart contract security disclosures from this account address.</p>
                <Link to="/bounties" className="mt-4 inline-block rounded-xl bg-red-950/30 border border-cyber-red/30 hover:border-cyber-red px-5 py-2.5 text-xs font-heading font-bold text-white uppercase tracking-wider transition-all">
                  Browse Audit Targets
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {myReports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-2xl border border-zinc-900 bg-[#0c0000]/60 p-5 md:p-6 shadow-md flex flex-col justify-between"
                    id={`my-submission-card-${report.id}`}
                  >
                    <div>
                      
                      <div className="flex justify-between items-start gap-4 border-b border-zinc-950 pb-4">
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono block">REPORT: #{report.id}</span>
                          <h4 className="mt-0.5 font-heading text-lg font-bold text-white tracking-wide">
                            {report.title}
                          </h4>
                          <span className="mt-1 block text-[10px] text-zinc-500 font-heading uppercase">
                            Target: {getBountyName(report.bountyId)}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {getReportStatusBadge(report.status)}
                          {getSeverityBadge(report.severity)}
                        </div>
                      </div>

                      {/* Content Description */}
                      <p className="mt-4 text-xs text-cyber-text-sec leading-relaxed">
                        {report.description}
                      </p>

                      {/* PoC code snippet expand */}
                      <div className="mt-4">
                        <span className="text-[10px] text-zinc-500 font-bold block uppercase mb-1">Cryptographic PoC</span>
                        <pre className="rounded overflow-x-auto bg-black p-2.5 border border-zinc-950 font-mono text-[11px] text-zinc-300">
                          {report.proofOfConcept}
                        </pre>
                      </div>

                    </div>

                    {/* Report Compensation output values */}
                    <div className="mt-6 pt-4 border-t border-zinc-950 flex justify-between items-center bg-black/30 p-2.5 rounded-xl border border-zinc-950">
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase leading-none block">Audited At</span>
                        <span className="text-xs font-number text-zinc-400 block mt-1">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 uppercase leading-none block">Reward Allocation</span>
                        <span className={`text-sm font-number font-black block mt-0.5 ${
                          report.status === ReportStatus.Approved ? 'text-cyber-success' : 'text-zinc-400'
                        }`}>
                          {getPayoutString(report)}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
