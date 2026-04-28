import { motion } from 'framer-motion';
import { ShieldCheck, ShieldX, ShieldAlert, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { MythBusterData } from '../../types';

const VERDICT_CONFIG = {
  TRUE: {
    icon: CheckCircle,
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    badge: 'bg-green-500/20',
    label: '✅ TRUE',
    stamp: '✓ VERIFIED',
    stampColor: 'text-green-400 border-green-500/40',
    shield: ShieldCheck,
  },
  FALSE: {
    icon: XCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    badge: 'bg-red-500/20',
    label: '❌ FALSE',
    stamp: '✗ BUSTED',
    stampColor: 'text-red-400 border-red-500/40',
    shield: ShieldX,
  },
  'PARTIALLY TRUE': {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20',
    label: '⚠️ PARTIALLY TRUE',
    stamp: '~ PARTIAL',
    stampColor: 'text-amber-400 border-amber-500/40',
    shield: ShieldAlert,
  },
};

export function MythBusterWidget({ data }: { data: MythBusterData }) {
  const config = VERDICT_CONFIG[data.verdict] || VERDICT_CONFIG.FALSE;
  const ShieldIcon = config.shield;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-1">
          🔍 Myth Buster
        </h2>
        <p className="text-sm text-white/40">Fact-checked against official ECI information</p>
      </motion.div>

      {/* Claim Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 mb-6"
      >
        <p className="text-xs text-white/30 uppercase font-semibold tracking-wider mb-2">The Claim</p>
        <p className="text-lg text-white/80 font-medium italic leading-relaxed">
          "{data.claim}"
        </p>
      </motion.div>

      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className={`relative ${config.bg} border ${config.border} rounded-2xl p-8 mb-6 overflow-hidden`}
      >
        {/* Stamp overlay */}
        <motion.div
          initial={{ scale: 3, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4, type: 'spring' }}
          className={`absolute top-4 right-4 text-3xl font-display font-black ${config.stampColor} 
                     border-4 rounded-lg px-3 py-1 opacity-20 rotate-[-8deg]`}
        >
          {config.stamp}
        </motion.div>

        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-16 h-16 rounded-2xl ${config.badge} flex items-center justify-center`}>
            <ShieldIcon size={32} className={config.text} />
          </div>
          <div>
            <p className="text-xs text-white/30 uppercase font-semibold tracking-wider mb-1">Verdict</p>
            <p className={`text-2xl font-display font-bold ${config.text}`}>
              {config.label}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel p-6"
      >
        <p className="text-xs text-saffron-400/60 uppercase font-semibold tracking-wider mb-3">
          📋 Official Explanation
        </p>
        <p className="text-sm text-white/70 leading-relaxed">
          {data.explanation}
        </p>
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-[10px] text-white/25 uppercase tracking-wider">
            Source: Election Commission of India (ECI) Official Guidelines
          </p>
        </div>
      </motion.div>
    </div>
  );
}
