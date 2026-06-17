import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { Bounty, Report, Severity, BountyStatus, ReportStatus, PlatformStats, LeaderboardEntry } from '../types';
import {
  getStoredBounties,
  getStoredReports,
  addStoredBounty,
  addStoredReport,
  updateStoredBountyStatus,
  withdrawStoredBountyPool,
  approveStoredReport,
  rejectStoredReport,
  calculatePlatformStats,
  calculateLeaderboard
} from '../utils/store';
import { CONTRACT_ADDRESS, CONTRACT_ABI, USDC_ADDRESS, EURC_ADDRESS, ERC20_ABI } from '../config/web3';

const formatTxError = (err: any): string => {
  if (!err) return 'An unknown transaction error occurred.';
  
  const msg = err.message || String(err);
  
  // If the user explicitly rejected the request in their wallet
  if (err.code === 4001 || /rejected/i.test(msg) || /user rejected/i.test(msg)) {
    return 'Transaction Rejected: The request was declined in your wallet. Please sign the transaction in your wallet to confirm this action.';
  }

  // viem specific shortMessage or details
  if (err.shortMessage) {
    return err.shortMessage;
  }
  if (err.details) {
    return err.details;
  }

  // Strip long traces if visible
  if (msg.includes('Contract Call:') || msg.includes('Request Arguments:')) {
    const lines = msg.split('\n');
    const firstFew = lines[0] || 'The transaction was rejected or failed execution constraints. Please review balances or wallet status.';
    return firstFew;
  }
  return msg;
};

export function useBountyPlatform() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // App-wide environment toggle: 'live' or 'sandbox'
  const [engineMode, setEngineMode] = useState<'sandbox' | 'live'>(() => {
    const saved = localStorage.getItem('zai_engine_mode');
    return (saved === 'live') ? 'live' : 'sandbox';
  });

  // Local state mirrored from store, allowing reactive UI updates
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalBounties: 0,
    totalReports: 0,
    totalUSDCRewarded: 0,
    totalEURCRewarded: 0
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Tx simulation progress states
  const [txSubmitting, setTxSubmitting] = useState(false);
  const [txSuccessHash, setTxSuccessHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Wagmi Write hooks
  const { writeContractAsync } = useWriteContract();

  // Load state
  const reloadData = useCallback(() => {
    const storedBounties = getStoredBounties();
    const storedReports = getStoredReports();
    setBounties(storedBounties);
    setReports(storedReports);
    setPlatformStats(calculatePlatformStats());
    setLeaderboard(calculateLeaderboard());
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Toggle engine mode helper
  const toggleEngineMode = (mode: 'sandbox' | 'live') => {
    setEngineMode(mode);
    localStorage.setItem('zai_engine_mode', mode);
  };

  // Helper to construct a simulated transaction hash
  const generateMockTxHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash;
  };

  // ----------------------------------------------------
  // ACTION 1: CREATE BOUNTY (Two-step ERC20 approve + create)
  // ----------------------------------------------------
  interface CreateBountyParams {
    projectName: string;
    description: string;
    contractAddress: string;
    token: 'USDC' | 'EURC';
    poolAmount: string;
    rewards: {
      low: string;
      medium: string;
      high: string;
      critical: string;
    };
  }

  const createBounty = async (params: CreateBountyParams) => {
    setTxSubmitting(true);
    setTxSuccessHash(null);
    setTxError(null);

    const decimals = 6;
    const totalPoolBig = parseUnits(params.poolAmount, decimals);
    const lowBig = parseUnits(params.rewards.low, decimals);
    const medBig = parseUnits(params.rewards.medium, decimals);
    const highBig = parseUnits(params.rewards.high, decimals);
    const critBig = parseUnits(params.rewards.critical, decimals);
    const tokenAddress = params.token === 'USDC' ? USDC_ADDRESS : EURC_ADDRESS;
    const callerAddress = address || '0xdc66fcf9312b087bd713d52b6f462dfb78f64f5e';

    if (engineMode === 'live' && isConnected && chainId === 5042002) {
      try {
        // Step 1: ERC20 Token Approval
        const approvalTx = await writeContractAsync({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESS, totalPoolBig],
        } as any);

        console.log('Token approval TX submitted:', approvalTx);

        // Step 2: Create Bounty call
        const createTx = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'createBounty',
          args: [
            params.projectName,
            params.description,
            params.contractAddress,
            lowBig,
            medBig,
            highBig,
            critBig,
            tokenAddress,
            totalPoolBig
          ],
        } as any);

        // Add to local state anyway matching the structure
        addStoredBounty({
          projectName: params.projectName,
          description: params.description,
          contractAddress: params.contractAddress,
          rewardLow: lowBig,
          rewardMedium: medBig,
          rewardHigh: highBig,
          rewardCritical: critBig,
          rewardToken: tokenAddress,
          totalPool: totalPoolBig,
          status: BountyStatus.Active,
          creator: callerAddress
        });

        setTxSuccessHash(createTx);
        reloadData();
        setTxSubmitting(false);
        return { success: true, hash: createTx };
      } catch (err: any) {
        console.error('On-chain CreateBounty failed:', err);
        const cleanErr = formatTxError(err);
        setTxError(cleanErr);
        setTxSubmitting(false);
        return { success: false, error: cleanErr };
      }
    } else {
      // ------------------------------------------------
      // SANDBOX SIMULATOR PATH
      // ------------------------------------------------
      return new Promise<{ success: boolean; hash?: string; error?: string }>((resolve) => {
        setTimeout(() => {
          try {
            const added = addStoredBounty({
              projectName: params.projectName,
              description: params.description,
              contractAddress: params.contractAddress,
              rewardLow: lowBig,
              rewardMedium: medBig,
              rewardHigh: highBig,
              rewardCritical: critBig,
              rewardToken: tokenAddress,
              totalPool: totalPoolBig,
              status: BountyStatus.Active,
              creator: callerAddress
            });

            const simulatedHash = generateMockTxHash();
            setTxSuccessHash(simulatedHash);
            reloadData();
            setTxSubmitting(false);
            resolve({ success: true, hash: simulatedHash });
          } catch (e: any) {
            setTxError(e.message || 'Sandbox storage error');
            setTxSubmitting(false);
            resolve({ success: false, error: e.message });
          }
        }, 1200); // realistic tx wait
      });
    }
  };

  // ----------------------------------------------------
  // ACTION 2: SUBMIT AUDIT REPORT
  // ----------------------------------------------------
  interface SubmitReportParams {
    bountyId: number;
    title: string;
    description: string;
    proofOfConcept: string;
    severity: Severity;
  }

  const submitReport = async (params: SubmitReportParams) => {
    setTxSubmitting(true);
    setTxSuccessHash(null);
    setTxError(null);

    const callerAddress = address || '0xf68285C6Fd6782806DfdD67Bc01AAb6C8f7FA8dF'; // Random researcher as fallback

    if (engineMode === 'live' && isConnected && chainId === 5042002) {
      try {
        const tx = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'submitReport',
          args: [
            BigInt(params.bountyId),
            params.title,
            params.description,
            params.proofOfConcept,
            params.severity
          ],
        } as any);

        // Add to local state too
        addStoredReport({
          bountyId: params.bountyId,
          title: params.title,
          description: params.description,
          proofOfConcept: params.proofOfConcept,
          severity: params.severity,
          researcher: callerAddress
        });

        setTxSuccessHash(tx);
        reloadData();
        setTxSubmitting(false);
        return { success: true, hash: tx };
      } catch (err: any) {
        console.error('On-chain SubmitReport failed:', err);
        const cleanErr = formatTxError(err);
        setTxError(cleanErr);
        setTxSubmitting(false);
        return { success: false, error: cleanErr };
      }
    } else {
      // ------------------------------------------------
      // SANDBOX SIMULATOR PATH
      // ------------------------------------------------
      return new Promise<{ success: boolean; hash?: string; error?: string }>((resolve) => {
        setTimeout(() => {
          try {
            const added = addStoredReport({
              bountyId: params.bountyId,
              title: params.title,
              description: params.description,
              proofOfConcept: params.proofOfConcept,
              severity: params.severity,
              researcher: callerAddress
            });

            const simulatedHash = generateMockTxHash();
            setTxSuccessHash(simulatedHash);
            reloadData();
            setTxSubmitting(false);
            resolve({ success: true, hash: simulatedHash });
          } catch (e: any) {
            setTxError(e.message || 'Sandbox storage error');
            setTxSubmitting(false);
            resolve({ success: false, error: e.message });
          }
        }, 1000);
      });
    }
  };

  // ----------------------------------------------------
  // ACTION 3: APPROVE SECURITY REPORT
  // ----------------------------------------------------
  const approveReport = async (reportId: number) => {
    setTxSubmitting(true);
    setTxSuccessHash(null);
    setTxError(null);

    if (engineMode === 'live' && isConnected && chainId === 5042002) {
      try {
        const tx = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'approveReport',
          args: [BigInt(reportId)],
        } as any);

        // Resolve locally for rendering
        approveStoredReport(reportId);
        setTxSuccessHash(tx);
        reloadData();
        setTxSubmitting(false);
        return { success: true, hash: tx };
      } catch (err: any) {
        console.error('On-chain ApproveReport failed:', err);
        const cleanErr = formatTxError(err);
        setTxError(cleanErr);
        setTxSubmitting(false);
        return { success: false, error: cleanErr };
      }
    } else {
      // ------------------------------------------------
      // SANDBOX SIMULATOR PATH
      // ------------------------------------------------
      return new Promise<{ success: boolean; hash?: string; error?: string }>((resolve) => {
        setTimeout(() => {
          const res = approveStoredReport(reportId);
          if (res.success) {
            const simulatedHash = generateMockTxHash();
            setTxSuccessHash(simulatedHash);
            reloadData();
            setTxSubmitting(false);
            resolve({ success: true, hash: simulatedHash });
          } else {
            setTxError('Report could not be approved.');
            setTxSubmitting(false);
            resolve({ success: false, error: 'State update failed.' });
          }
        }, 800);
      });
    }
  };

  // ----------------------------------------------------
  // ACTION 4: REJECT SECURITY REPORT
  // ----------------------------------------------------
  const rejectReport = async (reportId: number) => {
    setTxSubmitting(true);
    setTxSuccessHash(null);
    setTxError(null);

    if (engineMode === 'live' && isConnected && chainId === 5042002) {
      try {
        const tx = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'rejectReport',
          args: [BigInt(reportId)],
        } as any);

        rejectStoredReport(reportId);
        setTxSuccessHash(tx);
        reloadData();
        setTxSubmitting(false);
        return { success: true, hash: tx };
      } catch (err: any) {
        console.error('On-chain RejectReport failed:', err);
        const cleanErr = formatTxError(err);
        setTxError(cleanErr);
        setTxSubmitting(false);
        return { success: false, error: cleanErr };
      }
    } else {
      // ------------------------------------------------
      // SANDBOX SIMULATOR PATH
      // ------------------------------------------------
      return new Promise<{ success: boolean; hash?: string; error?: string }>((resolve) => {
        setTimeout(() => {
          const res = rejectStoredReport(reportId);
          if (res) {
            const simulatedHash = generateMockTxHash();
            setTxSuccessHash(simulatedHash);
            reloadData();
            setTxSubmitting(false);
            resolve({ success: true, hash: simulatedHash });
          } else {
            setTxError('Report could not be rejected.');
            setTxSubmitting(false);
            resolve({ success: false, error: 'State update failed.' });
          }
        }, 800);
      });
    }
  };

  // ----------------------------------------------------
  // ACTION 5: UPDATE BOUNTY STATUS (Active / Paused / Closed)
  // ----------------------------------------------------
  const updateBountyStatusAction = async (bountyId: number, status: BountyStatus) => {
    setTxSubmitting(true);
    setTxSuccessHash(null);
    setTxError(null);

    if (engineMode === 'live' && isConnected && chainId === 5042002) {
      try {
        const tx = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'updateBountyStatus',
          args: [BigInt(bountyId), status],
        } as any);

        updateStoredBountyStatus(bountyId, status);
        setTxSuccessHash(tx);
        reloadData();
        setTxSubmitting(false);
        return { success: true, hash: tx };
      } catch (err: any) {
        console.error('On-chain UpdateBountyStatus failed:', err);
        const cleanErr = formatTxError(err);
        setTxError(cleanErr);
        setTxSubmitting(false);
        return { success: false, error: cleanErr };
      }
    } else {
      // ------------------------------------------------
      // SANDBOX SIMULATOR PATH
      // ------------------------------------------------
      return new Promise<{ success: boolean; hash?: string; error?: string }>((resolve) => {
        setTimeout(() => {
          updateStoredBountyStatus(bountyId, status);
          const simulatedHash = generateMockTxHash();
          setTxSuccessHash(simulatedHash);
          reloadData();
          setTxSubmitting(false);
          resolve({ success: true, hash: simulatedHash });
        }, 600);
      });
    }
  };

  // ----------------------------------------------------
  // ACTION 6: WITHDRAW REMAINING POOL
  // ----------------------------------------------------
  const withdrawRemainingPool = async (bountyId: number) => {
    setTxSubmitting(true);
    setTxSuccessHash(null);
    setTxError(null);

    if (engineMode === 'live' && isConnected && chainId === 5042002) {
      try {
        const tx = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'withdrawRemainingPool',
          args: [BigInt(bountyId)],
        } as any);

        withdrawStoredBountyPool(bountyId);
        setTxSuccessHash(tx);
        reloadData();
        setTxSubmitting(false);
        return { success: true, hash: tx };
      } catch (err: any) {
        console.error('On-chain WithdrawRemainingPool failed:', err);
        const cleanErr = formatTxError(err);
        setTxError(cleanErr);
        setTxSubmitting(false);
        return { success: false, error: cleanErr };
      }
    } else {
      // ------------------------------------------------
      // SANDBOX SIMULATOR PATH
      // ------------------------------------------------
      return new Promise<{ success: boolean; hash?: string; error?: string }>((resolve) => {
        setTimeout(() => {
          withdrawStoredBountyPool(bountyId);
          const simulatedHash = generateMockTxHash();
          setTxSuccessHash(simulatedHash);
          reloadData();
          setTxSubmitting(false);
          resolve({ success: true, hash: simulatedHash });
        }, 1000);
      });
    }
  };

  return {
    engineMode,
    toggleEngineMode,
    bounties,
    reports,
    platformStats,
    leaderboard,
    txSubmitting,
    txSuccessHash,
    txError,
    clearTxState: () => {
      setTxSuccessHash(null);
      setTxError(null);
    },
    createBounty,
    submitReport,
    approveReport,
    rejectReport,
    updateBountyStatus: updateBountyStatusAction,
    withdrawRemainingPool,
    refreshData: reloadData
  };
}
