import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBountyPlatform } from '../hooks/useBountyPlatform';
import { Severity, ReportStatus, BountyStatus } from '../types';
import { OWNER_ADDRESS, USDC_ADDRESS } from '../config/web3';
import { useAccount } from 'wagmi';
import { TxNotification } from '../components/TxNotification';
import { AlertCircle, Code, ShieldCheck, HelpCircle, Terminal, FileText, ChevronRight, User, CornerDownRight, Check, XCircle } from 'lucide-react';

export const BountyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address } = useAccount();

  const {
    bounties,
    reports,
    txSubmitting,
    txSuccessHash,
    txError,
    clearTxState,
    submitReport,
    approveReport,
    rejectReport
  } = useBountyPlatform();

  // Find bounty
  const bountyIdNum = Number(id);
  const bounty = bounties.find((b) => b.id === bountyIdNum);

  // Submitting Report States
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportPoc, setReportPoc] = useState('');
  const [reportSeverity, setReportSeverity] = useState<Severity>(Severity.Medium);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  if (!bounty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center relative z-10">
        <AlertCircle className="h-16 w-16 text-cyber-red mx-auto mb-4 stroke-[1.5]" />
        <h2 className="font-heading text-2xl font-bold uppercase text-white">Audit Target Not Found</h2>
        <p className="mt-2 text-cyber-text-sec">The scope ID you requested does not exist or has been removed from on-chain registries.</p>
        <Link to="/bounties" className="mt-6 inline-block rounded-xl bg-neutral-900 border border-zinc-800 px-6 py-3 text-sm font-heading font-bold text-white uppercase tracking-wider hover:border-cyber-red transition-all">
          Back to Bounties
        </Link>
      </div>
    );
  }

  const isUSDC = bounty.rewardToken.toLowerCase() === USDC_ADDRESS.toLowerCase();
  const tokenSymbol = isUSDC ? 'USDC' : 'EURC';

  // Check if current user is Creator of this bounty or Platform Admin
  const isCreator = address?.toLowerCase() === bounty.creator.toLowerCase();
  const isAdmin = address?.toLowerCase() === OWNER_ADDRESS.toLowerCase();
  const canReviewReports = isCreator || isAdmin;

  // Filter reports specifically for this bounty
  const bountyReports = reports.filter((r) => r.bountyId === bounty.id);

  // Handle Form Submission
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDesc.trim() || !reportPoc.trim()) return;

    const result = await submitReport({
      bountyId: bounty.id,
      title: reportTitle,
      description: reportDesc,
      proofOfConcept: reportPoc,
      severity: reportSeverity
    });

    if (result.success) {
      setIsSubmitSuccess(true);
      // reset form
      setReportTitle('');
      setReportDesc('');
      setReportPoc('');
      setReportSeverity(Severity.Medium);
    }
  };

  const getSeverityName = (sev: Severity) => {
    switch (sev) {
      case Severity.Low: return 'Low';
      case Severity.Medium: return 'Medium';
      case Severity.High: return 'High';
      case Severity.Critical: return 'Critical';
    }
  };

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case Severity.Low: return 'text-sky-400 border-sky-950/40 bg-sky-950/10';
      case Severity.Medium: return 'text-yellow-400 border-yellow-950/40 bg-yellow-950/10';
      case Severity.High: return 'text-orange-500 border-orange-950/40 bg-orange-950/10';
      case Severity.Critical: return 'text-red-500 border-red-950/40 bg-red-950/10';
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="bounty-detail-container">
      
      {/* Dynamic transaction notifications overlays */}
      <TxNotification
        submitting={txSubmitting}
        successHash={txSuccessHash}
        error={txError}
        onClose={clearTxState}
      />

      {/* Nav breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs font-heading font-semibold text-zinc-500 uppercase tracking-widest">
        <Link to="/bounties" className="hover:text-white transition-colors">Bounties</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white truncate max-w-[200px]">{bounty.projectName}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* ==============================================
            LEFT BLOCK - SCOPE DETAILS (7 Columns)
            ============================================== */}
        <div className="lg:col-span-7 flex flex-col gap-6" id="bounty-detail-left-pane">
          
          {/* Target main card */}
          <div className="rounded-2xl border border-zinc-900 bg-[#0c0000]/60 p-6 md:p-8 shadow-md">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-950 pb-5">
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-white tracking-wide">
                  {bounty.projectName}
                </h1>
                <div className="mt-2 flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                  <Terminal className="h-3.5 w-3.5 text-cyber-red" />
                  <span className="select-all">{bounty.contractAddress}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                {bounty.status === BountyStatus.Active && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-950 bg-emerald-950/20 px-2.5 py-1 text-xs font-semibold text-[#00FF88] shadow-[0_0_8px_rgba(0,255,136,0.15)] uppercase">
                    ACTIVE POOL
                  </span>
                )}
                {bounty.status === BountyStatus.Paused && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-950 bg-amber-950/20 px-2.5 py-1 text-xs font-semibold text-[#FFD700] uppercase">
                    POOL PAUSED
                  </span>
                )}
                {bounty.status === BountyStatus.Closed && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-zinc-500 uppercase">
                    POOL TERMINATED
                  </span>
                )}
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="mt-6">
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Audit Overview</h3>
              <p className="mt-2.5 text-sm text-cyber-text-sec leading-relaxed whitespace-pre-wrap">
                {bounty.description}
              </p>
            </div>

            {/* Locked Capital statistics */}
            <div className="mt-8 rounded-2xl bg-black/40 border border-zinc-950 p-4 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-medium">Escrow Registry Account</span>
                <span className="text-xs font-mono text-zinc-400 truncate max-w-[240px] block mt-1">
                  0xd0C6439C3...c317ee8e
                </span>
              </div>

              <div className="flex gap-8">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Active Escalation Pool</span>
                  <span className="text-xl font-number font-black text-white block mt-0.5">
                    {(Number(bounty.totalPool) / 1e6).toLocaleString()}{' '}
                    <span className="text-xs text-cyber-red font-sans">{tokenSymbol}</span>
                  </span>
                </div>
                <div className="border-l border-zinc-900 pl-8">
                  <span className="text-[10px] text-zinc-500 uppercase block">Total Findings</span>
                  <span className="text-xl font-number font-bold text-zinc-300 block mt-0.5">
                    {bounty.reportsCount} <span className="text-xs font-sans text-zinc-500">bugs</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Severity Matrix Table list card */}
          <div className="rounded-2xl border border-zinc-900 bg-black/40 p-6 shadow-md">
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-4">
              Payout Calibration Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" id="payout-ranges-table">
                <thead className="bg-[#0c0000] text-[11px] font-heading font-semibold text-zinc-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Severity Rating</th>
                    <th className="p-3">Simulated Scope</th>
                    <th className="p-3 text-right">Award Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-950 font-sans text-zinc-300">
                  
                  {/* Critical */}
                  <tr className="hover:bg-red-950/5 transition-colors">
                    <td className="p-3 font-semibold text-red-500 flex items-center gap-1.5 uppercase font-heading tracking-wide">
                      <span className="h-2 w-2 rounded-full bg-red-600"></span>
                      Critical
                    </td>
                    <td className="p-3 text-xs text-cyber-text-sec leading-tight">
                      Arbitrary state manipulation, complete protocol drain, oracle liquidation manipulation, private keys compromised.
                    </td>
                    <td className="p-3 text-right font-number font-extrabold text-white text-base">
                      {(Number(bounty.rewardCritical) / 1e6).toLocaleString()} <span className="text-xs font-sans text-cyber-red">{tokenSymbol}</span>
                    </td>
                  </tr>

                  {/* High */}
                  <tr className="hover:bg-orange-950/5 transition-colors">
                    <td className="p-3 font-semibold text-orange-400 flex items-center gap-1.5 uppercase font-heading tracking-wide">
                      <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                      High
                    </td>
                    <td className="p-3 text-xs text-cyber-text-sec leading-tight">
                      DoS of core actions, loss of partial user balances, reentrancy resulting in pool depletion under edge inputs.
                    </td>
                    <td className="p-3 text-right font-number font-extrabold text-white">
                      {(Number(bounty.rewardHigh) / 1e6).toLocaleString()} <span className="text-xs font-sans text-cyber-accent">{tokenSymbol}</span>
                    </td>
                  </tr>

                  {/* Medium */}
                  <tr className="hover:bg-yellow-950/5 transition-colors">
                    <td className="p-3 font-semibold text-yellow-400 flex items-center gap-1.5 uppercase font-heading tracking-wide">
                      <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                      Medium
                    </td>
                    <td className="p-3 text-xs text-cyber-text-sec leading-tight">
                      Calculations accuracy rounding issues, unvalidated admin thresholds, missing check validations.
                    </td>
                    <td className="p-3 text-right font-number font-extrabold text-zinc-300">
                      {(Number(bounty.rewardMedium) / 1e6).toLocaleString()} <span className="text-xs font-sans text-[#FFD700]">{tokenSymbol}</span>
                    </td>
                  </tr>

                  {/* Low */}
                  <tr className="hover:bg-blue-950/5 transition-colors">
                    <td className="p-3 font-semibold text-blue-400 flex items-center gap-1.5 uppercase font-heading tracking-wide">
                      <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      Low
                    </td>
                    <td className="p-3 text-xs text-cyber-text-sec leading-tight">
                      Inefficient gas loops, documentation typos, missing event emissions, obsolete imports.
                    </td>
                    <td className="p-3 text-right font-number font-extrabold text-zinc-300">
                      {(Number(bounty.rewardLow) / 1e6).toLocaleString()} <span className="text-xs font-sans text-[#00BFFF]">{tokenSymbol}</span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* ==============================================
              CREATOR REVIEWS DRAWER (IF AUTHORIZED)
              ============================================== */}
          {canReviewReports && (
            <div className="rounded-2xl border border-cyber-red/25 bg-[#120101] p-6 shadow-md" id="bounty-sub-reviews-panel">
              <div className="flex items-center gap-2 border-b border-red-950 pb-4 mb-4">
                <ShieldCheck className="h-5 w-5 text-cyber-red animate-pulse" />
                <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
                  Audit Findings Review Desk
                </h3>
              </div>

              {bountyReports.length === 0 ? (
                <p className="text-xs font-mono text-zinc-500 text-center py-6">
                  No vulnerabilities have been reported for this repository yet.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {bountyReports.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-zinc-900 bg-black/50 p-4"
                      id={`submitted-findings-item-${item.id}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className={`inline-block text-[9px] font-bold border rounded px-1.5 py-0.5 leading-none uppercase ${getSeverityColor(item.severity)}`}>
                            {getSeverityName(item.severity)} severity
                          </span>
                          <h4 className="mt-1 text-sm font-heading font-bold text-white tracking-wide">
                            {item.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                            <User className="h-3 w-3" />
                            <span>Auditor: {item.researcher}</span>
                          </div>
                        </div>

                        {/* Report Status */}
                        <div>
                          {item.status === ReportStatus.Pending && (
                            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950/25 border border-yellow-900/40 px-2 py-0.5 rounded uppercase">
                              PENDING REVIEW
                            </span>
                          )}
                          {item.status === ReportStatus.Approved && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/25 border border-emerald-900/40 px-2 py-0.5 rounded uppercase">
                              APPROVED / COMPENSATED
                            </span>
                          )}
                          {item.status === ReportStatus.Rejected && (
                            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded uppercase border border-zinc-800">
                              REJECTED
                            </span>
                          )}
                        </div>

                      </div>

                      {/* Content Description */}
                      <p className="mt-2.5 text-xs text-cyber-text-sec leading-relaxed">
                        {item.description}
                      </p>

                      {/* Code block PoC */}
                      <div className="mt-3">
                        <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-wider mb-1">
                          <Code className="h-3 w-3" />
                          Proof Of Concept:
                        </span>
                        <pre className="rounded overflow-x-auto bg-black border border-zinc-900 p-2.5 text-[11px] font-mono text-zinc-300">
                          {item.proofOfConcept}
                        </pre>
                      </div>

                      {/* Actions for Pending reviews */}
                      {item.status === ReportStatus.Pending && (
                        <div className="mt-4 pt-3 border-t border-zinc-950 flex justify-end gap-2">
                          <button
                            onClick={() => rejectReport(item.id)}
                            className="flex items-center gap-1 rounded bg-zinc-950 border border-zinc-800 hover:border-red-500 hover:bg-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase text-zinc-400 hover:text-white transition-all cursor-pointer"
                            id={`report-reject-btn-${item.id}`}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject Findings
                          </button>

                          <button
                            onClick={() => approveReport(item.id)}
                            className="flex items-center gap-1 rounded bg-red-950/30 border border-cyber-red/40 hover:border-cyber-red hover:bg-red-950/60 px-3 py-1.5 text-xs font-semibold uppercase text-white transition-all cursor-pointer shadow-sm"
                            id={`report-approve-btn-${item.id}`}
                          >
                            <Check className="h-3.5 w-3.5 text-cyber-accent animate-pulse" />
                            Approve & Compensate
                          </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* ==============================================
            RIGHT BLOCK - SUBMIT DECK FORM (5 Columns)
            ============================================== */}
        <div className="lg:col-span-5" id="bounty-submit-report-pane">
          
          <div className="sticky top-24 rounded-2xl border border-zinc-900 bg-cyber-surf p-6 shadow-lg">
            
            <div className="flex items-center gap-2 border-b border-zinc-950 pb-4 mb-5">
              <FileText className="h-5 w-5 text-cyber-red" />
              <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
                Vulnerability Report Desk
              </h3>
            </div>

            {/* Check if bounty is closed / paused */}
            {bounty.status !== BountyStatus.Active ? (
              <div className="rounded-xl border border-amber-950 bg-amber-950/10 p-4 text-center text-xs text-cyber-warning leading-relaxed whitespace-pre-wrap">
                Submissions has been currently locked for this target. The audit escrow pool is paused or closed.
              </div>
            ) : isSubmitSuccess ? (
              <div className="rounded-xl border border-emerald-950 bg-emerald-950/10 p-5 text-center">
                <ShieldCheck className="h-10 w-10 text-cyber-success mx-auto mb-2" />
                <h4 className="font-heading font-bold text-white uppercase tracking-wide">Submission Succeeded!</h4>
                <p className="mt-1 text-xs text-cyber-text-sec leading-relaxed">
                  The findings has been committed to local and smart contract registers. The pool creator will review the report shortly.
                </p>
                <button
                  onClick={() => setIsSubmitSuccess(false)}
                  className="mt-4 rounded-lg bg-zinc-950 hover:bg-neutral-900 border border-zinc-800 px-4 py-2 text-xs font-heading font-semibold text-white uppercase tracking-wider transition-all"
                  id="submit-another-findings-btn"
                >
                  File Another Finding
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="flex flex-col gap-4" id="submit-report-form">
                
                {/* Title */}
                <div>
                  <label htmlFor="title-input" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Vulnerability Short Title *
                  </label>
                  <input
                    id="title-input"
                    type="text"
                    required
                    placeholder="e.g., Integer Overflow in transferFee calculation"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-black/60 p-3 text-sm text-white focus:border-cyber-red/50 focus:outline-none"
                  />
                </div>

                {/* Severity */}
                <div>
                  <label htmlFor="severity-input" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Estimated Vulnerability Severity *
                  </label>
                  <select
                    id="severity-input"
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-900 bg-black/60 p-3 text-sm text-white focus:border-cyber-red/50 focus:outline-none"
                  >
                    <option value={Severity.Low}>Low Severity (Gas Optimization, Typos)</option>
                    <option value={Severity.Medium}>Medium Severity (Logic checks, missing inputs)</option>
                    <option value={Severity.High}>High Severity (DoS risk / partial balance overflow)</option>
                    <option value={Severity.Critical}>Critical Severity (Direct depletion / exploit risk)</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description-input" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Functional Vulnerability Description *
                  </label>
                  <textarea
                    id="description-input"
                    required
                    rows={4}
                    placeholder="Explain the theoretical exploit flow. How does it affect state calculations? Be descriptive and clear."
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-black/60 p-3 text-sm text-white focus:border-cyber-red/50 focus:outline-none focus:ring-0 leading-relaxed font-sans"
                  />
                </div>

                {/* Proof of Concept */}
                <div>
                  <label htmlFor="poc-input" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Proof Of Concept (Solidity Snippet) *
                  </label>
                  <textarea
                    id="poc-input"
                    required
                    rows={5}
                    placeholder={`// Provide Solidity or JS proof of exploit \nfunction exploit() public {\n  vault.withdraw(1337);\n}`}
                    value={reportPoc}
                    onChange={(e) => setReportPoc(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-black/65 p-3 text-xs text-white focus:border-cyber-red/50 focus:outline-none font-mono leading-relaxed"
                  />
                </div>

                {/* Disclaimer */}
                <div className="rounded-xl border border-red-950/20 bg-red-950/5 p-3 text-[10px] text-zinc-500 leading-relaxed">
                  <strong>Ethical disclosure notice:</strong> Replaying exploits on public mainnets is strictly forbidden. Submissions here are registered transparently in state databases matching the audited contract scope.
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-900 py-3 text-sm font-heading font-bold uppercase tracking-wider text-white border border-cyber-red/30 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                  id="submit-vulnerability-finding-btn"
                >
                  Publish Security Finding
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
