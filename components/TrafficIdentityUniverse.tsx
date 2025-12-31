
import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Smartphone, 
  Monitor, 
  Globe, 
  Users, 
  Fingerprint, 
  Skull, 
  ShieldCheck, 
  Activity,
  Zap,
  User,
  Ghost,
  Target,
  MousePointer2,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { TimeRange, TrafficActor, BudgetMatrixPoint } from '../types';
import { generateTrafficAnalysis, generateTrafficStrategy } from '../services/geminiService';
import { MOCK_TRAFFIC_ACTORS, MOCK_BUDGET_MATRIX } from '../constants';

interface TrafficIdentityUniverseProps {
  timeRange: TimeRange;
}

const TrafficIdentityUniverse: React.FC<TrafficIdentityUniverseProps> = ({ timeRange }) => {
  // AI & Data States
  const [deviceStory, setDeviceStory] = useState("Scanning device fingerprints...");
  const [actors, setActors] = useState<TrafficActor[]>(MOCK_TRAFFIC_ACTORS);
  const [matrixData, setMatrixData] = useState<BudgetMatrixPoint[]>(MOCK_BUDGET_MATRIX);
  const [hoveredPoint, setHoveredPoint] = useState<BudgetMatrixPoint | null>(null);

  // --- MOCK AI GENERATION ---
  useEffect(() => {
    // Simulate refreshing insights on time range change
    const fetchStories = async () => {
        const dStory = await generateTrafficAnalysis("High volume of 'Click Hunter' bots detected in last 24h.");
        setDeviceStory(dStory);
    };
    fetchStories();
  }, [timeRange]);

  // --- HELPERS ---
  const getActorColor = (type: string) => {
      switch(type) {
          case 'BOT': return 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] bg-rose-950/30';
          case 'COMPETITOR': return 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-950/30';
          default: return 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-950/30';
      }
  };

  const getActorIcon = (type: string) => {
      switch(type) {
          case 'BOT': return <MousePointer2 className="w-8 h-8 text-rose-500" />;
          case 'COMPETITOR': return <Ghost className="w-8 h-8 text-amber-500" />;
          default: return <User className="w-8 h-8 text-emerald-500" />;
      }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
        <div>
            <h2 className="text-2xl font-bold font-tech text-white flex items-center gap-3">
                <Scan className="text-cyan-400 w-8 h-8" /> TRAFFIC ACTORS & RISK MATRIX
            </h2>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest pl-11">
                Behavioral Forensics & Budget Efficiency Lab
            </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-cyan-950/30 rounded border border-cyan-500/30">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-300">LIVE PROFILING: ACTIVE</span>
        </div>
      </div>

      {/* SECTION 1: TRAFFIC PERSONA SPOTLIGHT (ACTOR CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actors.map((actor) => (
              <div 
                key={actor.id} 
                className={`relative p-6 rounded-2xl border backdrop-blur-sm group overflow-hidden transition-all duration-300 hover:-translate-y-2 ${getActorColor(actor.type)}`}
              >
                  {/* Holographic BG Effect */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                  
                  {/* Header */}
                  <div className="relative z-10 flex justify-between items-start mb-6">
                      <div className="p-3 bg-slate-900/50 rounded-xl border border-white/10">
                          {getActorIcon(actor.type)}
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          actor.type === 'GENUINE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                          {actor.type}
                      </span>
                  </div>

                  {/* Body */}
                  <div className="relative z-10 space-y-4">
                      <div>
                          <h3 className="text-lg font-bold text-white font-tech tracking-wide uppercase">{actor.name}</h3>
                          <p className="text-xs text-slate-400">{actor.method}</p>
                      </div>

                      {/* Damage Potential Bar */}
                      <div>
                          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                              <span>Impact Potential</span>
                              <span className={actor.damagePotential > 50 ? 'text-rose-400' : 'text-emerald-400'}>{actor.damagePotential}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${actor.damagePotential}%` }} 
                                className={`h-full ${actor.damagePotential > 50 ? 'bg-rose-500' : 'bg-emerald-500'} relative`}
                              >
                                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                              </div>
                          </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                          <p className="text-xs text-slate-300 leading-relaxed italic">
                              "{actor.description}"
                          </p>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {/* SECTION 2: BUDGET & TRUST MATRIX (SCATTER CHART) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
          
          {/* SCATTER CHART */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl relative flex flex-col">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <h3 className="text-white font-bold uppercase text-sm tracking-wider flex items-center gap-2">
                          <Target size={16} className="text-purple-400" /> Budget & Trust Matrix
                      </h3>
                      <p className="text-[10px] text-slate-400">Analysis: Cost per Click (CPC) vs Interaction Quality</p>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Budget Drainers</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Hidden Gems</div>
                  </div>
              </div>

              {/* CHART AREA */}
              <div className="flex-1 relative w-full h-64 border-l border-b border-slate-600">
                  {/* Axis Labels */}
                  <div className="absolute -left-8 top-1/2 -rotate-90 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cost (High CPC)</div>
                  <div className="absolute bottom-[-24px] left-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Interaction Quality (Trust)</div>

                  {/* Quadrant Backgrounds */}
                  <div className="absolute inset-0 flex flex-col">
                      <div className="flex-1 flex">
                           <div className="flex-1 bg-rose-500/5 border-r border-slate-700/30"></div> {/* High Cost, Low Quality (Bad) */}
                           <div className="flex-1 bg-slate-500/5"></div>
                      </div>
                      <div className="flex-1 flex border-t border-slate-700/30">
                           <div className="flex-1 bg-slate-500/5 border-r border-slate-700/30"></div>
                           <div className="flex-1 bg-emerald-500/5"></div> {/* Low Cost, High Quality (Good) */}
                      </div>
                  </div>

                  {/* Plot Points */}
                  <div className="absolute inset-0 p-4">
                      {matrixData.map((point) => (
                          <div 
                             key={point.id}
                             className={`absolute w-3 h-3 rounded-full border-2 cursor-pointer transition-all duration-300 hover:scale-150 shadow-[0_0_10px_currentColor] ${
                                 point.status === 'DRAINER' ? 'bg-rose-900 border-rose-500 text-rose-500' :
                                 point.status === 'GEM' ? 'bg-emerald-900 border-emerald-500 text-emerald-500' :
                                 'bg-slate-900 border-slate-500 text-slate-500'
                             }`}
                             style={{ 
                                 bottom: `${(point.cpc / 6) * 100}%`, // Max CPC approx $6 
                                 left: `${point.quality}%` 
                             }}
                             onMouseEnter={() => setHoveredPoint(point)}
                             onMouseLeave={() => setHoveredPoint(null)}
                          ></div>
                      ))}
                  </div>

                  {/* Tooltip Overlay */}
                  {hoveredPoint && (
                      <div 
                         className="absolute z-50 bg-slate-900/95 backdrop-blur border border-white/20 p-3 rounded-lg shadow-xl text-xs min-w-[150px]"
                         style={{ 
                             bottom: `${(hoveredPoint.cpc / 6) * 100 + 5}%`, 
                             left: `${hoveredPoint.quality}%` 
                         }}
                      >
                          <div className="font-bold text-white mb-1">{hoveredPoint.source}</div>
                          <div className="text-slate-400">CPC: <span className="text-white">${hoveredPoint.cpc.toFixed(2)}</span></div>
                          <div className="text-slate-400">Quality: <span className="text-white">{hoveredPoint.quality}/100</span></div>
                          <div className={`mt-1 font-bold uppercase text-[9px] ${
                              hoveredPoint.status === 'DRAINER' ? 'text-rose-400' : hoveredPoint.status === 'GEM' ? 'text-emerald-400' : 'text-slate-400'
                          }`}>{hoveredPoint.status === 'DRAINER' ? 'BLOCK IMMEDIATELY' : hoveredPoint.status === 'GEM' ? 'BOOST BUDGET' : 'MONITOR'}</div>
                      </div>
                  )}
              </div>
          </div>

          {/* SIDE PANEL: RESPONSE VELOCITY */}
          <div className="glass-panel p-6 rounded-xl flex flex-col relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full"></div>
               
               <h3 className="text-white font-bold uppercase text-sm tracking-wider flex items-center gap-2 mb-6 z-10">
                   <Clock size={16} className="text-cyan-400" /> Response Velocity
               </h3>

               <div className="flex-1 flex flex-col justify-center gap-8 relative z-10">
                   
                   {/* Human Benchmark */}
                   <div>
                       <div className="flex justify-between text-xs mb-2 text-slate-400">
                           <span>Manual / Traditional WAF</span>
                           <span>~45 Minutes</span>
                       </div>
                       <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full w-full bg-slate-600"></div>
                       </div>
                   </div>

                   {/* AI Shield */}
                   <div>
                       <div className="flex justify-between text-xs mb-2">
                           <span className="text-white font-bold flex items-center gap-2">
                               <Zap size={12} className="text-yellow-400" /> AI Shield Intervention
                           </span>
                           <span className="text-cyan-400 font-bold font-mono">0.02 Seconds</span>
                       </div>
                       <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative">
                           <div className="h-full w-[2%] bg-cyan-400 shadow-[0_0_15px_#22d3ee] absolute top-0 left-0"></div>
                           <div className="absolute left-[2%] top-0 h-full w-px bg-white/50"></div>
                       </div>
                       <p className="text-[10px] text-cyan-500 mt-2 font-mono">
                           >> LIGHT SPEED PROACTIVE BLOCKING
                       </p>
                   </div>

               </div>

               <div className="mt-auto pt-4 border-t border-white/5 z-10">
                   <p className="text-xs text-slate-300 font-mono italic">
                       {deviceStory}
                   </p>
               </div>
          </div>

      </div>

    </div>
  );
};

export default TrafficIdentityUniverse;
