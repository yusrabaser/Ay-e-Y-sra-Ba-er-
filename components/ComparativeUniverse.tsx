
import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Calendar, 
  Shield, 
  DollarSign, 
  Activity, 
  Zap,
  Loader2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { generateComparisonInsights } from '../services/geminiService';

const ComparativeUniverse: React.FC = () => {
  const [period, setPeriod] = useState<'WEEK' | 'MONTH' | 'YEAR'>('WEEK');
  const [metric, setMetric] = useState<'BUDGET' | 'ATTACKS' | 'RISK'>('BUDGET');
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [prevValue, setPrevValue] = useState(1200);
  const [currValue, setCurrValue] = useState(1450);
  const [delta, setDelta] = useState(20); // Percentage
  const [isPositive, setIsPositive] = useState(true); // Is the change "good" (e.g. more budget saved)

  // AI State
  const [aiData, setAiData] = useState<{ narrative: string; recommendation: string } | null>(null);

  // --- MOCK DATA GENERATOR ---
  useEffect(() => {
    // 1. Generate Numbers based on Context
    let pVal = 0;
    let cVal = 0;
    
    if (metric === 'BUDGET') {
        pVal = period === 'WEEK' ? 4500 : period === 'MONTH' ? 18000 : 210000;
        cVal = pVal * (1 + (Math.random() * 0.4 - 0.1)); // -10% to +30%
    } else if (metric === 'ATTACKS') {
        pVal = period === 'WEEK' ? 320 : period === 'MONTH' ? 1400 : 15000;
        cVal = pVal * (1 + (Math.random() * 0.5 - 0.2)); 
    } else { // RISK
        pVal = 65; // Risk Score
        cVal = 65 + (Math.floor(Math.random() * 20 - 10));
    }

    setPrevValue(Math.floor(pVal));
    setCurrValue(Math.floor(cVal));

    const change = ((cVal - pVal) / pVal) * 100;
    setDelta(parseFloat(change.toFixed(1)));

    // Determine "Good" vs "Bad"
    // For Budget Saved: Higher is Good.
    // For Attacks Blocked: Higher is usually Good (more activity blocked), but could mean higher threat. Let's say Good.
    // For Risk Score: Lower is Good.
    let good = false;
    if (metric === 'RISK') good = change < 0;
    else good = change > 0;
    setIsPositive(good);

    // 2. Trigger AI Analysis
    setAiData(null);
    setLoading(true);
    
    const fetchAI = async () => {
        const resultRaw = await generateComparisonInsights(
            period, 
            metric === 'BUDGET' ? 'Kurtarılan Bütçe ($)' : metric === 'ATTACKS' ? 'Engellenen Tehditler' : 'Risk Skoru',
            pVal.toString(),
            cVal.toString(),
            parseFloat(change.toFixed(1))
        );
        try {
            const jsonStr = resultRaw.replace(/```json/g, '').replace(/```/g, '').trim();
            setAiData(JSON.parse(jsonStr));
        } catch (e) {
            console.error("Comparison parse error", e);
        } finally {
            setLoading(false);
        }
    };
    
    // Debounce slightly for effect
    const timer = setTimeout(fetchAI, 600);
    return () => clearTimeout(timer);

  }, [period, metric]);

  // --- VISUAL HELPERS ---
  const formatNumber = (num: number) => {
      if (metric === 'BUDGET') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
      return new Intl.NumberFormat('en-US').format(num);
  };

  // Dynamic Background Color (Emerald vs Red)
  const bgGlow = isPositive 
    ? 'bg-emerald-500/5' 
    : 'bg-rose-500/5';
  
  const accentColor = isPositive ? 'text-emerald-400' : 'text-rose-400';
  const accentBorder = isPositive ? 'border-emerald-500/30' : 'border-rose-500/30';
  const accentBg = isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10';

  return (
    <div className={`w-full relative rounded-2xl overflow-hidden min-h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700 border border-white/5 ${bgGlow} transition-colors duration-1000`}>
      
      {/* 1. BACKGROUND WAVEFORM ANIMATION */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none opacity-20">
          <div className={`w-[200%] h-full absolute bottom-0 left-0 ${isPositive ? 'bg-gradient-to-t from-emerald-500 to-transparent' : 'bg-gradient-to-t from-rose-500 to-transparent'} animate-wave`}></div>
      </div>
      <style jsx>{`
        @keyframes wave {
            0% { transform: translateX(0) scaleY(1); }
            50% { transform: translateX(-25%) scaleY(1.2); }
            100% { transform: translateX(-50%) scaleY(1); }
        }
        .animate-wave {
            animation: wave 10s infinite linear;
            mask-image: linear-gradient(to top, black, transparent);
        }
      `}</style>

      {/* 2. HEADER & CONTROLS */}
      <div className="relative z-10 p-8 flex flex-col gap-8 h-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h2 className="text-2xl font-bold font-tech text-white flex items-center gap-3">
                      <BarChart3 className={accentColor} /> KARŞILAŞTIRMALI İSTİHBARAT
                  </h2>
                  <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest pl-10">
                      Küresel Savunma Evrim Sistemi
                  </p>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                   <div className="flex bg-slate-900/50 rounded-lg p-1 border border-white/10">
                       {['WEEK', 'MONTH', 'YEAR'].map((p) => (
                           <button 
                             key={p} 
                             onClick={() => setPeriod(p as any)}
                             className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${period === p ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                           >
                               {p === 'WEEK' ? 'HAFTA' : p === 'MONTH' ? 'AY' : 'YIL'}
                           </button>
                       ))}
                   </div>
                   <div className="flex bg-slate-900/50 rounded-lg p-1 border border-white/10">
                       <button onClick={() => setMetric('BUDGET')} className={`p-2 rounded ${metric==='BUDGET' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500'}`} title="Kurtarılan Bütçe"><DollarSign size={16}/></button>
                       <button onClick={() => setMetric('ATTACKS')} className={`p-2 rounded ${metric==='ATTACKS' ? 'bg-purple-900/50 text-purple-400' : 'text-slate-500'}`} title="Engellenen Tehditler"><Shield size={16}/></button>
                       <button onClick={() => setMetric('RISK')} className={`p-2 rounded ${metric==='RISK' ? 'bg-orange-900/50 text-orange-400' : 'text-slate-500'}`} title="Risk Skoru"><Activity size={16}/></button>
                   </div>
              </div>
          </div>

          {/* 3. THE DUEL (COMPARISON VISUALIZER) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-10">
              
              {/* Previous Period */}
              <div className="text-center opacity-60 scale-90">
                  <div className="text-sm text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                      <Calendar size={14} /> Geçen {period === 'WEEK' ? 'Hafta' : period === 'MONTH' ? 'Ay' : 'Yıl'}
                  </div>
                  <div className="text-5xl font-bold text-slate-500 font-tech">
                      {formatNumber(prevValue)}
                  </div>
              </div>

              {/* Kinetic Arrow Indicator */}
              <div className={`relative w-24 h-24 flex items-center justify-center rounded-full bg-slate-900 border-4 ${accentBorder} shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20`}>
                   {delta > 0 ? (
                       <ArrowUpRight size={48} className={`${accentColor} ${isPositive ? 'animate-pulse' : ''}`} />
                   ) : delta < 0 ? (
                       <ArrowDownRight size={48} className={`${accentColor} ${!isPositive ? 'animate-pulse' : ''}`} />
                   ) : (
                       <Minus size={48} className="text-slate-500" />
                   )}
                   <div className={`absolute -bottom-8 px-3 py-1 rounded-full text-sm font-bold ${accentBg} ${accentColor} border ${accentBorder}`}>
                       {delta > 0 ? '+' : ''}{delta}%
                   </div>
              </div>

              {/* Current Period */}
              <div className="text-center scale-110 transform transition-all duration-500">
                  <div className="text-sm text-white uppercase tracking-widest mb-2 flex items-center justify-center gap-2 font-bold">
                      <Calendar size={14} /> Bu {period === 'WEEK' ? 'Hafta' : period === 'MONTH' ? 'Ay' : 'Yıl'}
                  </div>
                  <div className={`text-6xl font-black font-tech ${accentColor} drop-shadow-2xl`}>
                      {formatNumber(currValue)}
                  </div>
              </div>
          </div>

          {/* 4. AI STORY & ACTION HUB */}
          <div className="max-w-4xl mx-auto w-full">
              <div className="glass-panel p-1 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent">
                  <div className="bg-slate-950/80 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                      
                      {/* AI Avatar/Icon */}
                      <div className="relative shrink-0">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${accentBg} border ${accentBorder}`}>
                              {loading ? (
                                  <Loader2 size={32} className={`${accentColor} animate-spin`} />
                              ) : (
                                  <TrendingUp size={32} className={accentColor} />
                              )}
                          </div>
                          {!loading && <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'} animate-ping`}></div>}
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-left">
                          {loading ? (
                              <div className="space-y-2">
                                  <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                                  <div className="h-3 bg-slate-800 rounded w-1/2 animate-pulse"></div>
                              </div>
                          ) : aiData ? (
                              <>
                                  <h4 className={`text-sm font-bold uppercase tracking-wide mb-2 ${accentColor}`}>
                                      Veri Hikayesi
                                  </h4>
                                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                      "{aiData.narrative}"
                                  </p>
                                  
                                  {/* Action Box */}
                                  <div className={`flex items-center gap-4 p-3 rounded-lg border border-dashed ${accentBorder} bg-black/20`}>
                                      <div className="shrink-0">
                                          <Zap size={18} className="text-yellow-400" />
                                      </div>
                                      <div className="flex-1 text-xs text-slate-400 text-left">
                                          <span className="text-white font-bold block mb-0.5">Proaktif Öneri:</span>
                                          {aiData.recommendation}
                                      </div>
                                      <button className={`px-4 py-2 rounded text-xs font-bold transition-all ${isPositive ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'}`}>
                                          UYGULA
                                      </button>
                                  </div>
                              </>
                          ) : null}
                      </div>

                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default ComparativeUniverse;
