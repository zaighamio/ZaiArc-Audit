import React from 'react';
import { useBountyPlatform } from '../hooks/useBountyPlatform';
import { OWNER_ADDRESS, USDC_ADDRESS } from '../config/web3';
import { useAccount } from 'wagmi';
import { ShieldCheck, AlertTriangle, KeySquare, HardHat, FileText, Database, Layers, Coins } from 'lucide-react';
import { BountyStatus, ReportStatus, Severity } from '../types';

export const Admin: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { bounties, reports, platformStats, approveReport, rejectReport } = useBountyPlatform();

  // Validate owner address permissions
  const isOwner = address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  const getBountyStatusText = (status: BountyStatus) => {
    switch (status) {
      case BountyStatus.Active: return 'Active';
      case BountyStatus.Paused: return 'Paused';
      case BountyStatus.Closed: return 'Closed';
    }
  };

  const getReportStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.Pending: return <span className="text-[10px] bg-yellow-950/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-900/30 uppercase">PENDING</span>;
      case ReportStatus.Approved: return <span className="text-[10px] bg-emerald-950/20 text-[#00FF88] px-2 py-0.5 rounded border border-emerald-900/30 uppercase">APPROVED</span>;
      case ReportStatus.Rejected: return <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded border border-zinc-800 uppercase">REJECTED</span>;
    }
  };

  const getSeverityText = (sev: Severity) => {
    switch (sev) {
      case Severity.Low: return 'Low';
      case Severity.Medium: return 'Medium';
      case Severity.High: return 'High';
      case Severity.Critical: return 'Critical';
    }
  };

  if (!isOwner) {
    return (
      <div className="relative z-10 mx-auto max-w-xl px-4 py-24 text-center" id="admin-access-denied">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-950/20 border border-cyber-red/30">
          <AlertTriangle className="h-10 w-10 text-cyber-red animate-bounce" />
        </div>
        
        <h2 className="mt-6 font-heading text-2xl font-bold uppercase tracking-wider text-white">
          ACCESS DECLAIMED
        </h2>
        
        <p className="mt-3 text-sm text-cyber-text-sec leading-relaxed">
          The registry operator console is locked cryptographically to owner wallet signature address:
        </p>

        <div className="mt-4 rounded-xl bg-black/80 border border-zinc-950 p-3 font-mono text-xs text-red-400">
          {OWNER_ADDRESS}
        </div>

        {/* Demo simulator help tip */}
        <div className="mt-10 rounded-2xl border border-dashed border-red-950/30 bg-[#0d0000]/20 p-5 text-left">
          <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <KeySquare className="h-4.5 w-4.5 text-cyber-accent" />
            VIRTUAL TEST RUN (DEV ACCESS DETECTED)
          </h4>
          <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
            To view, review, or verify this protected Admin console in your test browser workspace, please go to the <b className="text-white hover:underline"><a href="/dashboard">Dashboard</a></b> and select the <b>"Simulate Creator Wallet"</b> persona. Since the administrator address and principal creator are mapped to the same signature wallet, selecting that simulator will automatically authorize full access to this developer workspace!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="admin-page-container">
      
      {/* Title */}
      <div className="border-b border-zinc-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-cyber-accent" />
            CONTRACT OPERATOR CONSOLE
          </h1>
          <p className="mt-1 text-xs text-cyber-text-sec">
            System admin dashboard. Oversee global contract creations, escrow pools locked, and handle pending finding disputes.
          </p>
        </div>

        <span className="text-[10px] bg-red-950 border border-cyber-red text-white py-1 px-3 rounded-full font-number tracking-wider uppercase leading-none">
          OWNER AUTHORIZED
        </span>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 font-number mb-10" id="admin-stats-grid">
        
        {/* Card 1 */}
        <div className="rounded-2xl border border-zinc-950 bg-[#0c0000]/40 p-5">
          <span className="text-[10px] text-zinc-500 uppercase font-heading font-medium tracking-widest block">Core Scopes Deployed</span>
          <span className="text-2xl font-black text-white block mt-1">{platformStats.totalBounties}</span>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-zinc-950 bg-[#0c0000]/40 p-5">
          <span className="text-[10px] text-zinc-500 uppercase font-heading font-medium tracking-widest block">Global Disclosures Received</span>
          <span className="text-2xl font-black text-white block mt-1">{platformStats.totalReports}</span>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-zinc-950 bg-[#0c0000]/40 p-5">
          <span className="text-[10px] text-zinc-500 uppercase font-heading font-medium tracking-widest block">Paid Out Cumulative USDC</span>
          <span className="text-2xl font-black text-[#00FF88] block mt-1">
            {platformStats.totalUSDCRewarded.toLocaleString()} <span className="text-xs font-sans text-zinc-500">USDC</span>
          </span>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-zinc-950 bg-[#0c0000]/40 p-5">
          <span className="text-[10px] text-zinc-500 uppercase font-heading font-medium tracking-widest block">Paid Out Cumulative EURC</span>
          <span className="text-2xl font-black text-[#00BFFF] block mt-1">
            {platformStats.totalEURCRewarded.toLocaleString()} <span className="text-xs font-sans text-zinc-500">EURC</span>
          </span>
        </div>

      </div>

      <div className="flex flex-col gap-10">
        
        {/* TABLE 1: GLOBAL CONTRACT CHECKS OVERVIEW */}
        <div className="rounded-2xl border border-zinc-900 bg-cyber-surf/40 p-6 shadow-md" id="admin-contracts-overview">
          
          <div className="flex items-center gap-2 border-b border-zinc-950 pb-3 mb-4">
            <Layers className="h-5 w-5 text-cyber-red" />
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
              System Core Campaigns Ledger
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" id="admin-all-bounties-table">
              <thead className="bg-[#0c0000] text-[10px] font-heading font-semibold text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Project Name</th>
                  <th className="p-3">Target Address</th>
                  <th className="p-3">Manager Wallet</th>
                  <th className="p-3">Locked Pool</th>
                  <th className="p-3 text-right">Escrow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-950 font-sans text-zinc-300">
                {bounties.map((b) => {
                  const isUS = b.rewardToken.toLowerCase() === USDC_ADDRESS.toLowerCase();
                  return (
                    <tr key={b.id} className="hover:bg-red-950/5 transition-colors">
                      <td className="p-3 font-number font-bold text-cyber-red">#{b.id}</td>
                      <td className="p-3 font-heading font-bold text-white text-sm">{b.projectName}</td>
                      <td className="p-3 font-mono">{b.contractAddress}</td>
                      <td className="p-3 font-mono">{b.creator}</td>
                      <td className="p-3 font-number font-bold text-white">
                        {(Number(b.totalPool) / 1e6).toLocaleString()} {isUS ? 'USDC' : 'EURC'}
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-[9px] bg-neutral-900 border border-zinc-800 text-zinc-400 font-bold uppercase py-0.5 px-2 rounded">
                          {getBountyStatusText(b.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* TABLE 2: GLOBAL DISCLOSURE FINDINGS LOGGER */}
        <div className="rounded-2xl border border-zinc-900 bg-cyber-surf/40 p-6 shadow-md" id="admin-submissions-log">
          
          <div className="flex items-center gap-2 border-b border-zinc-950 pb-3 mb-4">
            <FileText className="h-5 w-5 text-cyber-red" />
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
              Cryptographic Security Disclosures
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" id="admin-all-reports-table">
              <thead className="bg-[#0c0000] text-[10px] font-heading font-semibold text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Scope ID</th>
                  <th className="p-3">Vulnerability Title</th>
                  <th className="p-3">Audit Persona</th>
                  <th className="p-3 text-center">Threat Level</th>
                  <th className="p-3 text-right">Auditor status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-950 font-sans text-zinc-300">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-red-950/5 transition-colors">
                    <td className="p-3 font-number font-bold text-cyber-silver">#{r.id}</td>
                    <td className="p-3 font-number font-medium">Campaign #{r.bountyId}</td>
                    <td className="p-3 font-heading font-medium text-white">{r.title}</td>
                    <td className="p-3 font-mono">{r.researcher}</td>
                    <td className="p-3 text-center font-bold">
                      {getSeverityText(r.severity)}
                    </td>
                    <td className="p-3 text-right">
                      {getReportStatusBadge(r.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
