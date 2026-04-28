import { motion } from 'framer-motion';
import { MapPin, Navigation, Search } from 'lucide-react';
import type { BoothFinderData } from '../../types';

export function BoothFinderWidget({ data }: { data: BoothFinderData }) {
  const mapsUrl = `https://www.google.com/maps/embed/v1/search?key=${data.maps_api_key}&q=${encodeURIComponent(data.query + ' ' + data.pin_code)}&zoom=14`;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <MapPin size={20} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">Polling Booth Finder</h2>
            <p className="text-xs text-white/40">PIN Code: {data.pin_code}</p>
          </div>
        </div>
      </motion.div>

      {/* Search Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-4 mb-6 flex items-center gap-3"
      >
        <Search size={16} className="text-white/30 shrink-0" />
        <p className="text-sm text-white/60">
          Searching for: <span className="text-white/80 font-medium">{data.query}</span> near <span className="text-saffron-400 font-medium">{data.pin_code}</span>
        </p>
      </motion.div>

      {/* Map Embed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        {data.maps_api_key ? (
          <iframe
            src={mapsUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        ) : (
          <div className="w-full h-[450px] bg-surface-700 flex flex-col items-center justify-center gap-4">
            <Navigation size={48} className="text-white/15" />
            <p className="text-sm text-white/30">Maps API Key required to display map</p>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(data.query + ' ' + data.pin_code)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              Open in Google Maps ↗
            </a>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex gap-3"
      >
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.query + ' ' + data.pin_code)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Navigation size={14} />
          Get Directions
        </a>
        <button className="btn-ghost text-sm flex items-center gap-2">
          <MapPin size={14} />
          Save Location
        </button>
      </motion.div>
    </div>
  );
}
