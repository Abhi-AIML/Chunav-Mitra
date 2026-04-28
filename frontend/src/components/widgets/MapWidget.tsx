import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import type { ConstituencyMapData } from '../../types';

// Simplified India map SVG paths for major states
const INDIA_STATES = [
  { id: 'JK', name: 'Jammu & Kashmir', path: 'M160,30 L180,25 L195,35 L190,55 L175,60 L160,50Z', phase: 5 },
  { id: 'HP', name: 'Himachal Pradesh', path: 'M175,60 L195,55 L200,70 L185,75Z', phase: 7 },
  { id: 'PB', name: 'Punjab', path: 'M155,65 L175,60 L180,80 L160,85Z', phase: 7 },
  { id: 'HR', name: 'Haryana', path: 'M160,85 L180,80 L185,100 L165,105Z', phase: 6 },
  { id: 'DL', name: 'Delhi', path: 'M172,92 L178,90 L180,96 L174,98Z', phase: 6 },
  { id: 'RJ', name: 'Rajasthan', path: 'M110,90 L160,85 L165,140 L100,145Z', phase: 1 },
  { id: 'UP', name: 'Uttar Pradesh', path: 'M180,80 L250,75 L260,130 L190,135 L185,100Z', phase: 1 },
  { id: 'GJ', name: 'Gujarat', path: 'M60,130 L110,125 L105,185 L55,180Z', phase: 3 },
  { id: 'MP', name: 'Madhya Pradesh', path: 'M110,130 L200,125 L195,175 L105,180Z', phase: 3 },
  { id: 'MH', name: 'Maharashtra', path: 'M80,180 L195,175 L190,230 L75,235Z', phase: 2 },
  { id: 'KA', name: 'Karnataka', path: 'M95,235 L155,230 L150,290 L90,295Z', phase: 2 },
  { id: 'KL', name: 'Kerala', path: 'M105,295 L125,290 L120,340 L100,345Z', phase: 2 },
  { id: 'TN', name: 'Tamil Nadu', path: 'M125,290 L180,285 L175,340 L120,345Z', phase: 1 },
  { id: 'AP', name: 'Andhra Pradesh', path: 'M140,230 L220,225 L215,285 L135,290Z', phase: 4 },
  { id: 'TG', name: 'Telangana', path: 'M145,200 L215,195 L220,230 L150,235Z', phase: 4 },
  { id: 'OD', name: 'Odisha', path: 'M225,180 L275,175 L280,225 L230,230Z', phase: 5 },
  { id: 'WB', name: 'West Bengal', path: 'M265,130 L290,125 L295,210 L270,215Z', phase: 7 },
  { id: 'BR', name: 'Bihar', path: 'M250,100 L295,95 L300,135 L255,140Z', phase: 1 },
];

const PHASE_COLORS = [
  '#FF9933', '#4c6ef5', '#138808', '#e64980',
  '#fab005', '#20c997', '#7950f2',
];

export function MapWidget({ data }: { data: ConstituencyMapData }) {
  const mode = data.mode || 'phases';
  const highlightPhase = data.highlight_phase || 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-1">
          🗺️ {mode === 'phases' ? 'Election Phase Map' : 'Constituency Map'}
        </h2>
        <p className="text-sm text-white/40">
          {mode === 'phases'
            ? 'India\'s general election is held in 7 phases'
            : `Constituency: ${data.constituency_name || 'N/A'} | PIN: ${data.pin_code || 'N/A'}`}
        </p>
      </motion.div>

      {/* Phase Legend */}
      {mode === 'phases' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                ${highlightPhase === i + 1 || highlightPhase === 0
                  ? 'opacity-100 scale-100'
                  : 'opacity-30 scale-95'}`}
              style={{ backgroundColor: PHASE_COLORS[i] + '20', color: PHASE_COLORS[i], border: `1px solid ${PHASE_COLORS[i]}40` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PHASE_COLORS[i] }} />
              Phase {i + 1}
            </div>
          ))}
        </motion.div>
      )}

      {/* Map SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="glass-panel p-8"
      >
        <svg viewBox="30 10 300 360" className="w-full max-h-[500px] mx-auto">
          {INDIA_STATES.map((state) => {
            const isHighlighted = highlightPhase === 0 || state.phase === highlightPhase;
            const color = PHASE_COLORS[state.phase - 1];
            return (
              <g key={state.id}>
                <motion.path
                  d={state.path}
                  fill={isHighlighted ? color + '40' : 'rgba(255,255,255,0.03)'}
                  stroke={isHighlighted ? color : 'rgba(255,255,255,0.08)'}
                  strokeWidth={isHighlighted ? 1.5 : 0.5}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHighlighted ? 1 : 0.3 }}
                  transition={{ delay: 0.1 * state.phase }}
                  className="cursor-pointer hover:brightness-125 transition-all duration-200"
                />
                {isHighlighted && (
                  <text
                    x={state.path.match(/M(\d+)/)?.[1] ? parseInt(state.path.match(/M(\d+)/)?.[1] || '0') + 15 : 0}
                    y={state.path.match(/M\d+,(\d+)/)?.[1] ? parseInt(state.path.match(/M\d+,(\d+)/)?.[1] || '0') + 20 : 0}
                    fill={color}
                    fontSize="6"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {state.id}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Info Cards */}
      {mode === 'constituency' && data.constituency_name && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 glass-panel p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center">
            <Map size={24} className="text-saffron-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{data.constituency_name}</p>
            <p className="text-xs text-white/40">PIN: {data.pin_code}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
