
import React, { useState, useEffect } from 'react';
import { 
    ShieldAlert, 
    ShieldCheck, 
    Zap, 
    X, 
    Wifi, 
    Lock,
    Cpu,
    CheckCircle
} from 'lucide-react';
import { generateIntervention } from '../services/geminiService';

interface AutonomousEngineProps {
    onBudgetSave: (amount: number) => void;
}

interface InterventionData {
    alertTitle: string;
    description: string;
    actionLabel: string;
    savedAmount: number;
    successStory: string;
}

const AutonomousEngine: React.FC<AutonomousEngineProps> = ({ onBudgetSave }) => {
    const [status, setStatus] = useState<'IDLE' | 'DETECTING' | 'ALERT' | 'DEPLOYING' | 'SECURED'>('IDLE');
    const [data, setData] = useState<InterventionData | null>(null);

    // 1. Random Trigger Logic (Simulating Real-Time Monitoring)
    useEffect(() => {
        // Only start a new trigger cycle if we are IDLE
        if (status !== 'IDLE') return;

        // Trigger random event between 15s and 45s for demo
        const delay = Math.random() * 30000 + 15000; 
        const timeout = setTimeout(async () => {
            triggerEvent();
        }, delay);

        return () => clearTimeout(timeout);
    }, [status]);

    const triggerEvent = async () => {
        setStatus('DETECTING');
        
        // Pick a scenario
        const types: ('BOT_ATTACK' | 'BUDGET_LEAK' | 'CHANNEL_SHIFT')[] = ['BOT_ATTACK', 'BUDGET_LEAK', 'CHANNEL_SHIFT'];
        const chosenType = types[Math.floor(Math.random() * types.length)];

        try {
            const raw = await generateIntervention(chosenType);
            const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            setData(parsed);
            setStatus('ALERT');
        } catch (e) {
            console.error("Intervention generation failed", e);
            setStatus('IDLE');
        }
    };

    const handleActivate = () => {
        if (!data) return;
        setStatus('DEPLOYING');
        
        // Simulate "Network Ripple" animation time
        setTimeout(() => {
            setStatus('SECURED');
            onBudgetSave(data.savedAmount);

            // Auto-hide success message after 8 seconds
            setTimeout(() => {
                setStatus('IDLE');
                setData(null);
            }, 8000);

        }, 2000);
    };

    const handleIgnore = () => {
        setStatus('IDLE');
        setData(null);
    };

    if (status === 'IDLE' || status === 'DETECTING') return null;

    return (
        <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
            
            {/* 1. DEPLOYMENT RIPPLE ANIMATION (Full Screen) */}
            {status === 'DEPLOYING' && (
                <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                    <div className="w-[10vw] h-[10vw] bg-cyan-500/30 rounded-full animate-ping-slow absolute"></div>
                    <div className="w-[30vw] h-[30vw] bg-cyan-500/20 rounded-full animate-ping-slow animation-delay-300 absolute"></div>
                    <div className="w-[60vw] h-[60vw] bg-cyan-500/10 rounded-full animate-ping-slow animation-delay-500 absolute"></div>
                    
                    <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <ShieldCheck size={80} className="text-cyan-400 animate-bounce" />
                        <h2 className="text-3xl font-tech font-bold text-white mt-4 tracking-widest animate-pulse">
                            KARŞI ÖNLEMLER DEVREYE ALINIYOR...
                        </h2>
                    </div>
                </div>
            )}

            {/* 2. ALERT / SUCCESS MODAL (Pointer Events Active) */}
            {(status === 'ALERT' || status === 'SECURED') && data && (
                <div className="pointer-events-auto relative w-full max-w-lg mx-4">
                    
                    {/* Glass Container */}
                    <div className={`
                        relative overflow-hidden rounded-2xl border-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-500
                        ${status === 'ALERT' ? 'bg-slate-900/90 border-rose-500 shadow-rose-900/20' : 'bg-slate-900/90 border-emerald-500 shadow-emerald-900/20'}
                    `}>
                        
                        {/* Status Bar Top */}
                        <div className={`h-1.5 w-full ${status === 'ALERT' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>

                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl border ${
                                        status === 'ALERT' ? 'bg-rose-500/20 border-rose-500/50' : 'bg-emerald-500/20 border-emerald-500/50'
                                    }`}>
                                        {status === 'ALERT' ? (
                                            <ShieldAlert size={32} className="text-rose-500 animate-pulse" />
                                        ) : (
                                            <ShieldCheck size={32} className="text-emerald-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-bold font-tech tracking-wider ${
                                            status === 'ALERT' ? 'text-rose-500' : 'text-emerald-400'
                                        }`}>
                                            {status === 'ALERT' ? 'AI SHIELD MÜDAHALESİ' : 'TEHDİT ETKİSİZ HALE GETİRİLDİ'}
                                        </h2>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Wifi size={10} className={status === 'ALERT' ? 'text-rose-500' : 'text-emerald-500'}/>
                                            {status === 'ALERT' ? 'Otonom Tespit Aktif' : 'Sistem Güvenli'}
                                        </p>
                                    </div>
                                </div>
                                {status === 'ALERT' && (
                                    <button onClick={handleIgnore} className="text-slate-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {status === 'ALERT' ? data.alertTitle : "Savunma Başarılı"}
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed border-l-2 pl-4 py-1 border-slate-700">
                                    {status === 'ALERT' ? data.description : data.successStory}
                                </p>
                            </div>

                            {/* Actions or Stats */}
                            {status === 'ALERT' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={handleIgnore}
                                        className="py-3 px-4 rounded-lg border border-slate-600 text-slate-400 font-bold text-sm hover:bg-slate-800 transition-colors"
                                    >
                                        RİSKİ YOKSAY
                                    </button>
                                    <button 
                                        onClick={handleActivate}
                                        className="py-3 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm border border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <Zap size={16} className="group-hover:text-yellow-300" />
                                        {data.actionLabel}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center justify-between animate-in zoom-in-95">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-emerald-400 uppercase font-bold">Korunan Bütçe</div>
                                            <div className="text-xl font-tech font-bold text-white">
                                                ${data.savedAmount.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Cpu size={24} className="text-emerald-500/30" />
                                </div>
                            )}

                        </div>

                        {/* Tech Decoration */}
                        <div className="absolute bottom-2 right-2 flex gap-1">
                            {[1,2,3].map(i => (
                                <div key={i} className={`w-1 h-1 rounded-full ${status === 'ALERT' ? 'bg-rose-500' : 'bg-emerald-500'} opacity-50`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes ping-slow {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
                .animation-delay-500 {
                    animation-delay: 500ms;
                }
            `}</style>
        </div>
    );
};

export default AutonomousEngine;
