
import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Cpu, Loader2, ArrowRight, Microscope, Target } from 'lucide-react';
import { generateContextualActionPlan } from '../services/geminiService';

interface ActionPlan {
  riskLevel: string;
  situation: string;
  rootCause: string;
  actions: string[];
}

interface ShieldActionPanelProps {
    activeTab: 'overview' | 'traffic' | 'incidents' | 'reputation';
}

const ShieldActionPanel: React.FC<ShieldActionPanelProps> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plan, setPlan] = useState<ActionPlan | null>(null);

  const handleActivate = async () => {
    setIsOpen(true);
    setIsAnalyzing(true);
    setPlan(null);

    // 1. Determine Context and Mock Live Data based on Active Tab
    let contextName = "";
    let mockData = "";

    switch(activeTab) {
        case 'traffic':
            contextName = "Trafik Kimliği & Segmentasyon";
            mockData = `
                Mevcut Trafik Karması: %65 Mobil, %35 Masaüstü.
                Kalite Skoru: 62/100 (Düşüyor).
                Anomali: 'Güneydoğu Asya' bölgesinden doğrudan trafikte beklenmedik artış (10 dakikada %300 artış).
                Cihaz Parmak İzleri: Yüksek hacimli 'Generic Android' kullanıcı ajanları.
            `;
            break;
        case 'incidents':
            contextName = "Olay Müdahale & Adli Bilişim";
            mockData = `
                Son Olay: Yüksek Hızlı Tıklama Çiftliği Saldırısı (ID: INC-992).
                Durum: 450 istek/sn engellendi.
                Saldırgan Profili: Bilinen proxy ağı 'Tor Exit Nodes'.
                Hedef: 'Yaz İndirimi' Kampanyası Açılış Sayfası.
                Trend: Bu hafta benzer 4. saldırı.
            `;
            break;
        case 'reputation':
            contextName = "Marka İtibarı & Kamu Algısı";
            mockData = `
                Marka Duygusu: %45 Olumlu (%80'den düştü).
                Aktif Tehdit: Marka adı yazım hatalarıyla kaydedilmiş 3 Oltalama (Phishing) alan adı.
                Sosyal İzleme: Son reklam yorumlarında "dolandırıcı" anahtar kelimesinde artış.
                Kaynak: Sahte şikayetleri retweetleyen bot hesaplar.
            `;
            break;
        default: // overview
            contextName = "Genel Güvenlik & Bütçe Durumu";
            mockData = `
                Siber Sağlık: 85/100.
                Bütçe Sızıntısı: Google Ads bugün %18 geçersiz tıklama oranı tespit etti.
                API Güvenliği: Yönetici API'sinde 2 başarısız kimlik doğrulama denemesi.
                Genel Trend: Hafta sonu bot artışları nedeniyle orta risk.
            `;
            break;
    }

    // 2. Call Gemini
    const resultStr = await generateContextualActionPlan(contextName, mockData);
    
    // 3. Parse Response
    try {
        const jsonStr = resultStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        setPlan(parsed);
    } catch (e) {
        setPlan({
            riskLevel: "Orta",
            situation: "Dinamik analiz bağlamı alınamadı.",
            rootCause: "Veri akışı kesintisi.",
            actions: ["Paneli Yenile", "Manuel Günlükleri Kontrol Et"]
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string = 'Düşük') => {
      const l = level.toUpperCase();
      if (l === 'KRİTİK') return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      if (l === 'YÜKSEK') return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      if (l === 'ORTA') return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed right-8 bottom-8 z-40">
        <button 
          onClick={handleActivate}
          className="group relative flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-4 rounded-full shadow-[0_0_20px_rgba(8,145,178,0.5)] hover:shadow-[0_0_40px_rgba(8,145,178,0.7)] transition-all duration-300 border border-cyan-400/50"
        >
          <span className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></span>
          <Cpu className="w-6 h-6 animate-pulse-slow" />
          <span className="font-bold font-tech tracking-wider text-lg">AI AKSİYON</span>
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-[#0b1221] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
              
              {/* Decorative Header Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>

              {/* Close Button */}
              <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 text-slate-500 hover:text-white z-50">
                  <span className="sr-only">Kapat</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-8 relative">
                  {/* Watermark / Bg */}
                  <Shield className="absolute -bottom-10 -right-10 w-64 h-64 text-cyan-900/10 pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                      <div className="relative">
                          <div className="p-4 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl shadow-lg border border-white/10">
                              <Shield size={32} className="text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                      </div>
                      <div>
                          <h2 className="text-2xl font-bold text-white font-tech tracking-wide">GUARDIAN İSTİHBARATI</h2>
                          <p className="text-slate-400 text-sm flex items-center gap-2">
                              Stratejik Karar Destek Sistemi • <span className="text-cyan-400 uppercase font-bold">{activeTab.toUpperCase()} KATMANI</span>
                          </p>
                      </div>
                  </div>

                  {isAnalyzing ? (
                      <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                          <div className="relative">
                              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                              <div className="absolute inset-0 blur-xl bg-cyan-500/20 rounded-full animate-pulse"></div>
                          </div>
                          <div className="space-y-1">
                              <p className="text-xl font-medium text-white font-tech tracking-wider">{activeTab.toUpperCase()} VEKTÖRLERİ ANALİZ EDİLİYOR...</p>
                              <p className="text-sm text-slate-500">Guardian Sinir Ağına Bağlanılıyor</p>
                          </div>
                      </div>
                  ) : plan ? (
                      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                          
                          {/* 1. Risk Assessment Bar */}
                          <div className={`flex items-center justify-between p-4 rounded-lg border ${getRiskColor(plan.riskLevel)}`}>
                              <div className="flex items-center gap-3">
                                  <AlertTriangle size={20} />
                                  <span className="font-bold uppercase tracking-wider text-sm">Tespit Edilen Risk Seviyesi</span>
                              </div>
                              <span className="text-lg font-black tracking-widest uppercase">{plan.riskLevel}</span>
                          </div>

                          {/* 2. Diagnosis Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Situation */}
                              <div className="bg-slate-800/40 p-5 rounded-xl border border-white/5">
                                  <h3 className="text-slate-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                      <Microscope size={14} className="text-cyan-400"/> Durum Analizi
                                  </h3>
                                  <p className="text-white text-sm leading-relaxed font-medium">
                                      {plan.situation}
                                  </p>
                              </div>

                              {/* Root Cause */}
                              <div className="bg-slate-800/40 p-5 rounded-xl border border-white/5">
                                  <h3 className="text-slate-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                      <Target size={14} className="text-rose-400"/> Kök Neden
                                  </h3>
                                  <p className="text-white text-sm leading-relaxed font-medium">
                                      {plan.rootCause}
                                  </p>
                              </div>
                          </div>

                          {/* 3. Recommended Actions */}
                          <div className="mt-4">
                              <h3 className="text-cyan-400 text-sm font-bold uppercase mb-4 flex items-center gap-2">
                                  <CheckCircle size={16} /> Önerilen Strateji (Aksiyon)
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {plan.actions.map((action, idx) => (
                                      <button 
                                        key={idx} 
                                        onClick={() => setIsOpen(false)}
                                        className="group relative overflow-hidden bg-slate-800 hover:bg-cyan-600/20 border border-slate-600 hover:border-cyan-500 p-4 rounded-xl text-left transition-all duration-300"
                                      >
                                          <div className="flex justify-between items-center mb-1">
                                              <span className="text-xs text-slate-500 group-hover:text-cyan-300 uppercase font-bold">Seçenek {idx + 1}</span>
                                              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                                          </div>
                                          <span className="text-slate-200 group-hover:text-white font-bold text-sm">{action}</span>
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>
                  ) : null}
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default ShieldActionPanel;
