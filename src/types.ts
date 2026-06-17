export enum Severity {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export enum BountyStatus {
  Active = 0,
  Paused = 1,
  Closed = 2,
}

export enum ReportStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export interface Bounty {
  id: number;
  projectName: string;
  description: string;
  contractAddress: string;
  rewardLow: bigint;
  rewardMedium: bigint;
  rewardHigh: bigint;
  rewardCritical: bigint;
  rewardToken: string; // token address
  totalPool: bigint;
  status: BountyStatus;
  creator: string; // address
  reportsCount: number;
}

export interface Report {
  id: number;
  bountyId: number;
  title: string;
  description: string;
  proofOfConcept: string;
  severity: Severity;
  researcher: string; // address
  status: ReportStatus;
  createdAt: string;
}

export interface PlatformStats {
  totalBounties: number;
  totalReports: number;
  totalUSDCRewarded: number;
  totalEURCRewarded: number;
}

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  totalUSDCEarned: number;
  totalEURCEarned: number;
  reportsApproved: number;
}
