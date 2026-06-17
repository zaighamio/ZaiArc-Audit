import React from 'react';
import { Twitter, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-auto border-t border-[rgba(255,0,0,0.15)] bg-[#020000] py-10 shadow-[0_-10px_30px_rgba(255,0,0,0.05)]" id="zaiarc-footer-wrapper">
      
      {/* Red border top glow accent */}
      <div className="absolute top-0 left-1/2 h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-60 shadow-[0_0_15px_rgba(255,0,0,0.8)]"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* Credit Section */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-sm font-heading font-semibold text-white tracking-widest uppercase">
              ZAI<span className="text-cyber-red">ARC</span> AUDIT
            </span>
            <p className="mt-1 text-xs text-cyber-text-sec text-center md:text-left">
              The smart contract audit bounty platform of choice. Security audits made transparent and permissionless.
            </p>
          </div>

          {/* Social connection */}
          <div className="flex flex-col items-center gap-2">
            <a
              href="https://x.com/Zaighamio"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2.5 rounded-full border border-cyber-red/30 bg-red-950/20 px-5 py-2 text-xs font-heading font-bold text-white transition-all duration-300 hover:border-cyber-red hover:bg-red-950/40 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]"
              id="twitter-follow-btn"
            >
              <Twitter className="h-4 w-4 text-cyber-red group-hover:scale-110 transition-transform" />
              <span>Built by Zaigham</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-cyber-silver stroke-[2.5]" />
            </a>
          </div>

          {/* Network tag */}
          <div className="flex flex-col items-center md:items-end font-number">
            <span className="text-[10px] tracking-[0.2em] text-cyber-silver uppercase">
              Mainnet Infrastructure
            </span>
            <span className="text-xs font-bold text-cyber-red uppercase tracking-wider text-glow-red mt-1">
              Powered by Arc Testnet
            </span>
          </div>

        </div>

        {/* Copywrite */}
        <div className="mt-8 border-t border-zinc-900 pt-6 text-center">
          <p className="text-[10px] text-zinc-600 tracking-wider font-sans uppercase">
            &copy; {new Date().getFullYear()} ZaiArc Audit. All rights secured.
          </p>
        </div>

      </div>
    </footer>
  );
};
