
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Shield, 
  Layers, 
  ArrowRight, 
  Clock, 
  Sun, 
  Moon, 
  Facebook, 
  Linkedin, 
  Search, 
  Video 
} from 'lucide-react';
import { TimeRange } from '../types';
import { generateBudgetStrategy } from '../services/geminiService';

interface PlatformData {
  name: string;
  icon: React.ReactNode;
  spend: number;
  saved: number;
  risk: number; // percentage
  cleanTraffic: number; // percentage
  color: string;
  insight: string;
}

interface BudgetSecurityUniverseProps {
  timeRange: TimeRange;
}

const BudgetSecurityUniverse: React.FC<BudgetSecurityUniverseProps> = ({ timeRange }) => {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [activeCycle, setActiveCycle] = useState<'day' | 'night'>('day');
  const [actionProposal, setActionProposal] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Mock Data ---
  useEffect(() => {
    // Determine base values based on time range (Live = smaller nums, 30D = bigger)
    const multiplier = timeRange === TimeRange.LIVE ? 1 : timeRange === TimeRange.LAST_24H ? 50 : 1500;
    
    // Simulate Data
    const mockData: PlatformData[] = [
        {
            name: "Meta Ads",
            icon: <Facebook className="w-5 h-5" />,
            spend: 450 * multiplier,
            saved: 65 * multiplier,
            risk: 14,
            cleanTraffic: 86,
            color: "text-blue-500",
            insight: "Bot trafiği riskinden arındırıldı; gerçek erişim %22 arttı."
        },
        {
            name: "Google Ads",
            icon: <Search className="w-5 h-5" />,
            spend: 820 * multiplier,
            saved: 90 * multiplier,
            risk: 9,
            cleanTraffic: 91,
            color: "text-green-500",
            insight: "Click fraud (tık sahtekarlığı) başarıyla filtrelendi."
        },
        {
            name: "TikTok",
            icon: <Video className="w-5 h-5" />,
            spend: 300 * multiplier,
            saved: 80 * multiplier,
            risk: 24,
            cleanTraffic: 76,
            color: "text-pink-500",
            insight: "Yüksek bot aktivitesi tespit edildi, bütçe korumada."
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="w-5 h-5" />,
            spend: 210 * multiplier,
            saved: 15 * multiplier,
            risk: 4,
            cleanTraffic: 96,
            color: "text-sky-600",
            insight: "Kurumsal trafik %96 oranında temiz ve güvenli."
        }
    ];
    setPlatforms(mockData);
  }, [timeRange]);

  const handleActionClick = async () => {
      setIsProcessing(true);
      setActionProposal(null);
      
      const summary = platforms.map(p => `${p.name}: Risk ${p.risk}%, Saved $${p.saved}`).join('. ');
      const proposal = await generateBudgetStrategy(summary);
      
      setActionProposal(proposal);
      setIsProcessing(false);
  };

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="glass-panel w-full rounded-2xl p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-8 relative z-20">
          <div>
              <h2 className="text-2xl font-bold font-tech text-white flex items-center gap-3">
                  <Layers className="text-cyan-400" /> BÜTÇE GÜVENLİK EVRENİ
              </h2>
              <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">
                  Finansal Koruma Katmanı & Veri Saflığı
              </p>
          </div>
          
          <div className="flex items-center gap-4">
               {/* Day/Night Toggle */}
               <div className="bg-slate-900/50 p-1 rounded-lg flex border border-white/10">
                   <button 
                     onClick={() => setActiveCycle('day')}
                     className={`p-2 rounded flex items-center gap-2 text-xs font-bold transition-all ${activeCycle === 'day' ? 'bg-amber-500/20 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-white'}`}
                   >
                       <Sun size={14} /> Ofis Modu
                   </button>
                   <button 
                     onClick={() => setActiveCycle('night')}
                     className={`p-2 rounded flex items-center gap-2 text-xs font-bold transition-all ${activeCycle === 'night' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-white'}`}
                   >
                       <Moon size={14} /> Gece Kalkanı
                   </button>
               </div>

               {/* AI Action */}
               <div className="relative">
                   <button 
                        onClick={handleActionClick}
                        disabled={isProcessing}
                        className="group bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 p-2 rounded-lg transition-all"
                   >
                       <Zap className={`w-6 h-6 ${isProcessing ? 'animate-spin' : ''}`} />
                   </button>
                   {actionProposal && (
                        <div className="absolute top-12 right-0 w-80 bg-slate-950 border border-cyan-500/50 rounded-xl p-4 shadow-2xl z-50 animate-in zoom-in-95 origin-top-right">
                             <h4 className="text-cyan-400 font-bold text-xs uppercase mb-2">Stratejik Öneri</h4>
                             <p className="text-white text-sm mb-3">{actionProposal}</p>
                             <button onClick={() => setActionProposal(null)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs py-2 rounded font-bold">Uygula</button>
                        </div>
                   )}
               </div>
          </div>
      </div>

      {/* --- ENERGY FLOW VISUALIZATION --- */}
      <div className="relative h-24 w-full mb-10 hidden md:block">
          <div className="absolute inset-0 flex items-center justify-between px-10">
              {/* Source */}
              <div className="text-center z-10">
                  <div className="w-12 h-12 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center mb-2 mx-auto">
                      <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-slate-500 font-bold uppercase">Ham Bütçe</span>
              </div>
              
              {/* Connector Lines (SVG) */}
              <div className="flex-1 h-px bg-slate-800 relative mx-4 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-1/2 animate-flow"></div>
              </div>

              {/* Central Core */}
              <div className="z-10 relative group cursor-pointer">
                  <div className="w-20 h-20 bg-slate-900 rounded-full border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-cyan-500/10 animate-pulse-slow"></div>
                      <Shield className="w-8 h-8 text-cyan-400 relative z-10" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-cyan-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      AI FİLTRE AKTİF
                  </div>
              </div>

              {/* Connector Lines (SVG) */}
              <div className="flex-1 h-px bg-slate-800 relative mx-4 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-1/2 animate-flow" style={{ animationDelay: '0.5s' }}></div>
              </div>

              {/* Output */}
              <div className="text-center z-10">
                  <div className="w-12 h-12 bg-emerald-900/20 rounded-full border border-emerald-500/50 flex items-center justify-center mb-2 mx-auto">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                  </div>
                  <span className="text-xs text-emerald-500 font-bold uppercase">Temiz ROI</span>
              </div>
          </div>
      </div>

      {/* --- PLATFORM CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((p, idx) => (
              <div 
                key={p.name} 
                className="bg-slate-900/40 border border-white/5 p-5 rounded-xl hover:bg-slate-800/60 hover:border-white/10 transition-all duration-300 group relative overflow-hidden"
              >
                  {/* Glassmorphism Shine */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-slate-950 border border-white/10 ${p.color}`}>
                              {p.icon}
                          </div>
                          <span className="font-bold text-white text-sm">{p.name}</span>
                      </div>
                      <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-1 rounded">
                          %{p.risk} Risk
                      </span>
                  </div>

                  {/* Visualization Bar */}
                  <div className="mb-4 relative z-10">
                      <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Toplam Harcama</span>
                          <span className="text-white">{formatCurrency(p.spend)}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="h-full bg-slate-600 w-[100%] relative">
                              <div 
                                style={{ width: `${p.cleanTraffic}%` }} 
                                className="h-full bg-cyan-500 absolute top-0 left-0 transition-all duration-1000 ease-out"
                              ></div>
                          </div>
                      </div>
                      <div className="flex justify-between text-[10px] mt-1">
                          <span className="text-cyan-400">%{p.cleanTraffic} Temiz</span>
                          <span className="text-emerald-400 font-bold">Kurtarılan {formatCurrency(p.saved)}</span>
                      </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight border-t border-white/5 pt-3 relative z-10">
                      <span className="text-cyan-500 font-semibold mr-1">AI Öngörü:</span>
                      {p.insight}
                  </p>
              </div>
          ))}
      </div>
      
      {/* --- GLOBAL THREAT BREAKDOWN MINI-BAR --- */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 md:items-center justify-between border-t border-white/5 pt-6">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-widest">Küresel Tehdit Engelleme Dağılımı</div>
          <div className="flex-1 max-w-2xl flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
              <div className="w-[45%] bg-indigo-500 hover:bg-indigo-400 transition-colors" title="Bots"></div>
              <div className="w-[30%] bg-rose-500 hover:bg-rose-400 transition-colors" title="Click Farms"></div>
              <div className="w-[25%] bg-amber-500 hover:bg-amber-400 transition-colors" title="Competitor Attacks"></div>
          </div>
          <div className="flex gap-4 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>Botlar</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Çiftlikler</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Rakipler</span>
          </div>
      </div>
      
      <style jsx>{`
        @keyframes flow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-flow {
            animation: flow 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default BudgetSecurityUniverse;
