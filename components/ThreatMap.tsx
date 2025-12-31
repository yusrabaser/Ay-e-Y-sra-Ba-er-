
import React, { useEffect, useState } from 'react';
import { WORLD_COORDINATES } from '../constants';
import { TimeRange } from '../types';

interface ThreatMapProps {
    timeRange: TimeRange;
    isScanning: boolean;
}

const ThreatMap: React.FC<ThreatMapProps> = ({ timeRange, isScanning }) => {
  const [attacks, setAttacks] = useState<{ id: number; x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);

  // Adjust frequency based on time range to simulate "historical volume" vs "live trickle"
  const getFrequency = () => {
      switch(timeRange) {
          case TimeRange.LIVE: return 1200;
          case TimeRange.LAST_24H: return 600;
          case TimeRange.LAST_30D: return 200; // Very fast, lots of data
          default: return 800;
      }
  };

  useEffect(() => {
    const intervalTime = getFrequency();
    
    const interval = setInterval(() => {
      // Generate a random attack
      const start = WORLD_COORDINATES[Math.floor(Math.random() * WORLD_COORDINATES.length)];
      const end = WORLD_COORDINATES[Math.floor(Math.random() * WORLD_COORDINATES.length)];
      
      if (start !== end) {
        const id = Date.now() + Math.random();
        const colors = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8']; // Rose, Amber, Emerald, Sky
        const color = colors[Math.floor(Math.random() * colors.length)];

        setAttacks(prev => {
            // Keep fewer items in Live view to be cleaner, more in 30D to look like a heatmap
            const maxItems = timeRange === TimeRange.LAST_30D ? 40 : 10;
            const newAttacks = [...prev, { id, x1: start.cx, y1: start.cy, x2: end.cx, y2: end.cy, color }];
            if (newAttacks.length > maxItems) return newAttacks.slice(newAttacks.length - maxItems);
            return newAttacks;
        });

        // Remove attack after animation
        setTimeout(() => {
          setAttacks(prev => prev.filter(a => a.id !== id));
        }, 2500);
      }
    }, intervalTime); 

    return () => clearInterval(interval);
  }, [timeRange]);

  return (
    <div className="glass-panel w-full h-full rounded-xl p-4 relative overflow-hidden flex flex-col">
       {/* Radar Sweep Effect Layer */}
       {isScanning && <div className="radar-sweep-line animate-sweep"></div>}

      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-bold text-cyan-400 tracking-widest uppercase mb-1">
            {timeRange === TimeRange.LIVE ? 'Canlı Tehdit Haritası' : 'Tarihsel Saldırı Vektör Haritası'}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${timeRange === TimeRange.LIVE ? 'bg-rose-500' : 'bg-cyan-500'}`}></span>
          <span className="text-xs text-slate-400">
             {timeRange === TimeRange.LIVE ? 'Aktif Trafik İzleniyor' : 'Toplu Saldırı Verisi'}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full h-full flex items-center justify-center relative opacity-80 hover:opacity-100 transition-opacity duration-500">
        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
          {/* Abstract World Map Dots */}
          {WORLD_COORDINATES.map((point, i) => (
             <g key={i}>
                <circle cx={point.cx} cy={point.cy} r="1.5" className="fill-slate-600/50" />
                <circle cx={point.cx} cy={point.cy} r={timeRange === TimeRange.LAST_30D ? 12 : 8} className={`stroke-slate-700/30 fill-none transition-all duration-1000`} strokeWidth="0.2" />
                {timeRange === TimeRange.LAST_30D && <circle cx={point.cx} cy={point.cy} r="4" className="fill-rose-500/10" />}
             </g>
          ))}

          {/* Attack Lines */}
          {attacks.map(attack => (
            <g key={attack.id}>
              {/* Projectile */}
              <circle r="1" fill={attack.color}>
                 <animateMotion 
                   dur={timeRange === TimeRange.LAST_30D ? "0.5s" : "1s"}
                   repeatCount="1"
                   path={`M${attack.x1},${attack.y1} L${attack.x2},${attack.y2}`}
                 />
              </circle>
              {/* Trail */}
              <path 
                d={`M${attack.x1},${attack.y1} L${attack.x2},${attack.y2}`} 
                stroke={attack.color} 
                strokeWidth="0.2" 
                strokeOpacity="0.5"
                strokeDasharray="5"
              >
                 <animate attributeName="stroke-dashoffset" from="100" to="0" dur={timeRange === TimeRange.LAST_30D ? "0.5s" : "1s"} />
                 <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" />
              </path>
            </g>
          ))}
        </svg>
      </div>
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    </div>
  );
};

export default ThreatMap;
