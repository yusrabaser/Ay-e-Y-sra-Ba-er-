
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Search, 
  Facebook, 
  Linkedin, 
  Video, 
  Zap, 
  History, 
  Cpu, 
  AlertTriangle,
  Loader2,
  LayoutList,
  CalendarClock,
  KanbanSquare,
  Activity,
  Wifi,
  BoxSelect,
  CheckCircle2,
  Clock,
  Eye,
  Server
} from 'lucide-react';
import { MOCK_DEFENSE_LOG } from '../constants';
import { DefenseIncident, DefenseStatus } from '../types';

const IncidentUniverse: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'TIMELINE' | 'KANBAN'>('TIMELINE');
  const [incidents, setIncidents] = useState<DefenseIncident[]>(MOCK_DEFENSE_LOG);
  const [activeThreats, setActiveThreats] = useState(3);
  const [apiHealth, setApiHealth] = useState(98);
  const [quarantineLoad, setQuarantineLoad] = useState(42);

  // --- Helpers ---
  const getThreatStyle = (score: number) => {
      if (score >= 80) return 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse-slow'; // Red Pulse
      if (score >= 50) return 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'; // Amber Glow
      return 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]'; // Blue Stable
  };

  const getStatusColor = (status: DefenseStatus) => {
      switch(status) {
          case 'DETECTED': return 'text-slate-300 bg-slate-800';
          case 'ANALYZING': return 'text-amber-400 bg-amber-900/20';
          case 'AI_INTERVENTION': return 'text-cyan-400 bg-cyan-900/20';
          case 'QUARANTINE': return 'text-rose-400 bg-rose-900/20';
          case 'NEUTRALIZED': return 'text-emerald-400 bg-emerald-900/20';
      }
  };

  const getChannelIcon = (channel: string) => {
      switch(channel) {
          case 'META': return <Facebook size={14} className="text-blue-500" />;
          case 'GOOGLE': return <Search size={14} className="text-green-500" />;
          case 'TIKTOK': return <Video size={14} className="text-pink-500" />;
          case 'LINKEDIN': return <Linkedin size={14} className="text-sky-500" />;
          default: return <Server size={14} className="text-slate-400" />;
      }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. LIVE DEFENSE COCKPIT (Mission Control Bar) */}
      <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center justify-between border-t-2 border-cyan-500/50 relative overflow-hidden">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 pointer-events-none"></div>

          {/* A. Active Threats */}
          <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative">
                  <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/50 animate-pulse">
                      <ShieldAlert className="text-rose-500 w-6 h-6" />
                  </div>
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
              </div>
              <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Active Threats</div>
                  <div className="text-2xl font-tech font-bold text-white flex items-baseline gap-2">
                      {activeThreats} <span className="text-xs text-rose-400 font-sans font-medium">Critical</span>
                  </div>
              </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-white/10"></div>

          {/* B. API Health */}
          <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/50">
                   <Wifi className="text-emerald-500 w-6 h-6" />
               </div>
               <div className="flex-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex justify-between">
                      <span>API Health</span>
                      <span className="text-emerald-400">{apiHealth}%</span>
                  </div>
                  {/* Signal Bars Animation */}
                  <div className="flex gap-1 mt-1">
                      {[1,2,3,4,5].map(i => (
                          <div key={i} className={`h-1.5 w-3 rounded-sm ${i <= 4 ? 'bg-emerald-500' : 'bg-slate-700'} animate-pulse`} style={{ animationDelay: `${i*100}ms`}}></div>
                      ))}
                  </div>
               </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-white/10"></div>

          {/* C. Quarantine Zone */}
          <div className="flex items-center gap-4 w-full md:w-auto min-w-[200px]">
               <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/50">
                   <BoxSelect className="text-amber-500 w-6 h-6" />
               </div>
               <div className="flex-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 flex justify-between">
                      <span>Quarantine</span>
                      <span className="text-amber-400">{quarantineLoad}% Full</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div style={{ width: `${quarantineLoad}%` }} className="h-full bg-amber-500 relative">
                          <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                      </div>
                  </div>
               </div>
          </div>
      </div>

      {/* 2. CONTROL BAR & VIEW SWITCHER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-cyan-500/20 pb-4">
          <div>
               <h2 className="text-2xl font-bold font-tech text-white flex items-center gap-3">
                   <History className="text-cyan-400 w-7 h-7" /> CYBER DEFENSE COMMAND
               </h2>
               <p className="text-xs text-slate-400 uppercase tracking-widest pl-10">
                   Multi-Vector Threat Analysis & Response
               </p>
          </div>

          <div className="bg-slate-900 p-1 rounded-lg border border-white/10 flex items-center">
               <button 
                  onClick={() => setView('LIST')}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${view === 'LIST' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                   <LayoutList size={14} /> DETAY
               </button>
               <button 
                  onClick={() => setView('TIMELINE')}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${view === 'TIMELINE' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                   <CalendarClock size={14} /> SİBER TAKVİM
               </button>
               <button 
                  onClick={() => setView('KANBAN')}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${view === 'KANBAN' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                   <KanbanSquare size={14} /> SAVUNMA HATTI
               </button>
          </div>
      </div>

      {/* 3. MULTI-VIEW ENGINE */}
      <div className="relative min-h-[400px]">
          {/* Scan Line Transition Effect */}
          <div key={view} className="absolute inset-0 pointer-events-none z-50 animate-scan">
              <div className="h-1 w-full bg-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          </div>
          <style jsx>{`
            @keyframes scan {
                0% { transform: translateY(-10%); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(110%); opacity: 0; }
            }
            .animate-scan {
                animation: scan 0.6s ease-in-out forwards;
            }
          `}</style>

          {/* --- VIEW: TIMELINE (CHRONOLOGY) --- */}
          {view === 'TIMELINE' && (
              <div className="glass-panel p-6 rounded-xl overflow-x-auto">
                  <div className="min-w-[800px]">
                      {/* Time Axis */}
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-4 border-b border-white/5 pb-2 pl-24">
                          <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>24:00</span>
                      </div>

                      {/* Channels Rows */}
                      {['META', 'GOOGLE', 'TIKTOK', 'LINKEDIN', 'SYSTEM_API'].map((channel) => (
                          <div key={channel} className="flex items-center gap-4 mb-6 group">
                              {/* Y-Axis Label */}
                              <div className="w-20 flex-shrink-0 text-xs font-bold text-slate-400 flex items-center gap-2">
                                  {getChannelIcon(channel)} {channel.replace('_API', '')}
                              </div>
                              
                              {/* Lane */}
                              <div className="flex-1 h-12 bg-slate-900/50 rounded-lg relative border border-white/5 group-hover:border-white/10 transition-colors overflow-hidden">
                                  {/* Grid Lines */}
                                  <div className="absolute inset-0 flex justify-between px-0 opacity-10 pointer-events-none">
                                      {[...Array(7)].map((_, i) => <div key={i} className="w-px h-full bg-white"></div>)}
                                  </div>

                                  {/* Incident Plasma Blocks */}
                                  {incidents.filter(i => i.channel === channel).map(incident => {
                                      // Calculate Position
                                      const [hours, mins] = incident.startTime.split(':').map(Number);
                                      const startPercent = ((hours * 60 + mins) / 1440) * 100;
                                      const widthPercent = (incident.duration / 1440) * 100;
                                      
                                      return (
                                          <div 
                                            key={incident.id}
                                            className={`absolute top-2 bottom-2 rounded cursor-pointer transition-all hover:scale-105 hover:z-10 group/block border-l-2 flex items-center px-2 overflow-hidden ${getThreatStyle(incident.threatScore)}`}
                                            style={{ 
                                                left: `${startPercent}%`, 
                                                width: `${Math.max(widthPercent, 2)}%`,
                                                background: incident.threatScore > 80 
                                                    ? 'linear-gradient(90deg, rgba(225, 29, 72, 0.4), rgba(225, 29, 72, 0.1))' 
                                                    : 'linear-gradient(90deg, rgba(6, 182, 212, 0.4), rgba(6, 182, 212, 0.1))'
                                            }}
                                          >
                                              <div className="text-[9px] font-bold text-white truncate w-full opacity-80 group-hover/block:opacity-100">
                                                  {incident.title}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* --- VIEW: KANBAN (DEFENSE LINE) --- */}
          {view === 'KANBAN' && (
              <div className="flex gap-4 overflow-x-auto pb-4 h-[500px]">
                  {['DETECTED', 'ANALYZING', 'AI_INTERVENTION', 'QUARANTINE', 'NEUTRALIZED'].map((col) => (
                      <div key={col} className="min-w-[280px] w-full flex-1 bg-slate-900/30 rounded-xl border border-white/5 flex flex-col">
                          {/* Column Header */}
                          <div className={`p-3 border-b border-white/5 font-bold text-xs flex justify-between items-center ${
                              col === 'QUARANTINE' ? 'text-rose-400' : 
                              col === 'NEUTRALIZED' ? 'text-emerald-400' : 
                              col === 'AI_INTERVENTION' ? 'text-cyan-400' : 'text-slate-300'
                          }`}>
                              {col.replace('_', ' ')}
                              <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-white">
                                  {incidents.filter(i => i.status === col).length}
                              </span>
                          </div>

                          {/* Cards Area */}
                          <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                              {incidents.filter(i => i.status === col).map(incident => (
                                  <div 
                                    key={incident.id} 
                                    className={`p-3 rounded-lg border bg-slate-800/80 backdrop-blur-sm group hover:translate-y-[-2px] transition-all cursor-pointer ${getThreatStyle(incident.threatScore)}`}
                                  >
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-2">
                                              {getChannelIcon(incident.channel)}
                                              <span className="text-[10px] text-slate-400 font-bold">{incident.channel}</span>
                                          </div>
                                          <span className={`text-[10px] font-mono px-1 rounded ${incident.threatScore > 80 ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                              {incident.threatScore}
                                          </span>
                                      </div>
                                      <h4 className="text-xs font-bold text-white mb-1 leading-tight">{incident.title}</h4>
                                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                          <Clock size={10} /> {incident.startTime}
                                      </div>
                                      
                                      {/* AI Badge */}
                                      {incident.status === 'AI_INTERVENTION' && (
                                          <div className="mt-2 text-[9px] bg-cyan-950 text-cyan-400 p-1.5 rounded border border-cyan-500/20 flex items-center gap-1">
                                              <Zap size={10} /> Auto-Mitigating...
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* --- VIEW: LIST (DETAIL) --- */}
          {view === 'LIST' && (
              <div className="glass-panel rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                          <tr>
                              <th className="p-4">Threat Signature</th>
                              <th className="p-4">Channel</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">AI Score</th>
                              <th className="p-4">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {incidents.map((incident) => (
                              <tr key={incident.id} className="hover:bg-white/5 transition-colors group">
                                  <td className="p-4">
                                      <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-lg border ${getThreatStyle(incident.threatScore)} bg-slate-900`}>
                                              {incident.type === 'BOT' ? <Cpu size={16} className="text-indigo-400"/> :
                                               incident.type === 'FRAUD' ? <Globe size={16} className="text-amber-400"/> :
                                               incident.type === 'PHISHING' ? <ShieldAlert size={16} className="text-purple-400"/> :
                                               <AlertTriangle size={16} className="text-rose-400"/>}
                                          </div>
                                          <div>
                                              <div className="font-bold text-white">{incident.title}</div>
                                              <div className="text-xs text-slate-500">{incident.description}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
                                          {getChannelIcon(incident.channel)} {incident.channel}
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(incident.status)}`}>
                                          {incident.status.replace('_', ' ')}
                                      </span>
                                  </td>
                                  <td className="p-4">
                                      <div className="flex items-center gap-2">
                                          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                              <div 
                                                className={`h-full ${incident.threatScore > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`} 
                                                style={{ width: `${incident.threatScore}%`}}
                                              ></div>
                                          </div>
                                          <span className="text-xs font-mono text-white">{incident.threatScore}</span>
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <button className="text-cyan-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-bold">
                                          <Eye size={14} /> INSPECT
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

      </div>
    </div>
  );
};

export default IncidentUniverse;
