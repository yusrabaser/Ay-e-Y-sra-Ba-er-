
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Activity, ShieldAlert, TrendingUp, Zap, Crosshair } from 'lucide-react';
import { TimeRange } from '../types';
import { generateTrendAction } from '../services/geminiService';

interface DataPoint {
  timestamp: string;
  attacks: number;
  budgetSaved: number;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  aiNote: string;
}

interface CyberDefensePulseProps {
  timeRange: TimeRange;
}

const CyberDefensePulse: React.FC<CyberDefensePulseProps> = ({ timeRange }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [actionProposal, setActionProposal] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Mock Data Generator ---
  useEffect(() => {
    const generateData = () => {
      const points = [];
      const count = timeRange === TimeRange.LIVE ? 60 : timeRange === TimeRange.LAST_24H ? 24 : 30;
      const intervalType = timeRange === TimeRange.LIVE ? 'min' : timeRange === TimeRange.LAST_24H ? 'hr' : 'day';
      
      let baseAttack = 50;
      let baseBudget = 200;

      for (let i = 0; i < count; i++) {
        // Random Walk
        baseAttack = Math.max(10, Math.min(100, baseAttack + (Math.random() - 0.5) * 30));
        baseBudget = Math.max(100, Math.min(500, baseBudget + (Math.random() - 0.5) * 50));
        
        // Spike condition
        const isSpike = Math.random() > 0.85;
        const finalAttack = isSpike ? baseAttack * 1.5 : baseAttack;
        const threatLevel = finalAttack > 80 ? 'Critical' : finalAttack > 60 ? 'High' : finalAttack > 40 ? 'Medium' : 'Low';

        let label = '';
        if (timeRange === TimeRange.LIVE) {
             const d = new Date();
             d.setMinutes(d.getMinutes() - (count - i));
             label = d.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
        } else if (timeRange === TimeRange.LAST_24H) {
             const d = new Date();
             d.setHours(d.getHours() - (count - i));
             label = d.toLocaleTimeString('tr-TR', {hour: '2-digit'});
        } else {
             const d = new Date();
             d.setDate(d.getDate() - (count - i));
             label = d.toLocaleDateString('tr-TR', {day: 'numeric', month: 'short'});
        }

        points.push({
          timestamp: label,
          attacks: Math.floor(finalAttack),
          budgetSaved: Math.floor(baseBudget + (finalAttack * 1.2)), // More attacks = more savings usually
          threatLevel,
          aiNote: isSpike ? "Bot imzasında anomali tespit edildi." : "Rutin trafik filtrasyonu aktif."
        });
      }
      return points;
    };

    setData(generateData());
  }, [timeRange]);

  // --- Storytelling Logic ---
  const story = useMemo(() => {
    if (data.length === 0) return { trend: "stabil", peakDate: "", saved: "$0" };
    
    let totalAttacks = 0;
    let totalSaved = 0;
    let maxAttack = -1;
    let peakDate = "";

    data.forEach(d => {
        totalAttacks += d.attacks;
        totalSaved += d.budgetSaved;
        if (d.attacks > maxAttack) {
            maxAttack = d.attacks;
            peakDate = d.timestamp;
        }
    });

    const avg = totalAttacks / data.length;
    const trend = avg > 60 ? "yüksek ve dalgalı" : "stabil ve güvenli";
    
    return {
        trend,
        peakDate,
        saved: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalSaved)
    };
  }, [data]);

  // --- Handlers ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Find closest data point
    const index = Math.min(Math.max(0, Math.floor((x / width) * data.length)), data.length - 1);
    setHoveredPoint(data[index]);
    setHoverX((index / (data.length - 1)) * 100); // Percentage
  };

  const handleActionClick = async () => {
    setIsProcessingAction(true);
    setActionProposal(null);
    
    const summary = `Zaman Aralığı: ${timeRange}. Zirve Saldırı: ${story.peakDate}. Trend: ${story.trend}. Toplam Kurtarılan: ${story.saved}. Mevcut Tehdit Seviyesi: ${data[data.length-1].threatLevel}.`;
    
    const proposal = await generateTrendAction(summary);
    setActionProposal(proposal);
    setIsProcessingAction(false);
  };

  // --- Chart Drawing Helpers (SVG) ---
  const getPath = (type: 'attacks' | 'budget') => {
    if (data.length === 0) return "";
    const maxVal = type === 'attacks' ? 150 : 800; // Fixed scales for simpler demo
    
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const val = type === 'attacks' ? d.attacks : d.budgetSaved;
        const y = 100 - (val / maxVal) * 100;
        return `${x},${y}`;
    });

    if (type === 'budget') {
        // Area chart needs to close at bottom
        return `M0,100 L${points.join(' L')} L100,100 Z`;
    }
    return `M${points.join(' L')}`;
  };

  return (
    <div className="glass-panel w-full rounded-xl overflow-hidden relative flex flex-col mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20 bg-gradient-to-b from-slate-900/80 to-transparent">
        <div>
           <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              <Activity className="text-cyan-400 animate-pulse" /> SİBER SAVUNMA NABZI
           </h2>
           <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
              Saldırı Vektörleri vs. Bütçe Koruma
           </p>
        </div>

        {/* Action Button */}
        <div className="relative">
             <button 
                onClick={handleActionClick}
                disabled={isProcessingAction}
                className="group flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 hover:border-red-400 text-red-400 px-4 py-2 rounded-lg transition-all"
             >
                <ShieldAlert className={`w-5 h-5 ${isProcessingAction ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                <span className="font-bold tracking-wide">AI SHIELD MÜDAHALE</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
             </button>
             
             {/* Action Popover */}
             {actionProposal && (
                 <div className="absolute top-12 right-0 w-80 bg-slate-900 border border-red-500/50 rounded-xl p-4 shadow-2xl z-50 animate-in zoom-in-95 origin-top-right">
                     <h4 className="text-red-400 font-bold text-xs uppercase mb-2 flex items-center gap-2">
                         <Zap size={14} /> Stratejik Müdahale Önerisi
                     </h4>
                     <p className="text-white text-sm leading-relaxed mb-4">{actionProposal}</p>
                     <div className="flex gap-2">
                         <button onClick={() => setActionProposal(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded transition-colors">Yoksay</button>
                         <button onClick={() => setActionProposal(null)} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-2 rounded font-bold transition-colors">Onayla</button>
                     </div>
                 </div>
             )}
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={containerRef}
        className="relative h-64 w-full cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHoveredPoint(null); setHoverX(null); }}
      >
         {/* Background Grid */}
         <div className="absolute inset-0 z-0 opacity-20" 
              style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>

         {/* SVG Chart */}
         <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10 overflow-visible">
            <defs>
                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Area: Budget */}
            <path d={getPath('budget')} fill="url(#budgetGradient)" stroke="none" />
            <path d={getPath('budget').replace('M0,100 L', 'M').replace(' L100,100 Z', '')} fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.8" />

            {/* Line: Attacks */}
            <path d={getPath('attacks')} fill="none" stroke="#f97316" strokeWidth="0.8" filter="url(#glow)" />
         </svg>

         {/* Interactive Elements */}
         {hoverX !== null && hoveredPoint && (
             <>
                {/* Vertical Line */}
                <div className="absolute top-0 bottom-0 w-px bg-cyan-400/50 z-20 pointer-events-none" style={{ left: `${hoverX}%` }}></div>
                
                {/* Crosshair Point on Line */}
                <div 
                    className="absolute w-3 h-3 bg-cyan-950 border-2 border-cyan-400 rounded-full z-20 -ml-1.5 shadow-[0_0_10px_#22d3ee]"
                    style={{ left: `${hoverX}%`, top: `${100 - (hoveredPoint.attacks / 150) * 100}%` }}
                ></div>

                {/* Tooltip */}
                <div 
                    className={`absolute z-30 bg-slate-900/90 backdrop-blur border border-cyan-500/30 p-4 rounded-xl shadow-2xl min-w-[200px] pointer-events-none transition-all duration-75 ${hoverX > 50 ? '-translate-x-[105%]' : 'translate-x-6'}`}
                    style={{ left: `${hoverX}%`, top: '10%' }}
                >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                        <span className="text-xs text-slate-400 font-mono">{hoveredPoint.timestamp}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            hoveredPoint.threatLevel === 'Critical' ? 'bg-red-500 text-white' :
                            hoveredPoint.threatLevel === 'High' ? 'bg-orange-500 text-white' :
                            'bg-emerald-500 text-white'
                        }`}>{hoveredPoint.threatLevel === 'Critical' ? 'Kritik' : hoveredPoint.threatLevel === 'High' ? 'Yüksek' : hoveredPoint.threatLevel === 'Medium' ? 'Orta' : 'Düşük'}</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Engellenen:</span>
                            <span className="text-orange-400 font-bold">{hoveredPoint.attacks} Saldırı</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Kurtarılan:</span>
                            <span className="text-emerald-400 font-bold">${hoveredPoint.budgetSaved}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-cyan-300 italic">
                            AI Notu: {hoveredPoint.aiNote}
                        </div>
                    </div>
                </div>
             </>
         )}
      </div>

      {/* Story Footer */}
      <div className="bg-slate-900/60 p-4 border-t border-white/5 flex items-start gap-3">
          <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 mt-1">
              <TrendingUp size={16} />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
             <span className="text-emerald-400 font-bold mr-1">Savunma Özeti:</span>
             Seçilen dönem boyunca siber saldırı yoğunluğu <span className="text-white font-semibold">{story.trend}</span> seyretmiştir. 
             En yüksek riskli aktivite <span className="text-white font-semibold">{story.peakDate}</span> tarihinde tespit edilmiş; 
             ancak AI Shield müdahalesiyle bütçenizde <span className="text-emerald-400 font-bold">{story.saved}</span> kayıp engellenmiştir.
          </p>
      </div>
    </div>
  );
};

export default CyberDefensePulse;
