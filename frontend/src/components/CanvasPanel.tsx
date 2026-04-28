import { motion, AnimatePresence } from 'framer-motion';
import { MonitorPlay } from 'lucide-react';
import type { CanvasState } from '../types';
import { TimelineWidget } from './widgets/TimelineWidget';
import { BoothSimulatorWidget } from './widgets/BoothSimulatorWidget';
import { EVMExplainerWidget } from './widgets/EVMExplainerWidget';
import { MythBusterWidget } from './widgets/MythBusterWidget';
import { BoothFinderWidget } from './widgets/BoothFinderWidget';
import { MapWidget } from './widgets/MapWidget';
import { CalendarWidget } from './widgets/CalendarWidget';

interface CanvasPanelProps {
  canvas: CanvasState;
}

const WIDGET_COMPONENTS: Record<string, React.FC<{ data: any }>> = {
  timeline: TimelineWidget,
  booth_simulator: BoothSimulatorWidget,
  constituency_map: MapWidget,
  evm_explainer: EVMExplainerWidget,
  myth_buster: MythBusterWidget,
  booth_finder: BoothFinderWidget,
  calendar_push: CalendarWidget,
};

export function CanvasPanel({ canvas }: CanvasPanelProps) {
  const WidgetComponent = canvas.widget ? WIDGET_COMPONENTS[canvas.widget] : null;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <AnimatePresence mode="wait">
        {WidgetComponent ? (
          <motion.div
            key={canvas.widget}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-y-auto p-6 relative z-10 scrollbar-thin"
          >
            <WidgetComponent data={canvas.data} />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-8 relative z-10"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-saffron-500/10 to-ink-500/10 
                            border border-white/[0.06] flex items-center justify-center animate-float">
                <MonitorPlay size={40} className="text-white/20" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-saffron-500/5 to-ink-500/5 rounded-[2rem] blur-2xl" />
            </div>
            <h2 className="text-xl font-display font-semibold text-white/50 mb-2">
              Interactive Canvas
            </h2>
            <p className="text-sm text-white/25 max-w-xs leading-relaxed">
              Ask Chunav Mitra about elections and watch interactive visuals appear here ✨
            </p>

            {/* Floating decorative elements */}
            <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-saffron-500/[0.02] blur-3xl animate-float" />
            <div className="absolute bottom-32 left-16 w-40 h-40 rounded-full bg-ink-500/[0.03] blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
