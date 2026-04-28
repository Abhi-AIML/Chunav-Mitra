import { motion } from 'framer-motion';
import { CalendarPlus, CheckCircle } from 'lucide-react';
import type { CalendarPushData } from '../../types';

export function CalendarWidget({ data }: { data: CalendarPushData }) {
  const events = data.events || [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-1">
          📅 Election Calendar
        </h2>
        <p className="text-sm text-white/40">
          Important election dates ready to add to your calendar
        </p>
      </motion.div>

      {/* Events */}
      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-5 flex items-center gap-4 hover:bg-white/[0.08] transition-colors duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-ink-600/30 border border-ink-500/20 flex flex-col items-center justify-center shrink-0">
              <span className="text-lg font-bold text-ink-400 leading-none">
                {event.date?.split('-')[2] || '?'}
              </span>
              <span className="text-[9px] text-ink-400/60 uppercase font-semibold">
                {event.date ? new Date(event.date).toLocaleString('en', { month: 'short' }) : ''}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">{event.title}</h3>
              <p className="text-xs text-white/40 mt-0.5">{event.description}</p>
            </div>
            <button className="btn-ghost text-xs flex items-center gap-1.5 shrink-0">
              <CalendarPlus size={14} />
              Add
            </button>
          </motion.div>
        ))}
      </div>

      {/* Mock Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle size={14} className="text-amber-400" />
          <span className="text-xs text-amber-400 font-medium">Calendar Integration (Demo Mode)</span>
        </div>
        <p className="text-[11px] text-white/30">
          In production, this would use Google Calendar OAuth to push events directly to your calendar.
        </p>
      </motion.div>
    </div>
  );
}
