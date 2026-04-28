import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import type { TimelineData } from '../../types';

export function TimelineWidget({ data }: { data: TimelineData }) {
  const events = data.events || [];
  const phase = data.phase || 'Election';

  const statusColors = {
    past: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400', dot: 'bg-green-400' },
    current: { bg: 'bg-saffron-500/20', border: 'border-saffron-500/40', text: 'text-saffron-400', dot: 'bg-saffron-400' },
    upcoming: { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/50', dot: 'bg-white/30' },
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center">
            <Calendar size={20} className="text-saffron-400" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">Election Timeline</h2>
            <p className="text-xs text-white/40">{phase}</p>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-saffron-500/40 via-white/10 to-transparent" />

        <div className="space-y-4">
          {events.map((event, i) => {
            const colors = statusColors[event.status] || statusColors.upcoming;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative pl-14"
              >
                {/* Dot */}
                <div className={`absolute left-3.5 top-4 w-3 h-3 rounded-full ${colors.dot} ring-4 ring-surface-900`}>
                  {event.status === 'current' && (
                    <span className="absolute inset-0 rounded-full bg-saffron-400 animate-ping opacity-50" />
                  )}
                </div>

                {/* Card */}
                <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 hover:scale-[1.01] transition-transform duration-200`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-sm font-semibold ${colors.text}`}>{event.label}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={12} className="text-white/30" />
                        <span className="text-xs text-white/40">{event.date}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {event.status === 'past' ? (
                        <CheckCircle2 size={18} className="text-green-400" />
                      ) : event.status === 'current' ? (
                        <ArrowRight size={18} className="text-saffron-400 animate-pulse" />
                      ) : (
                        <Circle size={18} className="text-white/20" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Calendar CTA */}
      {data.show_calendar_button && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button className="btn-primary inline-flex items-center gap-2">
            <Calendar size={16} />
            Add Dates to Google Calendar
          </button>
        </motion.div>
      )}
    </div>
  );
}
