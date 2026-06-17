import { Bounty, Report, Severity, BountyStatus, ReportStatus, PlatformStats, LeaderboardEntry } from '../types';
import { USDC_ADDRESS, EURC_ADDRESS } from '../config/web3';

// ----------------------------------------------------
// DEFAULT BOUNTIES (Premium quality placeholder-less content)
// ----------------------------------------------------
const DEFAULT_BOUNTIES: Bounty[] = [
  {
    id: 1,
    projectName: 'Aave V3 Arc Gas Optimizer',
    description: 'Gas-optimized implementation of Aave V3 supply-and-borrow modules customized for Arc network. We are seeking gas-efficiency improvements and memory footprint analysis under peak network loads.',
    contractAddress: '0x3c2b8A07A3E5f73CDadfe32811aAb2fF4a0BaA1E',
    rewardLow: 500_000000n, // 6 decimals
    rewardMedium: 2500_000000n,
    rewardHigh: 7500_000000n,
    rewardCritical: 20000_000000n,
    rewardToken: USDC_ADDRESS,
    totalPool: 45000_000000n,
    status: BountyStatus.Active,
    creator: '0xdc66fcf9312b087bd713d52b6f462dfb78f64f5e',
    reportsCount: 1
  },
  {
    id: 2,
    projectName: 'Curve Arc StableSwap V2',
    description: 'Stable-asset liquidity pools utilising the Stableswap invariant, designed to allow low-slippage trading of USDC and EURC on Arc Testnet. Audit focuses on reentrancy in token transfers and oracle manipulation.',
    contractAddress: '0x99A8b7CC13a48Df2129e0618035D3EFCDf9CD45B',
    rewardLow: 1000_000000n,
    rewardMedium: 4000_000000n,
    rewardHigh: 15000_000000n,
    rewardCritical: 50000_000000n,
    rewardToken: EURC_ADDRESS,
    totalPool: 120000_000000n,
    status: BountyStatus.Active,
    creator: '0xaB1C2d3e4F5G6h7I8j9K0L1M2N3O4P5Q6R7S8T9U',
    reportsCount: 1
  },
  {
    id: 3,
    projectName: 'ZaiArc Yield Vault Controller',
    description: 'Dynamic compounding yield-aggregation vaults that balance collateral ratios and route deposits autonomously to interest-bearing Arc Testnet primitives. Review loop safety of asset withdrawals.',
    contractAddress: '0xd0C6439C34aC0588D3b5786C3E087e06c317ee8e',
    rewardLow: 300_000000n,
    rewardMedium: 1500_000000n,
    rewardHigh: 5000_000000n,
    rewardCritical: 15000_000000n,
    rewardToken: USDC_ADDRESS,
    totalPool: 35000_000000n,
    status: BountyStatus.Active,
    creator: '0xdc66fcf9312b087bd713d52b6f462dfb78f64f5e',
    reportsCount: 2
  },
  {
    id: 4,
    projectName: 'Arc Bridge Hub Protocol',
    description: 'Validator signature check and consensus aggregation smart contracts designed to securely bridge ERC-20 assets between mainnet Ethereum and Arc L2. We want strict inspection of validators threshold checks.',
    contractAddress: '0x2a21CDbf7453Be08Dd0BCbF42EE370428FAbaA18',
    rewardLow: 2000_000000n,
    rewardMedium: 8000_000000n,
    rewardHigh: 25000_000000n,
    rewardCritical: 80000_000000n,
    rewardToken: USDC_ADDRESS,
    totalPool: 200000_000000n,
    status: BountyStatus.Active,
    creator: '0x5C6Fd6782806DfdD67Bc01AAb6C8f7FA8dF8aA1C',
    reportsCount: 1
  },
  {
    id: 5,
    projectName: 'GMX Custom Perpetual Router',
    description: 'Advanced margin trading and custom liquidation routers built over GMX-style v2 structures on Arc. Inspect reward distribution and accurate funding rate updates under high leverage.',
    contractAddress: '0xeE7F678BaF8286BC01704AAb6C7e3F8FaBAA1211',
    rewardLow: 800_000000n,
    rewardMedium: 3000_000000n,
    rewardHigh: 10000_000000n,
    rewardCritical: 35000_000000n,
    rewardToken: EURC_ADDRESS,
    totalPool: 60000_000000n,
    status: BountyStatus.Active,
    creator: '0x99283fFA8286BC01704A7a6C8e3E3F8FaBAAcde',
    reportsCount: 1
  },
  {
    id: 6,
    projectName: 'Lido Staking Derivative Wrapper',
    description: 'Wrapper contract to allow yield-bearing Lido assets to be minted as collateral tokens with responsive autocompounding loops. Looking for mint-rate calculations and boundary rounding errors.',
    contractAddress: '0x1c31278BaF8286BC01704AAb6C7e3F3FaBAAbCdE',
    rewardLow: 400_000000n,
    rewardMedium: 1800_000000n,
    rewardHigh: 6000_000000n,
    rewardCritical: 18000_000000n,
    rewardToken: USDC_ADDRESS,
    totalPool: 25000_000000n,
    status: BountyStatus.Paused,
    creator: '0x8892A4aB1C2d3e4F5G6h7I8j9K0L1M2N3O4P5Q6R',
    reportsCount: 0
  },
];

// ----------------------------------------------------
// DEFAULT REPORTS
// ----------------------------------------------------
const DEFAULT_REPORTS: Report[] = [
  {
    id: 1,
    bountyId: 3, // ZaiArc Yield Vault
    title: 'Precision loss in compounded shares burn mechanism',
    description: 'In `withdrawShares`, dividing raw share counts before token decimals alignment leads to slight rounding errors, letting attackers slowly drain fractions of USDC over frequent micro-transactions.',
    proofOfConcept: `// Code snippet showing vulnerability:
function withdrawShares(uint256 shares) public {
    uint256 value = (shares / totalShares) * totalAssets(); // ❌ Dividing before multiplication
    ERC20(asset).transfer(msg.sender, value);
}`,
    severity: Severity.Medium,
    researcher: '0x370428FAbaA1821CDbf7453Be08Dd0BCbF44CE06',
    status: ReportStatus.Pending,
    createdAt: '2026-06-15T14:32:00Z',
  },
  {
    id: 2,
    bountyId: 3, // ZaiArc Yield Vault
    title: 'Missing input validation in collateral ratio updates',
    description: 'Admin-level collateral ratio adjustments do not require a threshold bound check. An accidental admin update of 0% breaks rewards calculations, bricking subsequent deposits.',
    proofOfConcept: `// Set collateral to any value
function setRatio(uint256 _newRatio) external onlyOwner {
    currentRatio = _newRatio; // ❌ No check if _newRatio > 0 && _newRatio < 100
}`,
    severity: Severity.Low,
    researcher: '0xdc66fcf9312b087bd713d52b6f462dfb78f64f5e',
    status: ReportStatus.Rejected,
    createdAt: '2026-06-14T09:15:00Z',
  },
  {
    id: 3,
    bountyId: 1, // Aave gas optimizer
    title: 'Reentrancy vulnerability in supply collateral loop',
    description: 'Using `call` to send ETH fallback token refunds before checking internal balances inside custom gas loop lets reentrant audits deplete the vault balance completely.',
    proofOfConcept: `// Exploit reentrancy
function executeGasOptimizerRefund() public {
    (bool s,) = msg.sender.call{value: refundAmount}(""); // ❌ External call before state update
    require(s);
    userGasBalance[msg.sender] = 0;
}`,
    severity: Severity.Critical,
    researcher: '0xf68285C6Fd6782806DfdD67Bc01AAb6C8f7FA8dF',
    status: ReportStatus.Approved,
    createdAt: '2026-06-10T18:44:00Z',
  },
  {
    id: 4,
    bountyId: 2, // Curve Swap
    title: 'Manipulable flash loan pricing utilizing internal swap balance',
    description: 'Calculating the spot reserve price directly from `token.balanceOf(address(this))` allows flashloans to temporarily depress asset valuations, leading to highly profitable exploit trades.',
    proofOfConcept: `// Vulnerable price feed calculation
function getPrice() public view returns (uint256) {
    return tokenA.balanceOf(address(this)) * 1e6 / tokenB.balanceOf(address(this)); // ❌ Flawed view feed
}`,
    severity: Severity.High,
    researcher: '0x99283fFA8286BC01704A7a6C8e3E3F8FaBAAcde',
    status: ReportStatus.Approved,
    createdAt: '2026-06-12T11:20:00Z',
  }
];

// Helper to get initial stored data or set defaults
export function initLocalStorageStore() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('zai_bounties')) {
    localStorage.setItem('zai_bounties', JSON.stringify(DEFAULT_BOUNTIES, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  }

  if (!localStorage.getItem('zai_reports')) {
    localStorage.setItem('zai_reports', JSON.stringify(DEFAULT_REPORTS));
  }
}

// Read bounties from local persistence
export function getStoredBounties(): Bounty[] {
  initLocalStorageStore();
  const data = localStorage.getItem('zai_bounties');
  if (!data) return [];
  try {
    const raw = JSON.parse(data);
    return raw.map((b: any) => ({
      ...b,
      rewardLow: BigInt(b.rewardLow),
      rewardMedium: BigInt(b.rewardMedium),
      rewardHigh: BigInt(b.rewardHigh),
      rewardCritical: BigInt(b.rewardCritical),
      totalPool: BigInt(b.totalPool),
      status: Number(b.status),
      reportsCount: Number(b.reportsCount || 0)
    }));
  } catch (e) {
    console.error('Failed to parse stored bounties:', e);
    return [];
  }
}

// Read reports from local persistence
export function getStoredReports(): Report[] {
  initLocalStorageStore();
  const data = localStorage.getItem('zai_reports');
  if (!data) return [];
  try {
    return JSON.parse(data).map((r: any) => ({
      ...r,
      bountyId: Number(r.bountyId),
      severity: Number(r.severity),
      status: Number(r.status)
    }));
  } catch (e) {
    console.error('Failed to parse stored reports:', e);
    return [];
  }
}

// Write bounties back to local persistence
export function saveStoredBounties(bounties: Bounty[]) {
  localStorage.setItem('zai_bounties', JSON.stringify(bounties, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

// Write reports back to local persistence
export function saveStoredReports(reports: Report[]) {
  localStorage.setItem('zai_reports', JSON.stringify(reports));
}

// Add a bounty
export function addStoredBounty(bounty: Omit<Bounty, 'id' | 'reportsCount'>): Bounty {
  const bounties = getStoredBounties();
  const nextId = bounties.length > 0 ? Math.max(...bounties.map(b => b.id)) + 1 : 1;
  const newBounty: Bounty = {
    ...bounty,
    id: nextId,
    reportsCount: 0
  };
  bounties.push(newBounty);
  saveStoredBounties(bounties);
  return newBounty;
}

// Add a report
export function addStoredReport(report: Omit<Report, 'id' | 'createdAt' | 'status'>): Report {
  const reports = getStoredReports();
  const nextId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
  const newReport: Report = {
    ...report,
    id: nextId,
    status: ReportStatus.Pending,
    createdAt: new Date().toISOString()
  };
  reports.push(newReport);
  saveStoredReports(reports);

  // Update report count in the associated bounty
  const bounties = getStoredBounties();
  const bountyIndex = bounties.findIndex(b => b.id === report.bountyId);
  if (bountyIndex !== -1) {
    bounties[bountyIndex].reportsCount += 1;
    saveStoredBounties(bounties);
  }

  return newReport;
}

// Update bounty status
export function updateStoredBountyStatus(bountyId: number, status: BountyStatus) {
  const bounties = getStoredBounties();
  const bountyIndex = bounties.findIndex(b => b.id === bountyId);
  if (bountyIndex !== -1) {
    bounties[bountyIndex].status = status;
    saveStoredBounties(bounties);
  }
}

// Withdraw from pool (Set totalPool to 0)
export function withdrawStoredBountyPool(bountyId: number) {
  const bounties = getStoredBounties();
  const bountyIndex = bounties.findIndex(b => b.id === bountyId);
  if (bountyIndex !== -1) {
    bounties[bountyIndex].totalPool = 0n;
    saveStoredBounties(bounties);
  }
}

// Approve report (Set status to Approved, withdraw reward amount from totalPool)
export function approveStoredReport(reportId: number): { success: boolean; amount?: bigint; token?: string } {
  const reports = getStoredReports();
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return { success: false };

  const report = reports[reportIndex];
  if (report.status !== ReportStatus.Pending) return { success: false };

  report.status = ReportStatus.Approved;
  saveStoredReports(reports);

  // Deduct payout from corresponding bounty pool
  const bounties = getStoredBounties();
  const bountyIndex = bounties.findIndex(b => b.id === report.bountyId);
  if (bountyIndex !== -1) {
    const bounty = bounties[bountyIndex];
    let payout = 0n;
    switch (report.severity) {
      case Severity.Low: payout = bounty.rewardLow; break;
      case Severity.Medium: payout = bounty.rewardMedium; break;
      case Severity.High: payout = bounty.rewardHigh; break;
      case Severity.Critical: payout = bounty.rewardCritical; break;
    }

    if (bounty.totalPool >= payout) {
      bounty.totalPool -= payout;
    } else {
      bounty.totalPool = 0n;
    }
    saveStoredBounties(bounties);
    return { success: true, amount: payout, token: bounty.rewardToken };
  }

  return { success: true };
}

// Reject report (Set status to Rejected)
export function rejectStoredReport(reportId: number): boolean {
  const reports = getStoredReports();
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return false;

  const report = reports[reportIndex];
  if (report.status !== ReportStatus.Pending) return false;

  report.status = ReportStatus.Rejected;
  saveStoredReports(reports);
  return true;
}

// Calculate Stats
export function calculatePlatformStats(): PlatformStats {
  const bounties = getStoredBounties();
  const reports = getStoredReports();

  let totalUSDCRewarded = 0;
  let totalEURCRewarded = 0;

  // Let's count rewards for all approved reports based on bounty payment definition
  reports.forEach(report => {
    if (report.status === ReportStatus.Approved) {
      const associatedBounty = bounties.find(b => b.id === report.bountyId);
      if (associatedBounty) {
        let payout = 0;
        switch (report.severity) {
          case Severity.Low: payout = Number(associatedBounty.rewardLow) / 1000000; break;
          case Severity.Medium: payout = Number(associatedBounty.rewardMedium) / 1000000; break;
          case Severity.High: payout = Number(associatedBounty.rewardHigh) / 1000000; break;
          case Severity.Critical: payout = Number(associatedBounty.rewardCritical) / 1000000; break;
        }

        if (associatedBounty.rewardToken === USDC_ADDRESS) {
          totalUSDCRewarded += payout;
        } else {
          totalEURCRewarded += payout;
        }
      }
    }
  });

  return {
    totalBounties: bounties.length,
    totalReports: reports.length,
    totalUSDCRewarded,
    totalEURCRewarded
  };
}

// Calculate Leaderboard
export function calculateLeaderboard(): LeaderboardEntry[] {
  const bounties = getStoredBounties();
  const reports = getStoredReports();

  // Map researchers to their totals
  const map = new Map<string, { usdc: number; eurc: number; count: number }>();

  reports.forEach(report => {
    if (report.status === ReportStatus.Approved) {
      const associatedBounty = bounties.find(b => b.id === report.bountyId);
      if (associatedBounty) {
        let payout = 0;
        switch (report.severity) {
          case Severity.Low: payout = Number(associatedBounty.rewardLow) / 1000000; break;
          case Severity.Medium: payout = Number(associatedBounty.rewardMedium) / 1000000; break;
          case Severity.High: payout = Number(associatedBounty.rewardHigh) / 1000000; break;
          case Severity.Critical: payout = Number(associatedBounty.rewardCritical) / 1000000; break;
        }

        const researcher = report.researcher;
        const current = map.get(researcher) || { usdc: 0, eurc: 0, count: 0 };
        
        if (associatedBounty.rewardToken === USDC_ADDRESS) {
          current.usdc += payout;
        } else {
          current.eurc += payout;
        }
        current.count += 1;
        map.set(researcher, current);
      }
    }
  });

  // Convert to array
  const entries: LeaderboardEntry[] = [];
  map.forEach((value, key) => {
    entries.push({
      rank: 0,
      wallet: key,
      totalUSDCEarned: value.usdc,
      totalEURCEarned: value.eurc,
      reportsApproved: value.count
    });
  });

  // Sort by highest combined earnings or highest single earnings
  entries.sort((a, b) => {
    const totalA = a.totalUSDCEarned + a.totalEURCEarned * 1.1; // adjust with theoretical exchange rate
    const totalB = b.totalUSDCEarned + b.totalEURCEarned * 1.1;
    return totalB - totalA;
  });

  // Assign ranks
  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
}
