
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Lock, 
  Star, 
  MessageCircle, 
  Sparkles, 
  Loader2,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';
import { MOCK_SUCCESS_STORIES } from '../constants';
import { SuccessStory } from '../types';
import { generateTrustAnalysis } from '../services/geminiService';

const WallOfTrust: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [globalInsight, setGlobalInsight] = useState<string | null>(null);

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const insight = await generateTrustAnalysis(MOCK_SUCCESS_STORIES);
      setGlobalInsight(insight);
      setIsAnalyzing(false);
  };

  const getThreatIcon = (type: string) => {
      switch(type) {
          case 'FAKE_SITE': return <ShieldAlert size={14} className="text-rose-400" />;
          case 'AD_FRAUD': return <Zap size={14} className="text-yellow-400" />;
          case 'REPUTATION': return <ShieldCheck size={14} className="text-emerald-400" />;
          case 'TAKEOVER': return <Lock size={14} className="text-purple-400" />;
          default: return <Star size={14} className="text-cyan-400" />;
      }
  };

  const getThreatLabel = (type: string) => {
      switch(type) {
          case 'FAKE_SITE': return 'Sahte Site Engellendi';
          case 'AD_FRAUD': return 'Reklam Sahtekarlığı Durduruldu';
          case 'REPUTATION': return 'İtibar Koruması Aktif';
          case 'TAKEOVER': return 'Hesap Ele Geçirme Engellendi';
          default: return 'Onaylanmış Koruma';
      }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. HEADER & INTRO */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div className="max-w-2xl">
              <h2 className="text-3xl font-bold font-tech text-white flex items-center gap-3 mb-2">
                  <Award className="text-cyan-400 w-10 h-10" /> DİJİTAL GÜVEN DUVARI
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                  Türkiye'nin dev markaları ve vizyoner girişimcileri, dijital varlıklarını ve reklam bütçelerini <span className="text-cyan-400 font-bold">AI Shield</span> ile koruyor. Emeğiniz ve bütçeniz artık tam kontrol altında.
              </p>
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="group relative flex items-center gap-3 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 px-6 py-3 rounded-xl transition-all"
          >
              {isAnalyzing ? <Loader2 className="animate-spin text-cyan-400" /> : <Sparkles className="text-cyan-400 group-hover:scale-125 transition-transform" />}
              <span className="font-bold text-white tracking-wide">REFERANS ANALİZİ</span>
          </button>
      </div>

      {/* 2. AI GLOBAL INSIGHT (Dynamic) */}
      {globalInsight && (
          <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full"></div>
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                  <TrendingUp className="text-cyan-400" />
              </div>
              <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase text-cyan-500 tracking-[0.2em] mb-2">YAPAY ZEKA GÜVEN ÖZETİ</h4>
                  <p className="text-lg text-slate-200 font-medium italic">
                      "{globalInsight}"
                  </p>
              </div>
          </div>
      )}

      {/* 3. THE WALL (Scrolling Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {MOCK_SUCCESS_STORIES.map((story, idx) => (
              <div 
                key={story.id}
                className="glass-panel p-8 rounded-3xl border border-white/5 relative group hover:border-cyan-500/30 transition-all duration-500"
              >
                  {/* Verified Badge */}
                  <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Onaylanmış Koruma</span>
                  </div>

                  {/* Threat Label */}
                  <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-slate-950 rounded-lg border border-white/10">
                          {getThreatIcon(story.threatType)}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 uppercase font-bold tracking-widest">{getThreatLabel(story.threatType)}</span>
                  </div>

                  {/* Comment Area */}
                  <div className="mb-8 relative">
                      <MessageCircle className="absolute -top-4 -left-4 text-white/5 w-12 h-12 -z-10" />
                      <p className="text-slate-300 leading-relaxed italic text-lg">
                          {/* AI Highlighting logic for critical metric */}
                          {story.comment.split(story.criticalMetric).map((part, i, arr) => (
                              <React.Fragment key={i}>
                                  {part}
                                  {i < arr.length - 1 && (
                                      <span className="text-white font-bold bg-cyan-500/20 px-1 rounded border-b border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                                          {story.criticalMetric}
                                      </span>
                                  )}
                              </React.Fragment>
                          ))}
                      </p>
                  </div>

                  {/* Representative Area */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-tech text-xl font-bold text-cyan-400">
                          {story.brandName[0]}
                      </div>
                      <div>
                          <div className="text-white font-bold text-lg flex items-center gap-2">
                              {story.brandName} 
                              <span className="w-1 h-1 bg-slate-600 rounded-full"></span> 
                              <span className="text-sm text-slate-400 font-medium">{story.representative}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-medium uppercase tracking-widest">{story.title}</div>
                      </div>
                  </div>

                  {/* Tech Decoration */}
                  <div className="absolute bottom-4 right-8 flex gap-1 opacity-20">
                      {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-cyan-400 rounded-full"></div>)}
                  </div>
              </div>
          ))}
      </div>

      {/* 4. FOOTER CALL TO ACTION */}
      <div className="pt-12 text-center">
          <p className="text-slate-500 text-sm font-tech tracking-[0.3em] uppercase">Güvenle Büyüyen <span className="text-white">1000+</span> İşletme Arasına Katılın</p>
      </div>

    </div>
  );
};

export default WallOfTrust;
