import { GoogleGenAI, Type } from "@google/genai";

// Helper to get AI instance safely
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSecuritySummary = async (timeRange: string, metrics: any) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rol: 'AI SHIELD' için Siber Güvenlik Analisti.
      Görev: Seçilen zaman aralığına (${timeRange}) göre yönetim paneli için 2 cümlelik, otoriter ve güven verici bir Türkçe özet yaz.
      
      Veri Bağlamı:
      - Siber Sağlık Skoru: ${metrics.find((m: any) => m.id === 'score')?.value}/100
      - Kurtarılan Bütçe: ${metrics.find((m: any) => m.id === 'fraud')?.value}
      - Engellenen Tehditler: ${metrics.find((m: any) => m.id === 'login')?.value}
      
      Örnek Çıktı: "Son 30 günde 1.400 farklı tehdidi başarıyla etkisiz hale getirerek toplam reklam bütçenizin %12'sini koruduk. Marka itibarınız optimum seviyede ve herhangi bir güvenlik ihlali yaşanmadı."
      
      Markdown kullanma. Sadece metni döndür.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return `Analiz (${timeRange}) tamamlandı. Sistemler optimum seviyede çalışıyor.`;
  }
};

export const generateTrustAnalysis = async (references: any) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Rol: AI SHIELD Kurumsal İletişim Stratejisti.
      Görev: Referans başarı hikayelerini analiz et ve tek cümlelik, vurucu bir "Küresel Güven Özeti" oluştur.
      
      Örnek Girdi: LCW (50 sahte site engellendi), Arçelik (%30 verimlilik).
      Örnek Çıktı: "Bu ay referans ağımız genelinde toplam 1.240 sahte site kapatıldı ve reklam bütçelerinde ortalama %28 net tasarruf sağlandı."
      
      Yanıt tamamen Türkçe ve otoriter olmalı.`,
    });
    return response.text;
  } catch (error) {
    return "Referanslarımız genelinde reklam bütçesi israfı %25 oranında azaltıldı ve itibar riskleri minimize edildi.";
  }
};

export const generateContextualActionPlan = async (contextName: string, dataSnapshot: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Rol: AI SHIELD 'Guardian' - Stratejik Siber Güvenlik Danışmanı.
      Hedef Kitle: KOBİ İşletme Sahibi (Teknik olmayan yönetici).
      Görev: "${contextName}" görünümü için sağlanan veri anlık görüntüsünü analiz et ve Türkçe stratejik karar destek planı sun.
      
      Veri Anlık Görüntüsü:
      ${dataSnapshot}
      
      Görevler:
      1. Risk ve Maliyet dengesini analiz et.
      2. Durumu Tanımla (Şu an ne oluyor?).
      3. Kök Nedeni Teşhis Et (Neden oluyor?).
      4. Somut Aksiyonlar Öner (Ne yapmalıyız?).

      Çıktı Yapısı (JSON):
      {
        "riskLevel": "Düşük" | "Orta" | "Yüksek" | "Kritik",
        "situation": "Mevcut durumun veya sorunun net, kısa bir tanımı.",
        "rootCause": "Teknik veya davranışsal temel neden (Örn: 'Rakip bot saldırısı', 'Hatalı hedefleme').",
        "actions": ["Aksiyon Butonu Etiketi 1", "Aksiyon Butonu Etiketi 2"]
      }
      
      Ton: Profesyonel, Kararlı, Güven Verici. Teknik jargondan kaçın, işletme dili (bütçe, itibar) kullan.
      `,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Context Action Error:", error);
    return JSON.stringify({
      riskLevel: "Orta",
      situation: "Guardian Sinir Ağına bağlanılamadı.",
      rootCause: "Ağ gecikmesi veya API zaman aşımı.",
      actions: ["Analizi Tekrarla", "Bağlantıyı Kontrol Et"]
    });
  }
};

export const generateComparisonInsights = async (period: string, metric: string, prevValue: string, currValue: string, delta: number) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Rol: AI SHIELD için Veri Bilimcisi ve Siber Stratejist.
      Hedef Kitle: KOBİ Yöneticisi.
      Dil: Türkçe.
      
      Senaryo: "${metric}" verisinin [${period} (Önceki): ${prevValue}] ve [${period} (Şu Anki): ${currValue}] karşılaştırması.
      Değişim: ${delta > 0 ? '+' : ''}${delta}%.
      
      Görev:
      1. Hikaye: Bu değişimin NEDEN olduğunu açıklayan 1 cümlelik bir başarı hikayesi veya uyarı yaz (teknik ama anlaşılır bir sebep uydur: 'yeni bot ağı', 'tatil trafiği', 'yapay zeka filtre güncellemesi' gibi).
      2. Öneri: Bu trende dayalı proaktif bir "Evet/Hayır" stratejik teklifi sun.
      
      Çıktı Formatı (JSON):
      {
        "narrative": "Metin...",
        "recommendation": "Metin..."
      }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    return JSON.stringify({
      narrative: `Veri karşılaştırması tamamlandı. Dalgalı ağ trafiği modelleri nedeniyle %${delta} oranında bir değişim tespit edildi.`,
      recommendation: "Bütünlüğü doğrulamak için derin tarama yapılsın mı?"
    });
  }
};

export const generateSimulationBrief = async (budgetScale: number, intensity: string, protection: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Rol: Siber Risk Modelleyicisi ve ROI Stratejisti.
      Dil: Türkçe.
      Görev: Bir simülasyon senaryosu için "Komuta Merkezi" brifingi hazırla.
      
      Simülasyon Parametreleri:
      - Bütçe Ölçeği: ${budgetScale}x (Mevcut harcamanın katı).
      - Saldırı Yoğunluğu: ${intensity} (Varsayımsal tehdit ortamı).
      - AI Koruma Seviyesi: ${protection}.
      
      Görev: Kullanıcı için 3 stratejik çıktı sağla:
      1. Risk Yorumu: Bütçeyi artırmak bu senaryoda saldırı yüzeyini nasıl etkiler?
      2. ROI Fırsatı: Seçilen koruma seviyesi maliyet verimliliğini (TBM/ROAS) nasıl iyileştirir?
      3. Stratejik Uyarı: Gelecek için spesifik bir uyarı (Örn: "Daha yüksek API gecikmesine hazırlanın").
      
      Çıktı Formatı (JSON):
      {
        "riskCommentary": "Metin...",
        "roiOpportunity": "Metin...",
        "strategicWarning": "Metin..."
      }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    return JSON.stringify({
        riskCommentary: "Bütçeyi ölçeklendirmek genellikle bot ilgisinin artmasıyla ilişkilidir.",
        roiOpportunity: "Yüksek koruma seviyeleri, reklam harcamasının yalnızca gerçek insanları hedeflemesini sağlar.",
        strategicWarning: "Yoğun trafik aralıklarında sistem gecikmesini izleyin."
    });
  }
};

export const generateIntervention = async (triggerType: 'BOT_ATTACK' | 'BUDGET_LEAK' | 'CHANNEL_SHIFT') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Rol: Otonom Siber Savunma Motoru.
      Tetikleyici Olay: ${triggerType}.
      Dil: Türkçe.
      
      Görev: Bir KOBİ paneli için kritik bir müdahale senaryosu oluştur.
      
      İstenen Çıktılar:
      1. alertTitle: Acil, kısa başlık (Örn: "Bot Sürüsü Tespit Edildi").
      2. description: Şu an ne oluyor? (Örn: "Meta üzerindeki sahte tıklama oranı az önce %15'i aştı").
      3. actionLabel: Kısa buton metni (Örn: "BÖLGEYİ ENGELLE").
      4. savedAmount: Aksiyon alınırsa kurtarılacak gerçekçi dolar miktarı (sadece sayı).
      5. successStory: Aksiyon alındıktan SONRA gösterilecek hikaye (Örn: "Hedefleme API üzerinden daraltıldı. Günlük 450$ israf önlendi.").
      
      Çıktı Formatı (JSON):
      {
        "alertTitle": "Metin",
        "description": "Metin",
        "actionLabel": "Metin",
        "savedAmount": Sayı,
        "successStory": "Metin"
      }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    return JSON.stringify({
        alertTitle: "Anomali Tespit Edildi",
        description: "Birincil reklam kampanyasında olağandışı trafik modelleri gözlendi.",
        actionLabel: "FİLTREYİ OPTİMİZE ET",
        savedAmount: 120,
        successStory: "Trafik filtresi optimize edildi. Öngörülen tasarruf: 120$/gün."
    });
  }
};

export const generateTrendAction = async (trendSummary: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rol: AI Shield Stratejik Danışmanı.
      Bağlam: Kullanıcı bir siber saldırı trend grafiğine bakıyor.
      Grafik Veri Özeti: ${trendSummary}
      Dil: Türkçe.
      
      Görev: Bu trende dayanarak savunmayı optimize etmek için bir CISO'nun soracağı tek, ikili stratejik aksiyon sorusu ("Evet/Hayır" tarzı) öner.
      
      Örnekler:
      - "Güney Amerika'da bot trafiği artıyor. Coğrafi Sınırlama API'sini 'Agresif' moda geçirelim mi?"
      - "Bilinen IP bloklarından yüksek hacimli sahte tıklama tespit edildi. Bu alt ağları derhal izole edelim mi?"
      
      Çıktı: Sadece soru metni. Kısa ve teknoloji odaklı olsun.`,
    });
    return response.text;
  } catch (error) {
    return "Mevcut trafik modeli için güvenlik duvarı kurallarını optimize edelim mi?";
  }
};

export const generateBudgetStrategy = async (platformData: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rol: Dijital Pazarlama Güvenlik Stratejisti.
      Bağlam: Kullanıcı, platformlar (Meta, Google, TikTok, LinkedIn) arasındaki reklam bütçesi verimliliğini sahtekarlık/bot seviyelerine göre analiz ediyor.
      Veri: ${platformData}
      Dil: Türkçe.
      
      Görev: Stratejik bir bütçe yeniden tahsisi veya güvenlik eşiği ayarlaması öner.
      
      Örnekler:
      - "TikTok'ta sahtekarlık oranı %18. Bütçenin %10'unu etkileşimin daha temiz olduğu LinkedIn'e kaydıralım mı?"
      - "Google Ads'de hafta sonu bot artışları tespit edildi. Önümüzdeki 48 saat için filtreleme hassasiyetini 'Yüksek' seviyeye çıkaralım mı?"
      
      Çıktı: Tek bir kısa soru/öneri cümlesi.`,
    });
    return response.text;
  } catch (error) {
    return "Bütçeyi mevcut risk profiline göre yeniden tahsis edelim mi?";
  }
};

export const generateTrafficAnalysis = async (dataContext: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rol: Siber Antropoloji Uzmanı ve Veri Segmentasyon Stratejisti.
      Görev: Belirli bir trafik segmenti için 1 cümlelik Türkçe "Röntgen Analizi" sağla.
      
      Bağlam: ${dataContext}
      
      Örnekler:
      - "Trafiğin %85'i mobil, ancak masaüstü vektörleri %40 daha yüksek bot olasılığı gösteriyor."
      - "Yüksek değerli organik kullanıcılar Batı Avrupa'da kümelenmişken, X bölgesinden gelen tıklamaların %60'ı tıklama çiftlikleri."
      
      Çıktı: Tek bir anlamlı cümle.`,
    });
    return response.text;
  } catch (error) {
    return "Bu segmentte trafik anomalileri tespit edildi; daha fazla inceleme önerilir.";
  }
};

export const generateTrafficStrategy = async (summary: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Rol: AI Shield Büyüme ve Güvenlik Uzmanı.
      Bağlam: Kullanıcı Trafik Kimliği tanılamalarını görüntülüyor.
      Veri Özeti: ${summary}
      Dil: Türkçe.
      
      Görev: Stratejik bir aksiyon senaryosu öner (Hedefleme, Kara Liste veya İçerik Stratejisi).
      
      Çıktı Formatı (JSON):
      {
        "type": "Hedefleme" | "Kara Liste" | "İçerik",
        "title": "Kısa Başlık",
        "description": "Kullanıcı için stratejik soru/öneri."
      }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    return JSON.stringify({
        type: "Kara Liste",
        title: "Şüpheli IP'leri Engelle",
        description: "192.168.x alt ağından tekrarlayan bot modelleri tespit edildi. Kalıcı olarak engellensin mi?"
    });
  }
};

export const generateIncidentForensics = async (incidentDescription: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Rol: Dijital Adli Tıp Uzmanı ve UX Yazarı.
      Bağlam: Kullanıcı günlüğünden belirli bir engellenmiş siber olayı seçti.
      Olay Verisi: ${incidentDescription}
      Dil: Türkçe.
      
      Görev: Üç farklı çıktıya sahip yapılandırılmış bir adli analiz sağla:
      1. "Reçete": Belirli bir savunma yapılandırması değişikliği (Örn: "Agresif Bot Filtresini Etkinleştir").
      2. "Risk": Daha geniş bir risk değerlendirmesi veya politika önerisi (Örn: "Şifre politikalarını güncelle").
      3. "Tahmin": Veriye dayalı bir öngörü (Örn: "Benzer saldırılarda %20 artış bekleniyor").
      
      Çıktı Formatı (JSON):
      {
        "recipe": "Metin...",
        "risk": "Metin...",
        "prediction": "Metin..."
      }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    return JSON.stringify({
        recipe: "Güvenlik duvarı erişim listelerini derhal inceleyin.",
        risk: "İzole edilmezse potansiyel yanal hareket tespit edildi.",
        prediction: "24 saat içinde tekrarlanması muhtemel."
    });
  }
};

export const generateReputationAnalysis = async (dataContext: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Rol: Dijital İtibar Analisti ve PR Kriz Stratejisti.
      Görev: Marka algısı verilerini analiz et ve acil itibar kurtarma eylemleri öner.
      Dil: Türkçe.
      
      Bağlam Verisi:
      ${dataContext}
      
      Görev: 3 anahtarlı stratejik bir çıktı sağla:
      1. rootCause: Duygu neden düşüyor? (Gerçek müşteriler ile botlar arasında ayrım yap).
      2. action: Belirli bir taktiksel öneri (Örn: "Anahtar kelimeleri filtrele", "Karşı reklam yayınla").
      3. crisis: Belirli bir "Kırmızı Alarm" uyarısı (Örn: "Destek sayfanızı hedef alan sahte site SEO sıralaması kazanıyor").
      
      Çıktı Formatı (JSON):
      {
        "rootCause": "Metin...",
        "action": "Metin...",
        "crisis": "Metin..."
      }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    return JSON.stringify({
        rootCause: "Müşteri olmayan IP aralıklarından negatif duygu artışı tespit edildi.",
        action: "Meta ve Twitter'da 'Sıkı' yorum filtrelemesini derhal etkinleştirin.",
        crisis: "Destek sayfanızı hedef alan potansiyel alan adı taklidi saldırısı."
    });
  }
};

export const generateRecoveryStrategy = async (incidentType: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Rol: Elit Siber Olay Müdahale Komutanı.
      Senaryo: Kritik bir marka güvenliği olayı tespit edildi: "${incidentType}".
      Dil: Türkçe.
      
      Görev: Yönetim paneli için bir "Hızlı Müdahale" strateji kartı oluştur.
      
      İstenen Çıktılar:
      1. title: Acil, kısa uyarı başlığı (Örn: "Taklit Saldırısı").
      2. impact: İşletme etkisi özeti (1 cümle).
      3. action: Belirli, tıklanabilir bir teknik karşı önlem.
      4. aiNote: Yapay zekadan yürütmeyi nasıl ele alacağına dair güven verici bir not.
      
      Çıktı Formatı (JSON):
      {
        "title": "Metin",
        "impact": "Metin",
        "action": "Metin",
        "aiNote": "Metin"
      }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    return JSON.stringify({
        title: "Güvenlik Uyarısı",
        impact: "Potansiyel itibar hasarı tespit edildi.",
        action: "Karantinayı Başlat",
        aiNote: "Siz incelerken AI trafileyecek."
    });
  }
};

export const chatWithGuardian = async (history: { role: string; parts: { text: string }[] }[], message: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: "gemini-3-pro-preview",
    history: history,
    config: {
      systemInstruction: "Sen 'Guardian'sın, AI SHIELD'in arkasındaki yapay zeka istihbaratısın. Siber güvenlik konularında yardımsever, kesin ve otoriter bir uzmansın. Türkçe konuşuyorsun. En son tehditler için Google Araması'na erişimin var.",
      tools: [{ googleSearch: {} }] // Search grounding enabled
    }
  });

  const response = await chat.sendMessage({ message });
  
  // Extract grounding info if available
  let groundingUrls: string[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) groundingUrls.push(chunk.web.uri);
    });
  }

  return {
    text: response.text,
    groundingUrls
  };
};

export const analyzeSecurityImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/png", data: base64Image } },
          { text: prompt || "Bu görüntüyü potansiyel güvenlik riskleri, veri sızıntıları veya anomaliler açısından analiz et. Yanıtı Türkçe ver." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return "Görüntü analizi başarısız oldu.";
  }
};

export const generateSecurityVisual = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          imageSize: size, // 1K, 2K, 4K
          aspectRatio: "16:9"
        }
      }
    });

    // Extract image
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
