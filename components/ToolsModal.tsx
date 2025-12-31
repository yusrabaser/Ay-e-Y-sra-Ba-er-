
import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, Image as ImageIcon, Search, ScanEye, Send, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { chatWithGuardian, analyzeSecurityImage, generateSecurityVisual } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTool: 'chat' | 'analyze' | 'generate';
}

const ToolsModal: React.FC<ToolsModalProps> = ({ isOpen, onClose, activeTool: initialTool }) => {
  const [activeTab, setActiveTab] = useState(initialTool);
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'Guardian AI çevrimiçi. Güvenli bağlantı kuruldu. Bugün güvenlik operasyonlarınızda size nasıl yardımcı olabilirim?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Analyze State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzePrompt, setAnalyzePrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');

  // Generate State
  const [genPrompt, setGenPrompt] = useState('');
  const [genSize, setGenSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTool);
  }, [initialTool]);

  useEffect(() => {
    if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, activeTab]);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    const msg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setIsLoading(true);

    try {
        // Prepare history for API
        const apiHistory = chatHistory.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }));
        
        const response = await chatWithGuardian(apiHistory, msg);
        
        let finalText = response.text || "Yanıt alınamadı.";
        if (response.groundingUrls && response.groundingUrls.length > 0) {
            finalText += `\n\nKaynaklar:\n${response.groundingUrls.map(u => `- ${u}`).join('\n')}`;
        }

        setChatHistory(prev => [...prev, { role: 'model', text: finalText }]);
    } catch (err) {
        setChatHistory(prev => [...prev, { role: 'model', text: "Guardian ağına bağlanırken hata oluştu." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isLoading) return;
    setIsLoading(true);
    setAnalysisResult('');
    
    // Strip base64 prefix
    const base64Data = selectedImage.split(',')[1];
    
    try {
        const result = await analyzeSecurityImage(base64Data, analyzePrompt);
        setAnalysisResult(result || "Analiz tamamlandı. Herhangi bir anomali tespit edilmedi.");
    } catch (err) {
        setAnalysisResult("Görüntü analiz edilirken hata oluştu.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!genPrompt.trim() || isLoading) return;
    setIsLoading(true);
    setGeneratedImage(null);
    try {
        const imgData = await generateSecurityVisual(genPrompt, genSize);
        if (imgData) setGeneratedImage(imgData);
    } catch (err) {
        alert("Üretim başarısız oldu");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-[#020617] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/50">
            <div className="flex items-center gap-3">
                <Sparkles className="text-cyan-400 w-5 h-5" />
                <h2 className="text-lg font-bold text-white tracking-wide">GEMINI İSTİHBARAT PAKETİ</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Layout: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 bg-slate-900/30 flex flex-col p-4 gap-2">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:bg-white/5'}`}
                >
                    <MessageSquare size={18} /> Guardian Asistanı
                </button>
                <button 
                    onClick={() => setActiveTab('analyze')}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'analyze' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-white/5'}`}
                >
                    <ScanEye size={18} /> Görsel Analiz
                </button>
                <button 
                    onClick={() => setActiveTab('generate')}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'generate' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:bg-white/5'}`}
                >
                    <Wand2 size={18} /> Varlık Üretici
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-slate-950/50 relative overflow-hidden">
                {/* --- CHAT TAB --- */}
                {activeTab === 'chat' && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatScrollRef}>
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-50' 
                                            : 'bg-slate-800/50 border border-white/10 text-slate-300'
                                    }`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                        {msg.role === 'model' && idx === chatHistory.length - 1 && isLoading && (
                                           <span className="inline-flex gap-1 mt-2 items-center text-xs text-cyan-400 animate-pulse">
                                               <Loader2 size={12} className="animate-spin"/> Düşünüyor...
                                           </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && chatHistory[chatHistory.length-1].role === 'user' && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl flex items-center gap-2 text-cyan-400 text-sm">
                                        <Loader2 size={16} className="animate-spin" /> Guardian düşünüyor...
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-white/10 bg-slate-900/50">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Tehditler, CVE'ler veya güvenlik protokolleri hakkında sorun..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded-lg px-4 flex items-center justify-center transition-all disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ANALYZE TAB --- */}
                {activeTab === 'analyze' && (
                    <div className="p-8 h-full overflow-y-auto">
                         <h3 className="text-xl font-bold text-emerald-400 mb-6 font-tech">GÖRSEL TEHDİT ANALİZİ</h3>
                         
                         <div className="grid grid-cols-2 gap-8 h-[calc(100%-4rem)]">
                            <div className="flex flex-col gap-4">
                                <div className="border-2 border-dashed border-white/20 rounded-xl h-64 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors relative">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Upload" className="w-full h-full object-contain rounded-xl" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImageIcon className="mx-auto w-10 h-10 text-slate-500 mb-2" />
                                            <p className="text-slate-400 text-sm">Ekran görüntüsü veya log yüklemek için tıklayın/sürükleyin</p>
                                        </div>
                                    )}
                                    <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                </div>
                                <textarea 
                                    value={analyzePrompt} 
                                    onChange={(e) => setAnalyzePrompt(e.target.value)}
                                    placeholder="Bağlam ekleyin (Örn: 'Bu e-posta ekran görüntüsünde oltalama belirtilerini kontrol et')"
                                    className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white resize-none focus:border-emerald-500/50 focus:outline-none"
                                />
                                <button 
                                    onClick={handleAnalyze}
                                    disabled={!selectedImage || isLoading}
                                    className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 py-3 rounded-lg font-bold tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <ScanEye />} ANALİZ ET
                                </button>
                            </div>

                            <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 relative">
                                <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Analiz Raporu</h4>
                                {isLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-emerald-400 flex flex-col items-center gap-2">
                                            <Loader2 className="animate-spin w-8 h-8" />
                                            <span className="text-xs tracking-widest animate-pulse">PİKSELLER TARANIYOR...</span>
                                        </div>
                                    </div>
                                ) : analysisResult ? (
                                    <div className="prose prose-invert prose-sm max-h-full overflow-y-auto">
                                        <p className="whitespace-pre-wrap text-slate-300">{analysisResult}</p>
                                    </div>
                                ) : (
                                    <p className="text-slate-600 text-sm italic">Girdi bekleniyor...</p>
                                )}
                            </div>
                         </div>
                    </div>
                )}

                {/* --- GENERATE TAB --- */}
                {activeTab === 'generate' && (
                    <div className="p-8 h-full overflow-y-auto">
                        <h3 className="text-xl font-bold text-purple-400 mb-6 font-tech">VARLIK ÜRETİCİ (GÖRSEL OLUŞTURMA)</h3>
                        
                        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                             <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    value={genPrompt}
                                    onChange={(e) => setGenPrompt(e.target.value)}
                                    placeholder="Güvenlik varlığını tanımlayın (Örn: 'Aslanlı bir siber güvenlik kalkanı logosu')"
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50"
                                />
                                <select 
                                    value={genSize}
                                    onChange={(e) => setGenSize(e.target.value as any)}
                                    className="bg-black/40 border border-white/10 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                                >
                                    <option value="1K">1K</option>
                                    <option value="2K">2K</option>
                                    <option value="4K">4K</option>
                                </select>
                             </div>

                             <button 
                                onClick={handleGenerate}
                                disabled={isLoading || !genPrompt}
                                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/50 py-3 rounded-lg font-bold tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                             >
                                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} VARLIK ÜRET
                             </button>

                             <div className="aspect-video bg-black/20 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                {isLoading ? (
                                    <div className="text-purple-400 flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin w-8 h-8" />
                                        <span className="text-xs tracking-widest animate-pulse">RENDER ALINIYOR...</span>
                                    </div>
                                ) : generatedImage ? (
                                    <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                                ) : (
                                    <p className="text-slate-600 text-sm">Üretilen varlık burada görünecek</p>
                                )}
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsModal;
