
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  UserX, 
  TrendingUp,
  LayoutDashboard,
  Menu,
  Calendar,
  Sparkles,
  Scan,
  History,
  MessageSquare,
  BarChart3,
  Sliders,
  Award
} from 'lucide-react';
import { TimeRange, KPI } from './types';
import KPICard from './components/KPICard';
import ThreatMap from './components/ThreatMap';
import IncidentFeed from './components/IncidentFeed';
import ShieldActionPanel from './components/ShieldActionPanel';
import ToolsModal from './components/ToolsModal';
import CyberDefensePulse from './components/CyberDefensePulse';
import BudgetSecurityUniverse from './components/BudgetSecurityUniverse';
import TrafficIdentityUniverse from './components/TrafficIdentityUniverse';
import IncidentUniverse from './components/IncidentUniverse';
import ReputationUniverse from './components/ReputationUniverse';
import ComparativeUniverse from './components/ComparativeUniverse';
import SimulationUniverse from './components/SimulationUniverse';
import AutonomousEngine from './components/AutonomousEngine';
import WallOfTrust from './components/WallOfTrust';
import { generateSecuritySummary } from './services/geminiService';

const App: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LIVE);
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'incidents' | 'reputation' | 'comparative' | 'simulation' | 'trust'>('overview');
  const [toolsOpen, setToolsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'chat' | 'analyze' | 'generate'>('chat');
  
  // Animation States
  const [isScanning, setIsScanning] = useState(false);
  const [aiSummary, setAiSummary] = useState("Sistem çevrimiçi. Canlı trafik akışları izleniyor.");
  const [showCustomDate, setShowCustomDate] = useState(false);

  const openTool = (tool: 'chat' | 'analyze' | 'generate') => {
    setActiveTool(tool);
    setToolsOpen(true);
  };

  // Base Data Structure
  const baseKPIs: KPI[] = [
    { id: 'score', title: 'Siber Sağlık Skoru', value: 94, suffix:'', trend: 'up', trendValue: '2.4%', status: 'safe', insight: 'Sistem optimizasyonu %12 artırıldı.', iconName: 'ShieldCheck' },
    { id: 'fraud', title: 'Engellenen Reklam Sahtekarlığı', value: 12450, prefix: '$', trend: 'up', trendValue: '15%', status: 'safe', insight: 'Bütçe koruma kalkanı aktif.', iconName: 'DollarSign' },
    { id: 'campaigns', title: 'Aktif Korunan Kampanyalar', value: 28, trend: 'neutral', trendValue: '0%', status: 'safe', insight: 'Kampanyalar izleniyor.', iconName: 'Target' },
    { id: 'reputation', title: 'Risk Altındaki Marka İtibarı', value: 3, suffix: ' Hesap', trend: 'down', trendValue: '5', status: 'warning', insight: 'Sahte hesaplar inceleniyor.', iconName: 'AlertTriangle' },
    { id: 'login', title: 'Engellenen Giriş Girişimleri', value: 142, trend: 'up', trendValue: '32%', status: 'danger', insight: 'Kaba kuvvet (Brute-force) saldırıları engellendi.', iconName: 'UserX' },
    { id: 'roi', title: 'Yatırım Getirisi (ROI)', value: 315, suffix: '%', trend: 'up', trendValue: '12%', status: 'safe', insight: 'Yüksek verimlilik sağlandı.', iconName: 'TrendingUp' }
  ];

  const [currentKPIs, setCurrentKPIs] = useState<KPI[]>(baseKPIs);

  // --- TIME TRAVEL LOGIC ---
  const handleTimeChange = (range: TimeRange) => {
    if (range === timeRange && range !== TimeRange.CUSTOM) return;
    
    setTimeRange(range);
    setShowCustomDate(range === TimeRange.CUSTOM);
    
    // Trigger Radar Sweep
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500); // 1.5s visual sweep

    // Mock Data Transformation (Simulate DB fetch)
    const multiplier = range === TimeRange.LAST_24H ? 24 : range === TimeRange.LAST_30D ? 720 : range === TimeRange.CUSTOM ? 100 : 1;
    
    const newKPIs = baseKPIs.map(kpi => {
        let val = kpi.value;
        let insight = kpi.insight;
        
        // Dynamic data manipulation for odometer effect
        if (kpi.id === 'score') val = range === TimeRange.LIVE ? 94 : range === TimeRange.LAST_24H ? 91 : 88;
        else if (kpi.id === 'roi') val = kpi.value; // Keep stable
        else val = Math.floor(kpi.value * multiplier * (0.8 + Math.random() * 0.4)); // Random variance

        // Dynamic Insights per time range
        if (range === TimeRange.LIVE) insight = "Gerçek zamanlı paket denetimi aktif.";
        if (range === TimeRange.LAST_24H) insight = "Günlük özet: 03:00'te bot aktivitesinde artış görüldü.";
        if (range === TimeRange.LAST_30D) insight = "Aylık trend: Reklam bütçesi verimliliğinde %12 iyileşme.";
        
        return { ...kpi, value: val, insight };
    });

    setCurrentKPIs(newKPIs);

    // Call Gemini for Data Storytelling
    generateSecuritySummary(range, newKPIs).then(setAiSummary);
  };

  // --- AUTONOMOUS ENGINE HANDLER ---
  const handleAutonomousSave = (amount: number) => {
      // Update Fraud Saved KPI
      setCurrentKPIs(prev => prev.map(kpi => {
          if (kpi.id === 'fraud') {
              return { ...kpi, value: kpi.value + amount, trend: 'up', insight: `Otonom motor ${amount}$ değerinde sızıntıyı anlık engelledi.` };
          }
          if (kpi.id === 'score' && kpi.value < 100) {
              return { ...kpi, value: Math.min(100, kpi.value + 1) };
          }
          return kpi;
      }));
  };

  const getIcon = (name: string) => {
    switch(name) {
      case 'ShieldCheck': return ShieldCheck;
      case 'DollarSign': return DollarSign;
      case 'Target': return Target;
      case 'AlertTriangle': return AlertTriangle;
      case 'UserX': return UserX;
      case 'TrendingUp': return TrendingUp;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 mesh-bg relative selection:bg-cyan-500/30">
      
      {/* Radar Sweep Full Screen Overlay (Optional, or contained in map) */}
      {isScanning && <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-[60] shadow-[0_0_20px_#22d3ee] animate-sweep"></div>}

      {/* Top Decoration */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 z-50"></div>

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 h-auto md:h-20 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between px-8 gap-4 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
             <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-tech tracking-wider text-white cyber-glow">
              AI SHIELD
            </h1>
            <p className="text-xs text-cyan-400 font-medium tracking-widest uppercase opacity-80">
              Global Zaman Analiz Motoru
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden lg:flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                KOMUTA MERKEZİ
            </button>
            <button 
                onClick={() => setActiveTab('traffic')}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'traffic' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <Scan size={12} /> TRAFİK DNA
            </button>
            <button 
                onClick={() => setActiveTab('incidents')}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'incidents' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <History size={12} /> OLAY GÜNLÜĞÜ
            </button>
            <button 
                onClick={() => setActiveTab('reputation')}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'reputation' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <MessageSquare size={12} /> MARKA İTİBARI
            </button>
            <button 
                onClick={() => setActiveTab('comparative')}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'comparative' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <BarChart3 size={12} /> KARŞILAŞTIRMALI İSTİHBARAT
            </button>
            <button 
                onClick={() => setActiveTab('simulation')}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'simulation' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <Sliders size={12} /> SİMÜLASYON
            </button>
            <button 
                onClick={() => setActiveTab('trust')}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'trust' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <Award size={12} /> GÜVEN DUVARI
            </button>
        </div>

        {/* AI Summary Display - Visible on Desktop */}
        <div className="hidden xl:flex flex-1 mx-8 items-center gap-3 bg-slate-900/50 border border-cyan-500/10 rounded-lg px-4 py-2 overflow-hidden">
            <Sparkles className="text-cyan-400 w-4 h-4 flex-shrink-0 animate-pulse" />
            <p className="text-xs text-slate-300 leading-tight animate-glow-in truncate" key={aiSummary}>
                <span className="text-cyan-500 font-bold mr-1">Savunma Özeti:</span>
                {aiSummary}
            </p>
        </div>

        {/* Time Filter & Nav */}
        <div className="flex items-center gap-8">
           <div className="bg-white/5 rounded-full p-1 flex border border-white/10 relative">
              {Object.values(TimeRange).map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeChange(range)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 relative z-10 ${
                    timeRange === range 
                      ? 'text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {/* Neon Glow Background for Active Tab */}
                  {timeRange === range && (
                      <span className="absolute inset-0 bg-cyan-600 rounded-full -z-10 animate-glow-in"></span>
                  )}
                  {range === 'LIVE' ? 'CANLI' : range === 'LAST_24H' ? '24S' : range === 'LAST_30D' ? '30G' : 'ÖZEL'}
                </button>
              ))}
           </div>

           {showCustomDate && (
               <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1 animate-in fade-in slide-in-from-right-4">
                   <Calendar size={14} className="text-cyan-400"/>
                   <span className="text-xs text-white">10 Eki - 10 Kas</span>
               </div>
           )}
           
           <button onClick={() => openTool('chat')} className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Menu size={24} />
           </button>
        </div>
      </header>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="pt-36 md:pt-28 pb-12 px-8 max-w-[1920px] mx-auto min-h-screen flex flex-col gap-6">
        
        {/* KPI Grid - Always Visible */}
        {activeTab !== 'trust' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {currentKPIs.map((kpi, idx) => (
               <KPICard 
                 key={kpi.id}
                 {...kpi}
                 Icon={getIcon(kpi.iconName)}
                 delay={idx * 50}
               />
             ))}
          </div>
        )}

        {/* TAB CONTENT SWITCHER */}
        {activeTab === 'overview' ? (
            <>
                <CyberDefensePulse timeRange={timeRange} />
                <BudgetSecurityUniverse timeRange={timeRange} />
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
                   <div className="lg:col-span-2 relative group">
                      <ThreatMap timeRange={timeRange} isScanning={isScanning} />
                   </div>
                   <div className="lg:col-span-1">
                      <IncidentFeed />
                   </div>
                </div>
            </>
        ) : activeTab === 'traffic' ? (
            <TrafficIdentityUniverse timeRange={timeRange} />
        ) : activeTab === 'incidents' ? (
            <IncidentUniverse />
        ) : activeTab === 'reputation' ? (
            <ReputationUniverse timeRange={timeRange} />
        ) : activeTab === 'comparative' ? (
            <ComparativeUniverse />
        ) : activeTab === 'simulation' ? (
            <SimulationUniverse />
        ) : (
            <WallOfTrust />
        )}

      </main>

      {/* --- AUTONOMOUS ENGINE --- */}
      <AutonomousEngine onBudgetSave={handleAutonomousSave} />

      {/* --- FLOATING CONTROLS --- */}
      <ShieldActionPanel activeTab={activeTab === 'comparative' || activeTab === 'simulation' || activeTab === 'trust' ? 'overview' : activeTab} />

      <ToolsModal 
        isOpen={toolsOpen} 
        onClose={() => setToolsOpen(false)} 
        activeTool={activeTool} 
      />

    </div>
  );
};

export default App;
