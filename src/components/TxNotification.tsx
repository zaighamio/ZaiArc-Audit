import React from 'react';
import { ExternalLink, CheckCircle, AlertTriangle, Loader2, X } from 'lucide-react';

interface TxNotificationProps {
  submitting: boolean;
  successHash: string | null;
  error: string | null;
  onClose: () => void;
}

export const TxNotification: React.FC<TxNotificationProps> = ({
  submitting,
  successHash,
  error,
  onClose,
}) => {
  if (!submitting && !successHash && !error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" id="tx-notification-overlay">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyber-red/30 bg-[#0c0000] p-6 shadow-[0_0_50px_rgba(255,0,0,0.25)]">
        
        {/* Futuristic corner grid marks */}
        <div className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-cyber-red"></div>
        <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-cyber-red"></div>
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-cyber-red"></div>
        <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-cyber-red"></div>

        {/* Close Button unless submitting */}
        {!submitting && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-cyber-silver hover:bg-red-950/40 hover:text-white transition-all"
            id="close-notification-btn"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="flex flex-col items-center text-center mt-2">
          {/* Status Icon */}
          {submitting && (
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-950/20">
              <Loader2 className="h-10 w-10 text-cyber-red animate-spin stroke-[2]" />
              <div className="absolute inset-0 rounded-full border border-cyber-red/20 animate-ping"></div>
            </div>
          )}

          {successHash && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/20 border border-cyber-success/30">
              <CheckCircle className="h-10 w-10 text-cyber-success" />
            </div>
          )}

          {error && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-950/20 border border-cyber-red/30">
              <AlertTriangle className="h-10 w-10 text-cyber-red" />
            </div>
          )}

          {/* Heading */}
          <h3 className="mt-5 font-heading text-xl font-bold uppercase tracking-wider text-white">
            {submitting && 'Processing Audit Action'}
            {successHash && 'Broadcasting Succeeded'}
            {error && 'Contract Transaction Aborted'}
          </h3>

          <p className="mt-2 text-sm text-cyber-text-sec px-2 leading-relaxed">
            {submitting && 'Compiling cryptographic execution proof. Please sign the action in your Web3 wallet provider or confirm sandbox deployment.'}
            {successHash && 'Your interaction has been safely mined and committed to the Arc blockchain state.'}
            {error && 'The transaction was rejected or failed execution constraints. Please review balances or wallet status.'}
          </p>

          {/* Error Details */}
          {error && (
            <div className="mt-4 w-full max-h-24 overflow-y-auto rounded-lg bg-black/60 border border-red-950/50 p-2.5 text-left text-xs font-mono text-red-400">
              {error}
            </div>
          )}

          {/* Explorer Link for hashes */}
          {successHash && (
            <div className="mt-5 w-full flex flex-col gap-2">
              <div className="rounded-lg bg-black/60 p-3 border border-emerald-950/50 text-left">
                <span className="text-[10px] font-number tracking-wider text-emerald-400 block uppercase leading-none mb-1">TX Hash Signature</span>
                <span className="text-xs font-mono text-zinc-300 block truncate">{successHash}</span>
              </div>

              <a
                href={`https://testnet.arcscan.app/tx/${successHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-950 to-red-800 border border-cyber-red/30 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-white hover:opacity-90 shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all"
                id="explorer-tx-link"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Verify on ArcScan</span>
              </a>
            </div>
          )}

          {/* Close Action in details */}
          {!submitting && (
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-neutral-900 border border-zinc-800 py-2.5 text-xs font-heading font-medium uppercase tracking-wider text-cyber-silver hover:bg-neutral-800 hover:text-white transition-all"
              id="dismiss-notification-btn"
            >
              Dismiss Interface
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
