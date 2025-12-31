
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Sliders, 
  Crosshair, 
  BarChart4, 
  Lightbulb, 
  AlertTriangle, 
  Loader2
} from 'lucide-react';
import { generateSimulationBrief } from '../services/geminiService';

const SimulationUniverse: React.FC = () => {
  // --- Simulation Inputs ---
  const [budgetScale, setBudgetScale] = useState(1.5); // 1x to 5x
  const [attackIntensity, setAttackIntensity] = useState<'LOW' | 'ORGANIZED' | 'AGGRESSIVE'>('ORGANIZED');
  const [protectionLevel, setProtectionLevel] = useState<'STANDARD' | 'PROACTIVE' | 'MAXIMUM'>('PROACTIVE');
  const [platformMix, setPlatformMix] = useState<'META_ONLY' | 'CROSS_PLATFORM'>('CROSS_PLATFORM');

  // --- AI State ---
  const [aiBrief, setAiBrief] = useState<{ riskCommentary: string; roiOpportunity: string; strategicWarning: string } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // --- Real-time Math Engine ---
  const simulationData = useMemo(() => {
    // Base Constants
    const baseDailySpend = 1000;
    const days = 30;
    
    // Multipliers based on Inputs
    const dailySpend = baseDailySpend * budgetScale;
    
    let attackRate = 0.05; // 5%
    if (attackIntensity === 'ORGANIZED') attackRate = 0.15;
    if (attackIntensity === 'AGGRESSIVE') attackRate = 0.35;
    
    // Cross platform usually invites more diverse botnets, slight bump
    if (platformMix === 'CROSS_PLATFORM') attackRate *= 1.1;

    let blockRate = 0.60; // Standard
    if (protectionLevel === 'PROACTIVE') blockRate = 0.88;
    if (protectionLevel === 'MAXIMUM') blockRate = 0.98;

    // Generate Points [Day, UnprotectedLoss, OptimizedLoss]
    const points = [];
    let cumulativeUnprotectedLoss = 0;
    let cumulativeOptimizedLoss = 0;

    for (let i = 0; i <= days; i++) {
        // Random daily variance
        const variance = 0.8 + Math.random() * 0.4; 
        
        // Potential Loss today
        const potentialLoss = dailySpend * attackRate * variance;
        
        // Actual Loss with AI Shield
        const optimizedLoss = potentialLoss * (1 - blockRate);

        cumulativeUnprotectedLoss += potentialLoss;
        cumulativeOptimizedLoss += optimizedLoss;

        points.push({
            day: i,
            unprotected: cumulativeUnprotectedLoss,
            optimized: cumulativeOptimizedLoss,
            saved: cumulativeUnprotectedLoss - cumulativeOptimizedLoss
        });
    }

    return {
        points,
        totalSaved: points[days].saved,
        roiBoost: ((points[days].saved / (dailySpend * days)) * 100).toFixed(1),
        projectedAttacks: Math.floor((dailySpend * days * attackRate) / 2.5) // Approx count
    };

  }, [budgetScale, attackIntensity, protectionLevel, platformMix]);

  // --- Trigger AI on significant changes (debounced) ---
  useEffect(() => {
    const timer = setTimeout(async () => {
        setIsLoadingAi(true);
        try {
            const raw = await generateSimulationBrief(budgetScale, attackIntensity, protectionLevel);
            const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
            setAiBrief(JSON.parse(jsonStr));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingAi(false);
        }
    }, 1200); // 1.2s debounce to let user slide
    return () => clearTimeout(timer);
  }, [budgetScale, attackIntensity, protectionLevel]);

  // --- Chart Drawing Helper ---
  const getPath = (type: 'unprotected' | 'optimized') => {
      const { points } = simulationData;
      const maxY = points[points.length - 1].unprotected * 1.1; // buffer
      
      const d = points.map((p, i) => {
          const x = (i / 30) * 100;
          const val = type === 'unprotected' ? p.unprotected : p.optimized;
          const y = 100 - (val / maxY) * 100;
          return `${x},${y}`;
      });
      return `M${d.join(' L')}`;
  };

  const getAreaPath = () => {
       const unp = getPath('unprotected');
       const opt = getPath('optimized').replace('M', 'L');
       // Draw top line (unprotected), then go down to optimized, then line back to start?
       // Easier: M (unprotected line) L (last optimized) (reverse optimized line) Z
       
       // Construct polygon manually
       const { points } = simulationData;
       const maxY = points[points.length - 1].unprotected * 1.1;
       
       let path = `M0,100 `; // Start bottom left (technically we want area between lines)
       
       // Trace Unprotected
       points.forEach((p, i) => {
           const x = (i / 30) * 100;
           const y = 100 - (p.unprotected / maxY) * 100;
           path += `L${x},${y} `;
       });

       // Trace Optimized (Backwards)
       for (let i = 30; i >= 0; i--) {
           const p = points[i];
           const x = (i / 30) * 100;
           const y = 100 - (p.optimized / maxY) * 100;
           path += `L${x},${y} `;
       }
       
       return path + "Z";
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-full relative rounded-2xl min-h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col lg:flex-row gap-6 p-2">
       
       {/* 1. LEFT CONTROL DECK */}
       <div className="lg:w-1/3 flex flex-col gap-6">
           <div className="glass-panel p-6 rounded-xl border-l-4 border-cyan-500">
               <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2 mb-1">
                   <Sliders className="text-cyan-400" /> GELECEK PROJEKSİYONU
               </h2>
               <p className="text-xs text-slate-400 mb-6 uppercase tracking-wider">Senaryo Değişkenlerini Yapılandır</p>

               {/* A. Budget Slider */}
               <div className="mb-8">
                   <div className="flex justify-between items-center mb-2">
                       <label className="text-sm font-bold text-white flex items-center gap-2">
                           <TrendingUp size={14} className="text-emerald-400"/> Reklam Bütçe Ölçeği
                       </label>
                       <span className="text-cyan-400 font-mono text-lg font-bold">{budgetScale}x</span>
                   </div>
                   <input 
                     type="range" 
                     min="1" max="5" step="0.5"
                     value={budgetScale}
                     onChange={(e) => setBudgetScale(parseFloat(e.target.value))}
                     className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                   />
                   <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                       <span>Mevcut Harcama</span>
                       <span>Agresif Ölçek</span>
                   </div>
               </div>

               {/* B. Attack Intensity */}
               <div className="mb-8">
                   <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                       <Crosshair size={14} className="text-rose-400"/> Tehdit Ortamı
                   </label>
                   <div className="grid grid-cols-3 gap-2">
                       {[
                           { val: 'LOW', label: 'DÜŞÜK' },
                           { val: 'ORGANIZED', label: 'ORGANİZE' },
                           { val: 'AGGRESSIVE', label: 'AGRESİF' }
                       ].map(lvl => (
                           <button 
                             key={lvl.val}
                             onClick={() => setAttackIntensity(lvl.val as any)}
                             className={`py-2 text-[10px] font-bold rounded border transition-all ${
                                 attackIntensity === lvl.val 
                                 ? 'bg-rose-500 text-white border-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                                 : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/20'
                             }`}
                           >
                               {lvl.label}
                           </button>
                       ))}
                   </div>
               </div>

               {/* C. Protection Level */}
               <div className="mb-4">
                   <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                       <ShieldCheck size={14} className="text-cyan-400"/> AI Kalkan Modu
                   </label>
                   <div className="flex flex-col gap-2">
                       <button 
                         onClick={() => setProtectionLevel('STANDARD')}
                         className={`px-3 py-2 text-xs font-bold rounded text-left border transition-all flex justify-between ${
                             protectionLevel === 'STANDARD' ? 'bg-slate-700 border-white/20 text-white' : 'bg-slate-900/50 border-white/5 text-slate-500'
                         }`}
                       >
                           <span>Standart Güvenlik Duvarı</span>
                           <span className="text-[10px] opacity-60">%60 Etkinlik</span>
                       </button>
                       <button 
                         onClick={() => setProtectionLevel('PROACTIVE')}
                         className={`px-3 py-2 text-xs font-bold rounded text-left border transition-all flex justify-between ${
                             protectionLevel === 'PROACTIVE' ? 'bg-cyan-900/40 border-cyan-500/50 text-cyan-400' : 'bg-slate-900/50 border-white/5 text-slate-500'
                         }`}
                       >
                           <span>Proaktif Sezgisel Algılama</span>
                           <span className="text-[10px] opacity-60">%88 Etkinlik</span>
                       </button>
                       <button 
                         onClick={() => setProtectionLevel('MAXIMUM')}
                         className={`px-3 py-2 text-xs font-bold rounded text-left border transition-all flex justify-between ${
                             protectionLevel === 'MAXIMUM' ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900/50 border-white/5 text-slate-500'
                         }`}
                       >
                           <span>Maksimum Karantina</span>
                           <span className="text-[10px] opacity-60">%98 Etkinlik</span>
                       </button>
                   </div>
               </div>
           </div>

           {/* Story Card */}
           <div className="glass-panel p-5 rounded-xl border-t border-white/10">
               <h3 className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-bold">Öngörülen Sonuç</h3>
               <p className="text-sm text-slate-200 leading-relaxed">
                   "Bütçenin <span className="text-white font-bold">{budgetScale}x</span> katına çıkarılması, <span className="text-rose-400">{attackIntensity === 'LOW' ? 'düşük' : attackIntensity === 'ORGANIZED' ? 'organize' : 'agresif'}</span> tehdit ortamında saldırı hacmini %{Math.floor(budgetScale * 100 / 3)} artırır. 
                   AI Shield {protectionLevel === 'STANDARD' ? 'Standart' : protectionLevel === 'PROACTIVE' ? 'Proaktif' : 'Maksimum'} modunun <span className="text-emerald-400 font-bold">{formatCurrency(simulationData.totalSaved)}</span> kurtarması ve 
                   Bütçe Verimliliğini (ROAS) <span className="text-cyan-400 font-bold">+{simulationData.roiBoost}</span> puan artırması öngörülüyor."
               </p>
           </div>
       </div>

       {/* 2. MAIN VISUALIZATION AREA */}
       <div className="flex-1 flex flex-col gap-6">
           
           {/* Chart Container */}
           <div className="glass-panel rounded-xl p-1 relative flex-1 min-h-[350px] flex flex-col">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rounded-xl"></div>
               
               {/* Chart Header */}
               <div className="relative z-10 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                   <div>
                       <h3 className="text-white font-bold text-sm flex items-center gap-2">
                           <BarChart4 size={16} className="text-purple-400"/> OLASILIKSAL KAYIP TAHMİNİ
                       </h3>
                       <p className="text-[10px] text-slate-500 font-mono">30 Günlük Kümülatif Maliyet Projeksiyonu</p>
                   </div>
                   <div className="flex gap-4 text-[10px] font-bold">
                       <div className="flex items-center gap-1 text-rose-400">
                           <div className="w-2 h-2 bg-rose-500 rounded-full"></div> Korumasız
                       </div>
                       <div className="flex items-center gap-1 text-emerald-400">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Optimize
                       </div>
                   </div>
               </div>

               {/* SVG Chart */}
               <div className="relative flex-1 w-full overflow-hidden p-6">
                   <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                       {/* Grid */}
                       <line x1="0" y1="100" x2="100" y2="100" stroke="#334155" strokeWidth="1" />
                       <line x1="0" y1="0" x2="0" y2="100" stroke="#334155" strokeWidth="1" />
                       
                       {/* Confidence Band Area (Difference between lines) */}
                       <path d={getAreaPath()} fill="rgba(16, 185, 129, 0.1)" stroke="none">
                           <animate attributeName="opacity" values="0.1;0.2;0.1" dur="4s" repeatCount="indefinite" />
                       </path>

                       {/* Unprotected Line (Red) */}
                       <path d={getPath('unprotected')} fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,2" opacity="0.8" />
                       
                       {/* Optimized Line (Emerald/Cyan) */}
                       <path d={getPath('optimized')} fill="none" stroke="#10b981" strokeWidth="3" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                           <animate attributeName="stroke-width" values="3;4;3" dur="3s" repeatCount="indefinite" />
                       </path>

                       {/* End Points */}
                       <circle cx="100" cy={100 - (simulationData.points[30].unprotected / (simulationData.points[30].unprotected * 1.1)) * 100} r="1.5" fill="#f43f5e" />
                       <circle cx="100" cy={100 - (simulationData.points[30].optimized / (simulationData.points[30].unprotected * 1.1)) * 100} r="2" fill="#10b981" />
                   </svg>

                   {/* Value Overlay */}
                   <div className="absolute top-10 right-10 text-right">
                       <div className="text-xs text-rose-400 font-mono mb-1">Potansiyel Kayıp: {formatCurrency(simulationData.points[30].unprotected)}</div>
                       <div className="text-xl text-emerald-400 font-bold font-tech drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                           Kurtarılan: {formatCurrency(simulationData.totalSaved)}
                       </div>
                   </div>
               </div>
           </div>

           {/* 3. AI WAR ROOM ADVISOR */}
           <div className="bg-slate-900/60 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
               {/* Holographic Top Border */}
               <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
               
               <div className="flex items-start gap-4 relative z-10">
                   <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                       <Zap size={24} className="text-purple-400" />
                   </div>
                   <div className="flex-1">
                       <h3 className="text-lg font-bold text-white font-tech mb-4">STRATEJİK SAVAŞ ODASI BRİFİNGİ</h3>
                       
                       {isLoadingAi ? (
                           <div className="flex items-center gap-3 text-purple-300">
                               <Loader2 className="animate-spin" />
                               <span className="text-xs font-mono animate-pulse">Sinirsel Simülasyon Modelleri Çalıştırılıyor...</span>
                           </div>
                       ) : aiBrief ? (
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4">
                               {/* 1. Risk Commentary */}
                               <div>
                                   <div className="text-[10px] font-bold text-rose-400 uppercase mb-1 flex items-center gap-1">
                                       <AlertTriangle size={10} /> Risk Değerlendirmesi
                                   </div>
                                   <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-rose-500/50 pl-2">
                                       {aiBrief.riskCommentary}
                                   </p>
                               </div>

                               {/* 2. ROI Opportunity */}
                               <div>
                                   <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1 flex items-center gap-1">
                                       <TrendingUp size={10} /> Bütçe Fırsatı
                                   </div>
                                   <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-emerald-500/50 pl-2">
                                       {aiBrief.roiOpportunity}
                                   </p>
                               </div>

                               {/* 3. Strategic Warning */}
                               <div>
                                   <div className="text-[10px] font-bold text-yellow-400 uppercase mb-1 flex items-center gap-1">
                                       <Lightbulb size={10} /> Stratejik Uyarı
                                   </div>
                                   <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-yellow-500/50 pl-2">
                                       {aiBrief.strategicWarning}
                                   </p>
                               </div>
                           </div>
                       ) : (
                           <p className="text-sm text-slate-500 italic">Brifing oluşturmak için simülasyon parametrelerini ayarlayın.</p>
                       )}
                   </div>
               </div>
           </div>

       </div>

    </div>
  );
};

export default SimulationUniverse;
