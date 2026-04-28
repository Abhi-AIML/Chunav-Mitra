import { motion } from 'framer-motion';
import { Cpu, Monitor, Printer, Zap } from 'lucide-react';
import type { EVMExplainerData } from '../../types';

const PARTS = [
  {
    id: 'ballot_unit',
    title: 'Ballot Unit',
    description: 'The voter-facing unit with blue buttons next to each candidate\'s name and symbol. Placed inside the voting compartment for secret voting.',
    icon: Monitor,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Blue voting buttons for each candidate',
      'Red LED lights next to each button',
      'Party name & symbol display',
      'Max 16 candidates per unit (can daisy-chain)',
    ],
    position: 'left',
  },
  {
    id: 'control_unit',
    title: 'Control Unit',
    description: 'Operated by the Presiding Officer. It has the "Ballot" button that must be pressed before each vote to enable the ballot unit.',
    icon: Cpu,
    color: 'from-violet-500 to-violet-600',
    features: [
      '"Ballot" button to authorize each vote',
      'Total votes counter display',
      '"Close" button to end polling',
      '"Result" button (sealed until counting day)',
    ],
    position: 'center',
  },
  {
    id: 'vvpat',
    title: 'VVPAT Machine',
    description: 'Voter Verifiable Paper Audit Trail — Prints a slip showing the candidate voted for. Visible for 7 seconds before dropping into a sealed box.',
    icon: Printer,
    color: 'from-green-500 to-green-600',
    features: [
      'Thermal printer for paper slips',
      '7-second viewing window',
      'Sealed drop box for slips',
      'Used for verification in counting disputes',
    ],
    position: 'right',
  },
];

export function EVMExplainerWidget({ data }: { data: EVMExplainerData }) {
  const highlighted = data.highlight_part || 'all';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          🖥️ EVM + VVPAT Explainer
        </h2>
        <p className="text-sm text-white/40 max-w-md mx-auto">
          Understand every component of India's Electronic Voting Machine system
        </p>
      </motion.div>

      {/* Connection Diagram */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-4 mb-10"
      >
        {PARTS.map((part, i) => (
          <div key={part.id} className="flex items-center">
            <div className={`
              px-4 py-2 rounded-lg text-xs font-semibold
              ${highlighted === part.id || highlighted === 'all'
                ? `bg-gradient-to-r ${part.color} text-white shadow-lg`
                : 'bg-white/5 text-white/30'}
              transition-all duration-300
            `}>
              {part.title}
            </div>
            {i < PARTS.length - 1 && (
              <div className="flex items-center mx-2">
                <div className="w-8 h-px bg-white/20" />
                <Zap size={12} className="text-saffron-400 mx-1" />
                <div className="w-8 h-px bg-white/20" />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PARTS.map((part, i) => {
          const Icon = part.icon;
          const isActive = highlighted === part.id || highlighted === 'all';

          return (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className={`
                glass-panel p-6 transition-all duration-300
                ${isActive ? 'ring-2 ring-white/20 bg-white/[0.08]' : 'opacity-40'}
              `}
            >
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                bg-gradient-to-br ${part.color} shadow-xl
                ${isActive ? 'animate-float' : ''}
              `}>
                <Icon size={28} className="text-white" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{part.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-4">{part.description}</p>

              <div className="space-y-2">
                {part.features.map((f, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isActive ? 1 : 0.3, x: 0 }}
                    transition={{ delay: 0.3 + j * 0.08 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-saffron-400 mt-0.5">•</span>
                    <span className="text-xs text-white/60">{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-center"
      >
        <p className="text-xs text-green-400/80">
          🔒 EVMs are standalone machines with no network connectivity. They use one-time programmable chips 
          manufactured by BEL & ECIL under strict ECI oversight.
        </p>
      </motion.div>
    </div>
  );
}
