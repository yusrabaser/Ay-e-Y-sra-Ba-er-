
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar,
  ShieldAlert, 
  TrendingUp, 
  Megaphone, 
  Twitter,
  Instagram,
  Facebook,
  Star,
  Activity,
  AlertTriangle,
  Zap,
  CheckCircle,
  Loader2,
  Lock
} from 'lucide-react';
import { TimeRange, SentimentItem } from '../types';
import { MOCK_SENTIMENT_FEED } from '../constants';
import { generateRecoveryStrategy } from '../services/geminiService';

interface ReputationUniverseProps {
  timeRange: TimeRange;
}

const ReputationUniverse: React.FC<ReputationUniverseProps> = ({ timeRange }) => {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<{title: string, impact: string, action: string, aiNote: string} | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [cpcData, setCpcData] = useState({ safe: 0.45, risky: 1.20, efficiency: 25 });

  // --- 1. RADAR CHART LOGIC (SVG) ---
  const radarData = useMemo(() => {
      // Mock scores based on time range
      const base = timeRange === TimeRange.LIVE ? 70 : 85;
      return [
          { axis: 'Ad Security', value: base + 5 },
          { axis: 'Account Protection', value: base - 10 }, // Weak point
          { axis: 'Brand Reputation', value: base },
          { axis: 'API Stability', value: 95 },
          { axis: 'Phishing Prevention', value: base - 5 },
      ];
  }, [timeRange]);

  const getRadarPath = (data: {value: number}[], scale: number = 1) => {
      const radius = 80 * scale;
      const center = 100;
      const angleStep = (Math.PI * 2) / 5;
      
      const points = data.map((d, i) => {
          const val = (d.value / 100) * radius;
          const x = center + val * Math.cos(i * angleStep - Math.PI/2);
          const y = center + val * Math.sin(i * angleStep - Math.PI/2);
          return `${x},${y}`;
      });
      return points.join(' ');
  };

  // --- 2. CPC EFFICIENCY LOGIC ---
  useEffect(() => {
      // Simulate efficiency calculation
      const safe = 0.45 + Math.random() * 0.1;
      const risky = 1.10 + Math.random() * 0.3;
      const eff = Math.round(((risky - safe) / risky) * 100);
      setCpcData({ safe, risky, efficiency: eff });
  }, [timeRange]);

  // --- 3. INCIDENT RECOVERY TRIGGER ---
  useEffect(() => {
      // Trigger a random incident for demo purposes if score is low
      const hasIncident = radarData.some(r => r.value < 75);
      if (hasIncident) {
          const type = "Mass Fake Account Creation";
          setActiveAlert(type);
          generateRecoveryStrategy(type).then(res => {
              try {
                  const json = JSON.parse(res.replace(/```json/g, '').replace(/```/g, ''));
                  setRecoveryPlan(json);
              } catch(e) { console.error(e); }
          });
      } else {
          setActiveAlert(null);
          setRecoveryPlan(null);
      }
  }, [radarData]);

  const handleRecover = () => {
      setIsRecovering(true);
      setTimeout(() => {
          setActiveAlert(null); // Clear alert
          setIsRecovering(false);
      }, 2000);
  };

  return (
    <div className="w-full relative rounded-2xl overflow-hidden min-h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-start border-b border-white/5 pb-4">
          <div>
              <h2 className="text-2xl font-bold font-tech text-white flex items-center gap-3">
                  <Megaphone className="text-cyan-400" /> SECURITY & REPUTATION RADAR
              </h2>
              <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest pl-10">
                  Defensive Performance & Sentiment Forensics
              </p>
          </div>
          {activeAlert && (
              <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/50 rounded-full animate-pulse">
                  <AlertTriangle size={14} className="text-rose-500" />
                  <span className="text-xs text-rose-400 font-bold uppercase">Active Threat Detected</span>
              </div>
          )}
      </div>

      {/* TOP ROW: RADAR & EFFICIENCY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. DEFENSE RADAR */}
          <div className="glass-panel p-6 rounded-xl relative overflow-hidden flex flex-col items-center justify-center">
              <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                  <Radar size={14} className="text-cyan-400"/> Shield Performance Metrics
              </h3>
              
              <div className="relative w-64 h-64 mt-4">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      {/* Background Webs */}
                      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                          <polygon 
                            key={i}
                            points={getRadarPath(radarData.map(_ => ({value: 100})), scale)}
                            fill="none"
                            stroke="#334155"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                      ))}
                      
                      {/* Axes Lines */}
                      {radarData.map((_, i) => {
                          const angle = i * ((Math.PI * 2) / 5) - Math.PI/2;
                          const x = 100 + 80 * Math.cos(angle);
                          const y = 100 + 80 * Math.sin(angle);
                          return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="#334155" strokeWidth="1" />;
                      })}

                      {/* Data Polygon */}
                      <polygon 
                          points={getRadarPath(radarData)}
                          fill="rgba(6, 182, 212, 0.2)"
                          stroke="#22d3ee"
                          strokeWidth="2"
                          className="animate-in zoom-in duration-1000"
                      />
                      
                      {/* Points */}
                      {radarData.map((d, i) => {
                          const val = (d.value / 100) * 80;
                          const angle = i * ((Math.PI * 2) / 5) - Math.PI/2;
                          const x = 100 + val * Math.cos(angle);
                          const y = 100 + val * Math.sin(angle);
                          return (
                              <circle key={i} cx={x} cy={y} r="3" fill={d.value < 80 ? '#f43f5e' : '#22d3ee'} />
                          );
                      })}
                  </svg>

                  {/* Labels (Absolute Positioning for text clarity) */}
                  {radarData.map((d, i) => {
                       const angle = i * ((Math.PI * 2) / 5) - Math.PI/2;
                       // Push labels out further
                       const x = 50 + (40 + (Math.abs(Math.cos(angle)) * 10)) * Math.cos(angle); 
                       const y = 50 + (40 + (Math.abs(Math.sin(angle)) * 10)) * Math.sin(angle);
                       
                       // Simple inline styles for label positioning roughly around center
                       const style = {
                           top: `${50 + 40 * Math.sin(angle)}%`,
                           left: `${50 + 40 * Math.cos(angle)}%`,
                           transform: 'translate(-50%, -50%)'
                       };

                       return (
                           <div key={i} className="absolute text-[10px] font-bold text-slate-300 bg-slate-900/80 px-1 rounded whitespace-nowrap" style={style}>
                               {d.axis} <span className={d.value < 80 ? 'text-rose-400' : 'text-cyan-400'}>{d.value}%</span>
                           </div>
                       );
                  })}
              </div>
          </div>

          {/* 2. CPC EFFICIENCY CORRELATION */}
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-center gap-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-400"/> Security ROI Correlation
              </h3>

              <div className="flex items-end gap-4 h-32 px-4 relative">
                  {/* Dashed Connector */}
                  <div className="absolute top-1/2 left-10 right-10 border-t border-dashed border-slate-600 -z-10"></div>

                  {/* Safe Bar */}
                  <div className="flex-1 flex flex-col items-center justify-end h-full group">
                      <div className="text-xs text-emerald-400 font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Optimized
                      </div>
                      <div className="w-16 bg-slate-800 rounded-t-lg relative overflow-hidden group-hover:bg-slate-700 transition-colors" style={{ height: '40%' }}>
                          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 h-full opacity-20"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                              ${cpcData.safe.toFixed(2)}
                          </div>
                      </div>
                      <div className="mt-2 text-[10px] uppercase font-bold text-slate-400">Safe Mode CPC</div>
                  </div>

                  {/* Risky Bar */}
                  <div className="flex-1 flex flex-col items-center justify-end h-full group">
                      <div className="text-xs text-rose-400 font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Unprotected
                      </div>
                      <div className="w-16 bg-slate-800 rounded-t-lg relative overflow-hidden group-hover:bg-slate-700 transition-colors" style={{ height: '100%' }}>
                          <div className="absolute bottom-0 left-0 right-0 bg-rose-500 h-full opacity-20"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                              ${cpcData.risky.toFixed(2)}
                          </div>
                      </div>
                      <div className="mt-2 text-[10px] uppercase font-bold text-slate-400">Attack Mode CPC</div>
                  </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-center gap-4">
                  <div className="p-2 bg-emerald-500/20 rounded-full">
                      <Zap size={20} className="text-emerald-400" />
                  </div>
                  <div>
                      <div className="text-lg font-bold text-white font-tech">
                          +{cpcData.efficiency}% Budget Efficiency
                      </div>
                      <p className="text-xs text-emerald-200/70">
                          Full protection significantly lowers Cost Per Click by filtering bot traffic.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* BOTTOM ROW: SENTIMENT STREAM & RECOVERY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[300px]">
          
          {/* 3. AI SENTIMENT STREAM */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl flex flex-col">
               <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-purple-400"/> Digital Voice • Threat Intelligence Feed
               </h3>
               
               <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 max-h-[250px]">
                   {MOCK_SENTIMENT_FEED.map((item) => (
                       <div key={item.id} className={`p-3 rounded-lg border flex gap-3 transition-all hover:bg-white/5 ${
                           item.sentiment === 'THREAT' ? 'bg-rose-950/20 border-rose-500/30' : 
                           item.sentiment === 'NEGATIVE' ? 'bg-amber-950/20 border-amber-500/30' : 
                           'bg-slate-800/30 border-white/5'
                       }`}>
                           {/* Icon */}
                           <div className="shrink-0 mt-1">
                               {item.platform === 'TWITTER' ? <Twitter size={14} className="text-sky-400" /> :
                                item.platform === 'INSTAGRAM' ? <Instagram size={14} className="text-pink-400" /> :
                                item.platform === 'FACEBOOK' ? <Facebook size={14} className="text-blue-500" /> :
                                <Star size={14} className="text-emerald-400" />}
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1">
                               <div className="flex justify-between items-center mb-1">
                                   <span className="text-xs font-bold text-white">{item.user}</span>
                                   <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                               </div>
                               <p className="text-xs text-slate-300 leading-snug">
                                   {/* Simple highlighter logic */}
                                   {item.aiFlag ? (
                                       <>
                                        {item.text.split(' ').map((word, i) => {
                                            const isRisk = ['fake', 'scam', 'redirect', 'impersonating', 'ghost'].some(k => word.toLowerCase().includes(k));
                                            return isRisk 
                                                ? <span key={i} className="text-rose-400 font-bold bg-rose-500/10 px-0.5 rounded">{word} </span>
                                                : word + ' ';
                                        })}
                                       </>
                                   ) : item.text}
                               </p>
                               {item.aiFlag && (
                                   <div className="mt-2 flex items-center gap-2">
                                       <span className="text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase">AI FLAG</span>
                                       <span className="text-[10px] text-rose-300 font-mono">{item.aiFlag}</span>
                                   </div>
                               )}
                           </div>
                       </div>
                   ))}
               </div>
          </div>

          {/* 4. INCIDENT RECOVERY CARD */}
          <div className="glass-panel p-0 rounded-xl overflow-hidden relative flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-black z-0"></div>
              
              {/* Header */}
              <div className="bg-slate-950 p-4 border-b border-white/10 z-10 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                      <Lock size={14} className={activeAlert ? "text-rose-500" : "text-emerald-500"} /> 
                      Incident Recovery
                  </h3>
                  <div className={`w-2 h-2 rounded-full ${activeAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 relative z-10 flex flex-col justify-center">
                  {!activeAlert ? (
                      <div className="text-center opacity-50">
                          <ShieldAlert size={48} className="mx-auto text-slate-600 mb-4" />
                          <p className="text-sm text-slate-400">No critical incidents requiring manual intervention.</p>
                          <p className="text-xs text-emerald-500 mt-2 font-bold">SYSTEMS NOMINAL</p>
                      </div>
                  ) : recoveryPlan ? (
                      <div className="space-y-4 animate-in slide-in-from-right-8 duration-500">
                           <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                               <h4 className="text-rose-400 font-bold text-sm uppercase mb-1">{recoveryPlan.title}</h4>
                               <p className="text-xs text-white">{recoveryPlan.impact}</p>
                           </div>
                           
                           <div className="text-[10px] text-slate-400 font-mono italic border-l-2 border-cyan-500 pl-2">
                               "AI Note: {recoveryPlan.aiNote}"
                           </div>

                           <button 
                               onClick={handleRecover}
                               disabled={isRecovering}
                               className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all flex items-center justify-center gap-2"
                           >
                               {isRecovering ? <Loader2 className="animate-spin" /> : <ShieldAlert size={16} />}
                               {isRecovering ? 'EXECUTING PROTOCOLS...' : recoveryPlan.action}
                           </button>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center text-rose-400 gap-2">
                          <Loader2 className="animate-spin" />
                          <span className="text-xs font-bold tracking-widest">GENERATING WAR ROOM STRATEGY...</span>
                      </div>
                  )}
              </div>
          </div>

      </div>
    </div>
  );
};

export default ReputationUniverse;
