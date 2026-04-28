import { motion } from 'framer-motion';
import { UserCheck, Fingerprint, Droplets, Monitor, FileCheck, ChevronRight } from 'lucide-react';
import type { BoothSimulatorData } from '../../types';

const STEPS = [
  {
    id: 1,
    title: 'Entry & Queue',
    description: 'Enter the polling station. Look for your name in the voter list displayed outside. Join the queue for your booth.',
    icon: UserCheck,
    officer: 'Presiding Officer',
    detail: 'The Presiding Officer manages the overall polling booth operations.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Identity Verification',
    description: 'Present your Voter ID (EPIC) or any approved photo ID. The polling officer verifies your identity against the electoral roll.',
    icon: Fingerprint,
    officer: 'First Polling Officer',
    detail: 'The First Polling Officer checks your name in the marked copy of the electoral roll.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    id: 3,
    title: 'Ink & Register',
    description: 'Indelible ink is applied to your left index finger. You sign or put a thumbprint in the register (Form 17A).',
    icon: Droplets,
    officer: 'Second Polling Officer',
    detail: 'The Second Polling Officer applies ink and obtains your signature in the register.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 4,
    title: 'EVM Voting',
    description: 'Enter the screened voting compartment. Press the blue button next to your chosen candidate on the Ballot Unit of the EVM.',
    icon: Monitor,
    officer: 'Third Polling Officer',
    detail: 'The Third Polling Officer activates the ballot unit by pressing the Ballot button on the Control Unit.',
    color: 'from-saffron-500 to-saffron-600',
  },
  {
    id: 5,
    title: 'VVPAT Verification',
    description: 'After pressing the button, the VVPAT machine displays a slip with the candidate name & symbol for 7 seconds for verification.',
    icon: FileCheck,
    officer: 'VVPAT Monitor',
    detail: 'The printed slip automatically falls into a sealed box. This helps in audit and verification.',
    color: 'from-green-500 to-green-600',
  },
];

export function BoothSimulatorWidget({ data }: { data: BoothSimulatorData }) {
  const currentStep = data.step || 1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-1">
          🗳️ Polling Booth Simulator
        </h2>
        <p className="text-sm text-white/40">
          Step-by-step guide through the Indian voting process
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="flex items-center gap-1 mb-10 px-4">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className={`
              w-full h-2 rounded-full transition-all duration-500
              ${step.id <= currentStep ? 'bg-gradient-to-r ' + step.color : 'bg-white/10'}
            `} />
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-white/20 mx-1 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isPast = step.id < currentStep;
          const isHighlighted = data.highlight_officer && step.officer.toLowerCase().includes(data.highlight_officer.toLowerCase());

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`
                glass-panel p-5 transition-all duration-300
                ${isActive ? 'ring-2 ring-saffron-500/50 bg-saffron-500/[0.08] scale-[1.01]' : ''}
                ${isPast ? 'opacity-60' : ''}
                ${isHighlighted ? 'ring-2 ring-amber-400/60' : ''}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  bg-gradient-to-br ${step.color} shadow-lg
                  ${isActive ? 'animate-pulse-glow' : ''}
                `}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white/30 uppercase">Step {step.id}</span>
                    {isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-400 font-semibold uppercase tracking-wider">
                        Current
                      </span>
                    )}
                    {isPast && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold uppercase tracking-wider">
                        Done ✓
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  
                  {(isActive || isHighlighted) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 rounded-lg bg-white/5 border border-white/[0.06]"
                    >
                      <p className="text-xs text-white/40 mb-0.5 uppercase font-semibold">
                        👤 {step.officer}
                      </p>
                      <p className="text-xs text-white/60">{step.detail}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
