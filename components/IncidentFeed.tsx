
import React, { useEffect, useState } from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { ShieldAlert, ShieldCheck, Lock, Globe } from 'lucide-react';
import { Incident } from '../types';

const IncidentFeed: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);

  useEffect(() => {
    const interval = setInterval(() => {
        // Simulate new incident arrival by rotating array
        setIncidents(prev => {
            const [first, ...rest] = prev;
            return [...rest, { ...first, id: Date.now().toString(), timestamp: new Date().toLocaleTimeString('tr-TR', {hour12: false}) }];
        });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
      switch(type) {
          case 'fraud': return <Globe size={14} className="text-amber-400" />;
          case 'login': return <Lock size={14} className="text-rose-400" />;
          case 'bot': return <ShieldAlert size={14} className="text-cyan-400" />;
          default: return <ShieldCheck size={14} className="text-emerald-400" />;
      }
  };

  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col h-full overflow-hidden">
      <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
         <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
         Olay Akışı (Canlı)
      </h3>
      
      <div className="flex-1 overflow-hidden relative space-y-3">
        {incidents.map((incident) => (
            <div key={incident.id} className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors animate-in slide-in-from-right-4 duration-500">
                <div className="p-1.5 rounded-full bg-slate-900 border border-white/10">
                    {getIcon(incident.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1 rounded ${
                            incident.severity === 'high' ? 'bg-rose-500/20 text-rose-400' : 
                            incident.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' : 
                            'bg-emerald-500/20 text-emerald-400'
                        }`}>{incident.severity === 'high' ? 'Yüksek' : incident.severity === 'medium' ? 'Orta' : 'Düşük'}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{incident.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 truncate font-mono">{incident.message}</p>
                </div>
            </div>
        ))}
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default IncidentFeed;
