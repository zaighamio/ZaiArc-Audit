import React, { useState } from 'react';
import { useBountyPlatform } from '../hooks/useBountyPlatform';
import { TxNotification } from '../components/TxNotification';
import { USDC_ADDRESS, EURC_ADDRESS, CONTRACT_ADDRESS } from '../config/web3';
import { Coins, FileCode, Landmark, ShieldCheck, ChevronRight, CheckCircle2, ArrowRight, Hourglass } from 'lucide-react';

export const CreateBounty: React.FC = () => {
  const {
    createBounty,
    txSubmitting,
    txSuccessHash,
    txError,
    clearTxState,
  } = useBountyPlatform();

  // Inputs State
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenType, setTokenType] = useState<'USDC' | 'EURC'>('USDC');
  const [totalPool, setTotalPool] = useState('10000');
  
  // Severities individual ranges
  const [rewardLow, setRewardLow] = useState('200');
  const [rewardMed, setRewardMed] = useState('800');
  const [rewardHigh, setRewardHigh] = useState('2500');
  const [rewardCrit, setRewardCrit] = useState('6500');

  // Step Status Wizard states
  const [creationStep, setCreationStep] = useState<1 | 2 | 3>(1); // 1 = Entry/Approval, 2 = Deploy, 3 = Completed
  const [allowanceApproved, setAllowanceApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [newBountyIdHash, setNewBountyIdHash] = useState<string | null>(null);

  // Validate address input
  const isAddressValid = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  // Step 1 Flow trigger (Allowance Approval)
  const handleApproveAllowance = () => {
    if (!projectName || !description || !isAddressValid(contractAddress) || !totalPool) return;
    
    setIsApproving(true);
    // Simulate approval duration
    setTimeout(() => {
      setAllowanceApproved(true);
      setIsApproving(false);
      setCreationStep(2); // move to step 2 automatically
    }, 1200);
  };

  // Step 2 Flow trigger (Create Contract Entry)
  const handleCreateBountyAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowanceApproved) return;

    const result = await createBounty({
      projectName,
      description,
      contractAddress,
      token: tokenType,
      poolAmount: totalPool,
      rewards: {
        low: rewardLow,
        medium: rewardMed,
        high: rewardHigh,
        critical: rewardCrit,
      },
    });

    if (result.success) {
      setNewBountyIdHash((result as any).hash || 'Simulated deployment on block #5042002');
      setCreationStep(3); // Completed!
    }
  };

  // Reset form helper
  const handleResetForm = () => {
    setProjectName('');
    setDescription('');
    setContractAddress('');
    setTotalPool('10000');
    setRewardLow('200');
    setRewardMed('800');
    setRewardHigh('2500');
    setRewardCrit('6500');
    setAllowanceApproved(false);
    setCreationStep(1);
    setNewBountyIdHash(null);
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="create-bounty-page-container">
      
      {/* Transaction Overlay notifications */}
      <TxNotification
        submitting={txSubmitting}
        successHash={txSuccessHash}
        error={txError}
        onClose={clearTxState}
      />

      {/* Title */}
      <div className="border-b border-zinc-900 pb-6 mb-8">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
          Deploy Security Audit Campaign
        </h1>
        <p className="mt-1 text-sm text-cyber-text-sec">
          Escrow USDC or EURC to summon elite ethical hackers. Lock capital securely, specify threat tiers, and audit your blockchain code base on-chain.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* ==============================================
            LEFT PANEL - THE ESCROW SETTINGS FORM (7 Columns)
            ============================================== */}
        <div className="lg:col-span-7" id="create-bounty-form-pane">
          {creationStep === 3 ? (
            <div className="rounded-2xl border border-emerald-950 bg-emerald-950/10 p-8 text-center" id="create-success-panel">
              <CheckCircle2 className="h-16 w-16 text-cyber-success mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wider">Campaign Deployed!</h2>
              <p className="mt-2 text-cyber-text-sec text-sm leading-relaxed max-w-md mx-auto">
                Your smart contract audit program has been successfully compiled and deployed on Arc Testnet. Global research entities can now inspect your scopes and submit security reviews.
              </p>

              <div className="mt-6 rounded-xl bg-black/60 p-4 border border-zinc-900 text-left max-w-md mx-auto">
                <span className="text-[10px] font-number text-emerald-400 block uppercase mb-1">Contract Entry Transaction Hash</span>
                <span className="text-xs font-mono text-zinc-300 block truncate leading-none select-all">{newBountyIdHash}</span>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={handleResetForm}
                  className="rounded-xl border border-zinc-850 bg-black/40 px-6 py-3 text-xs font-heading font-bold text-white uppercase tracking-wider hover:border-cyber-red transition-all"
                  id="reset-form-btn"
                >
                  Create Another Scope
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-red-900/20 bg-[#0F0000] p-6 md:p-8 shadow-md">
              
              <form onSubmit={handleCreateBountyAction} className="flex flex-col gap-5">
                
                {/* 1. Project metrics */}
                <h3 className="font-heading text-base font-bold text-cyber-red uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCode className="h-4.5 w-4.5" />
                  Campaign Parameters
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bounty-project-name" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Project Or Suite Name *
                    </label>
                    <input
                      id="bounty-project-name"
                      type="text"
                      required
                      disabled={creationStep === 2}
                      placeholder="e.g., Uniswap v4 Position Hook"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-900 bg-black/60 p-3 text-sm text-white focus:border-cyber-red/50 focus:outline-none disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label htmlFor="bounty-contract-address" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Target Solidity Address (0x...) *
                    </label>
                    <input
                      id="bounty-contract-address"
                      type="text"
                      required
                      disabled={creationStep === 2}
                      placeholder="0x3c2b8A07A3E5f73CDadfe32811aAb2fF4a0BaA1E"
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      className={`w-full rounded-xl border p-3 text-sm text-white focus:outline-none disabled:opacity-40 ${
                        contractAddress && !isAddressValid(contractAddress)
                          ? 'border-cyber-red bg-red-950/5'
                          : 'border-zinc-900 bg-black/60 focus:border-cyber-red/50'
                      }`}
                    />
                    {contractAddress && !isAddressValid(contractAddress) && (
                      <span className="text-[10px] text-cyber-red block mt-1">Please enter a valid 20-byte Hex address</span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="bounty-description" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    System Core Scope Description *
                  </label>
                  <textarea
                    id="bounty-description"
                    required
                    disabled={creationStep === 2}
                    rows={4}
                    placeholder="Specify compiling directives, repository structures, and exact threat profiles you wish security auditors to focus on."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-black/60 p-3 text-sm text-white focus:border-cyber-red/50 focus:outline-none disabled:opacity-40 leading-relaxed font-sans"
                  />
                </div>

                {/* 2. Escrow Assets Details */}
                <h3 className="font-heading text-base font-bold text-cyber-red uppercase tracking-wider mt-4 mb-2 flex items-center gap-1.5 border-t border-zinc-900 pt-5">
                  <Landmark className="h-4.5 w-4.5" />
                  Rewards & Escrow Escalate
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="bounty-token-type" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Escrow Stablecoin *
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={creationStep === 2}
                        onClick={() => setTokenType('USDC')}
                        className={`flex-1 rounded-xl p-3 text-xs font-heading font-bold tracking-wider uppercase border transition-all ${
                          tokenType === 'USDC'
                            ? 'bg-red-950/40 border-cyber-red text-white shadow-[0_0_8px_rgba(255,0,0,0.2)]'
                            : 'bg-black/60 border-zinc-900 text-cyber-text-sec hover:border-zinc-800'
                        }`}
                        id="token-select-usdc"
                      >
                        USDC
                      </button>
                      <button
                        type="button"
                        disabled={creationStep === 2}
                        onClick={() => setTokenType('EURC')}
                        className={`flex-1 rounded-xl p-3 text-xs font-heading font-bold tracking-wider uppercase border transition-all ${
                          tokenType === 'EURC'
                            ? 'bg-red-950/40 border-cyber-red text-white shadow-[0_0_8px_rgba(255,0,0,0.2)]'
                            : 'bg-black/60 border-zinc-900 text-cyber-text-sec hover:border-zinc-800'
                        }`}
                        id="token-select-eurc"
                      >
                        EURC
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="bounty-pool-amount" className="block text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Total Allocated Escrow Deposit Balance ({tokenType}) *
                    </label>
                    <input
                      id="bounty-pool-amount"
                      type="number"
                      required
                      disabled={creationStep === 2}
                      placeholder="e.g., 20000"
                      value={totalPool}
                      onChange={(e) => setTotalPool(e.target.value)}
                      className="w-full rounded-xl border border-zinc-900 bg-black/60 p-3 text-sm text-white focus:border-cyber-red/50 focus:outline-none disabled:opacity-40"
                    />
                  </div>
                </div>

                {/* Individual payout levels */}
                <span className="text-[11px] font-heading font-bold text-zinc-500 uppercase tracking-widest mt-2 block">Define Severity Reward Matrix</span>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-number">
                  
                  {/* Crit */}
                  <div>
                    <label htmlFor="payout-critical" className="block text-[10px] text-red-500 font-bold uppercase tracking-wider mb-1">Critical Tier</label>
                    <input
                      id="payout-critical"
                      type="number"
                      required
                      disabled={creationStep === 2}
                      value={rewardCrit}
                      onChange={(e) => setRewardCrit(e.target.value)}
                      className="w-full rounded-xl border border-zinc-900 bg-black/60 p-2.5 text-xs text-white focus:border-red-500 focus:outline-none disabled:opacity-40"
                    />
                  </div>

                  {/* High */}
                  <div>
                    <label htmlFor="payout-high" className="block text-[10px] text-orange-400 font-bold uppercase tracking-wider mb-1">High Tier</label>
                    <input
                      id="payout-high"
                      type="number"
                      required
                      disabled={creationStep === 2}
                      value={rewardHigh}
                      onChange={(e) => setRewardHigh(e.target.value)}
                      className="w-full rounded-xl border border-zinc-900 bg-black/60 p-2.5 text-xs text-white focus:border-orange-500 focus:outline-none disabled:opacity-40"
                    />
                  </div>

                  {/* Medium */}
                  <div>
                    <label htmlFor="payout-medium" className="block text-[10px] text-yellow-400 font-bold uppercase tracking-wider mb-1">Medium Tier</label>
                    <input
                      id="payout-medium"
                      type="number"
                      required
                      disabled={creationStep === 2}
                      value={rewardMed}
                      onChange={(e) => setRewardMed(e.target.value)}
                      className="w-full rounded-xl border border-zinc-900 bg-black/60 p-2.5 text-xs text-white focus:border-yellow-500 focus:outline-none disabled:opacity-40"
                    />
                  </div>

                  {/* Low */}
                  <div>
                    <label htmlFor="payout-low" className="block text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Low Tier</label>
                    <input
                      id="payout-low"
                      type="number"
                      required
                      disabled={creationStep === 2}
                      value={rewardLow}
                      onChange={(e) => setRewardLow(e.target.value)}
                      className="w-full rounded-xl border border-zinc-900 bg-black/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none disabled:opacity-40"
                    />
                  </div>

                </div>

                {/* Progress bar and wizard actions based on step */}
                <div className="mt-8 pt-5 border-t border-zinc-950 flex flex-col gap-4">
                  {creationStep === 1 ? (
                    <button
                      type="button"
                      onClick={handleApproveAllowance}
                      disabled={!projectName || !description || !isAddressValid(contractAddress) || !totalPool || isApproving}
                      className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-neutral-900 border border-zinc-805 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none py-3 text-sm font-heading font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
                      id="wizard-approve-action-btn"
                    >
                      {isApproving ? (
                        <>
                          <Hourglass className="h-4 w-4 text-cyber-red animate-spin" />
                          <span>Allowing Spender Authorization...</span>
                        </>
                      ) : (
                        <>
                          <span>Step 1: Approve Escrow Allowance</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-heading font-bold uppercase">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Step 1 Confirmed (Allowance authorized)</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-900 py-3.5 text-sm font-heading font-bold uppercase tracking-wider text-white border border-cyber-red/30 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(255,0,0,0.2)] cursor-pointer"
                        id="wizard-commit-action-btn"
                      >
                        Step 2: Commit Escrow Deployment
                      </button>
                    </div>
                  )}
                </div>

              </form>

            </div>
          )}
        </div>

        {/* ==============================================
            RIGHT PANEL - THE LEDGER PREVIEW (5 Columns)
            ============================================== */}
        <div className="lg:col-span-5" id="create-bounty-preview-pane">
          <div className="sticky top-24 rounded-2xl border border-zinc-900 bg-black/40 p-6 shadow-md" id="escrow-ledger-preview">
            
            <span className="text-[10px] font-number text-zinc-500 uppercase tracking-widest block mb-4">
              COMPILE ESCROW LEDGER PREVIEW
            </span>

            {/* Campaign Summary Mockup Cards */}
            <div className="rounded-xl border border-dashed border-red-950/50 bg-[#0d0000]/30 p-5 relative overflow-hidden">
              
              <div className="absolute top-2 right-2 text-cyber-red/10 font-black text-4xl select-none uppercase font-heading">
                PREVIEW
              </div>

              <div className="flex justify-between items-start border-b border-zinc-950 pb-3">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase leading-none block">Target Identification</span>
                  <span className="text-sm font-heading font-bold text-white block mt-1">
                    {projectName || 'DEFI PROTOCOL TARGET'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 uppercase leading-none block">Escrow Asset</span>
                  <span className="text-xs font-number font-black text-cyber-red uppercase block mt-1">
                    {tokenType}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 font-sans text-xs">
                
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Scope Address:</span>
                  <span className="font-mono text-[10px] truncate max-w-[180px] text-white">
                    {contractAddress || '0xnotdeployed'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-400">
                  <span>Approval Authorization Spender:</span>
                  <span className="font-mono text-[10px] text-zinc-500">
                    {CONTRACT_ADDRESS}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-950 pt-3">
                  <span className="text-zinc-400 font-bold uppercase text-[10px]">Escrow Funding Pool:</span>
                  <span className="font-number font-black text-white text-base">
                    {totalPool ? Number(totalPool).toLocaleString() : '0'} <span className="text-xs text-cyber-red font-sans">{tokenType}</span>
                  </span>
                </div>

              </div>

            </div>

            {/* Steps explanation checklist dashboard */}
            <div className="mt-6 flex flex-col gap-3 font-sans text-xs text-cyber-text-sec">
              <span className="text-[10px] font-heading font-bold text-zinc-500 uppercase tracking-widest">
                Deployment Protocol Steps
              </span>

              {/* Box 1 */}
              <div className={`p-3 rounded-xl border flex gap-3 transition-opacity duration-300 ${
                creationStep === 1 ? 'border-cyber-red/35 bg-red-950/5 opacity-100' : 'border-zinc-950 bg-black/25 opacity-60'
              }`}>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-white">
                  1
                </div>
                <div>
                  <span className="font-heading font-bold text-white block uppercase">ALLOWANCE ALLOCATION ESROW</span>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Authorize the ZaiArc Audit escrow smart contracts spending allowance on your behalf for the required funding amount.
                  </p>
                </div>
              </div>

              {/* Box 2 */}
              <div className={`p-3 rounded-xl border flex gap-3 transition-opacity duration-300 ${
                creationStep === 2 ? 'border-cyber-red/35 bg-red-950/5 opacity-100' : 'border-zinc-950 bg-black/25 opacity-60'
              }`}>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-white">
                  2
                </div>
                <div>
                  <span className="font-heading font-bold text-white block uppercase">CAMPAIGN DEPLOY COMMIT</span>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Broadcast the deployment of your campaign scoping details on the blockchain ledger, anchoring the reward rules directly.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
