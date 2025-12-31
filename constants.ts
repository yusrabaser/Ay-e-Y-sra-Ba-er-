
import { DefenseIncident, TrafficActor, BudgetMatrixPoint, SentimentItem, SuccessStory } from "./types";

export const MOCK_INCIDENTS = [
  { id: '1', timestamp: '10:42:05', message: 'DDoS saldırısı hafifletildi (IP Aralığı: 192.168.x.x)', severity: 'high', type: 'bot' },
  { id: '2', timestamp: '10:41:55', message: '/login üzerinde SQL Enjeksiyonu engellendi', severity: 'medium', type: 'injection' },
  { id: '3', timestamp: '10:41:20', message: 'Şüpheli giriş denemesi (Konum: Bilinmiyor)', severity: 'medium', type: 'login' },
  { id: '4', timestamp: '10:40:15', message: 'Reklam sahtekarlığı bot imzası tespit edildi', severity: 'low', type: 'fraud' },
  { id: '5', timestamp: '10:39:45', message: 'Yeni güvenlik duvarı kuralı otomatik uygulandı', severity: 'low', type: 'bot' },
];

export const MOCK_DEFENSE_LOG: DefenseIncident[] = [
  {
    id: 'def-1',
    title: 'Yüksek Hızlı Bot Sürüsü',
    type: 'BOT',
    channel: 'META',
    status: 'AI_INTERVENTION',
    threatScore: 92,
    startTime: '14:30',
    duration: 120,
    description: 'VPN kümesinden koordine edilmiş tıklama çiftliği saldırısı tespit edildi.',
    aiAction: 'Coğrafi sınır (Geofence) aktif. IP aralığı 45.12.x.x bloklandı.'
  },
  {
    id: 'def-2',
    title: 'Reklam Bütçe Sızıntısı',
    type: 'FRAUD',
    channel: 'GOOGLE',
    status: 'QUARANTINE',
    threatScore: 65,
    startTime: '09:00',
    duration: 240,
    description: 'Geçersiz tıklama oranı %15 eşiğini aştı.',
    aiAction: 'Kampanya duraklatıldı. 450 tıklama karantina bölgesine yönlendirildi.'
  },
  {
    id: 'def-3',
    title: 'API Hız Sınırı İhlali',
    type: 'API_ABUSE',
    channel: 'SYSTEM_API',
    status: 'NEUTRALIZED',
    threatScore: 45,
    startTime: '11:15',
    duration: 30,
    description: 'Tek bir uç noktadan (endpoint) olağandışı kimlik doğrulama isteği artışı.',
    aiAction: 'Token iptal edildi. Hız sınırı sıkılaştırıldı.'
  },
  {
    id: 'def-4',
    title: 'Rakip Veri Kazıyıcı',
    type: 'BOT',
    channel: 'LINKEDIN',
    status: 'DETECTED',
    threatScore: 55,
    startTime: '16:00',
    duration: 45,
    description: 'Çalışan profillerini okuyan veri kazıma botu (scraper).',
    aiAction: 'IP engellemesi için operatör onayı bekleniyor.'
  },
  {
    id: 'def-5',
    title: 'Oltalama (Phishing) DM Dalgası',
    type: 'PHISHING',
    channel: 'TIKTOK',
    status: 'ANALYZING',
    threatScore: 78,
    startTime: '13:00',
    duration: 180,
    description: 'Marka takipçilerine DM yoluyla zararlı bağlantılar gönderiliyor.',
    aiAction: 'İçerik analizi devam ediyor.'
  },
  {
    id: 'def-6',
    title: 'Kaba Kuvvet (Brute Force) Girişi',
    type: 'INJECTION',
    channel: 'SYSTEM_API',
    status: 'NEUTRALIZED',
    threatScore: 88,
    startTime: '02:00',
    duration: 60,
    description: 'Yönetici paneline yönelik şifre deneme saldırısı.',
    aiAction: 'IP adresleri yasaklandı. 2FA zorunlu kılındı.'
  }
];

export const MOCK_TRAFFIC_ACTORS: TrafficActor[] = [
  {
    id: 'actor-1',
    name: 'Tık Avcısı (Click Hunter)',
    type: 'BOT',
    damagePotential: 95,
    method: 'PPC Tüketim Komutları',
    volume: 'Yüksek (450 istek/dk)',
    description: 'Reklamlara hızla tıklayıp günlük bütçeyi dönüşüm olmadan tüketen otomatik yazılımlar.'
  },
  {
    id: 'actor-2',
    name: 'Dijital Hayalet',
    type: 'COMPETITOR',
    damagePotential: 60,
    method: 'Fiyat Kazıma / Casus Yazılım',
    volume: 'Düşük (Periyodik)',
    description: 'Rakipler tarafından fiyat stratejinizi ve reklam metinlerinizi izlemek için konuşlandırılan gizli botlar.'
  },
  {
    id: 'actor-3',
    name: 'Gerçek Fırsat (Genuine Lead)',
    type: 'GENUINE',
    damagePotential: 0,
    method: 'Organik Arama / Sosyal',
    volume: 'Orta',
    description: 'Yüksek satın alma niyeti gösteren gerçek insan profili (kaydırma derinliği > %50).'
  }
];

export const MOCK_BUDGET_MATRIX: BudgetMatrixPoint[] = [
  { id: 'p1', cpc: 4.50, quality: 10, source: 'Meta Display Ağı', status: 'DRAINER' },
  { id: 'p2', cpc: 3.80, quality: 5, source: 'Partner Ağı X', status: 'DRAINER' },
  { id: 'p3', cpc: 5.20, quality: 15, source: 'Bilinmeyen Yönlendirici', status: 'DRAINER' },
  { id: 'p4', cpc: 0.80, quality: 85, source: 'TikTok UGC', status: 'GEM' },
  { id: 'p5', cpc: 1.20, quality: 90, source: 'Niş Anahtar Kelime', status: 'GEM' },
  { id: 'p6', cpc: 1.50, quality: 78, source: 'Yeniden Pazarlama Listesi', status: 'GEM' },
  { id: 'p7', cpc: 2.50, quality: 50, source: 'Google Arama', status: 'NEUTRAL' },
  { id: 'p8', cpc: 2.10, quality: 45, source: 'LinkedIn Akışı', status: 'NEUTRAL' },
];

export const MOCK_SENTIMENT_FEED: SentimentItem[] = [
  { 
    id: 's1', platform: 'TWITTER', user: '@crypto_king_99', 
    text: "Bu reklam yasal mı? Link garip bir domaine yönlendiriyor... #dolandırıcılık", 
    sentiment: 'THREAT', riskScore: 92, timestamp: '2dk önce', aiFlag: 'Anahtar Kelime: DOLANDIRICILIK / YÖNLENDİRME' 
  },
  { 
    id: 's2', platform: 'INSTAGRAM', user: 'sarah.j_22', 
    text: "2 hafta önce sipariş verdim hala gelmedi. Müşteri hizmetleri ortada yok.", 
    sentiment: 'NEGATIVE', riskScore: 65, timestamp: '15dk önce', aiFlag: 'Anahtar Kelime: ORTADA YOK' 
  },
  { 
    id: 's3', platform: 'FACEBOOK', user: 'Mike Ross', 
    text: "Yeni arayüz güncellemesini sevdim! Güvenlik çok daha sıkı hissettiriyor.", 
    sentiment: 'POSITIVE', riskScore: 5, timestamp: '1s önce' 
  },
  { 
    id: 's4', platform: 'TRUSTPILOT', user: 'Anonymous', 
    text: "SAHTE PROFİL!! Resmi sayfayı taklit ediyorlar. Tıklamayın!", 
    sentiment: 'THREAT', riskScore: 98, timestamp: '3s önce', aiFlag: 'Anahtar Kelime: TAKLİT' 
  },
];

export const MOCK_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    brandName: 'LCW',
    representative: 'Mustafa K.',
    title: 'CEO',
    comment: "Sitemize yapılan organize saldırıları ve ürünlerimizi taklit eden 50'den fazla sahte web sitesini AI Shield sayesinde anında tespit ettik. Marka itibarımızı ve milyonlarca liralık bütçemizi siber hırsızlardan kurtardılar.",
    criticalMetric: 'Milyonlarca TL Tasarruf',
    threatType: 'FAKE_SITE',
    iconName: 'ShieldAlert'
  },
  {
    id: 'story-2',
    brandName: 'Arçelik',
    representative: 'Pazarlama Direktörü',
    title: 'Pazarlama Departmanı',
    comment: "Dijital reklam bütçemizin ciddi bir kısmının bot tıklamalarıyla boşa gittiğini AI Shield raporlarıyla gördük. Reklam sahtekarlığı yapan siteleri anında engelleyerek reklam verimliliğimizi %30 artırdık.",
    criticalMetric: '%30 Verimlilik Artışı',
    threatType: 'AD_FRAUD',
    iconName: 'Zap'
  },
  {
    id: 'story-3',
    brandName: 'HYS',
    representative: 'Güvenlik Yöneticisi',
    title: 'IT & Güvenlik',
    comment: "Sosyal medyada markamızı karalamaya yönelik organize atakları ve sahte kampanya duyurularını AI Shield proaktif olarak durdurdu. Dijitalde artık çok daha güvendeyiz.",
    criticalMetric: 'Proaktif İtibar Koruması',
    threatType: 'REPUTATION',
    iconName: 'ShieldCheck'
  },
  {
    id: 'story-4',
    brandName: 'X Firması',
    representative: 'Zeynep K.',
    title: 'Kurucu Girişimci',
    comment: "İşletmemi büyütmeye çalışırken Instagram ve web sitemi ele geçirmeye çalışan yazılımları AI Shield saniyeler içinde fark edip engelledi. Emeklerimin bir gecede yok olmasını önlediler.",
    criticalMetric: 'Hesap Güvenliği Onaylandı',
    threatType: 'TAKEOVER',
    iconName: 'Lock'
  }
];

export const WORLD_COORDINATES = [
  { cx: 25, cy: 35, name: 'Kuzey Amerika' },
  { cx: 30, cy: 70, name: 'Güney Amerika' },
  { cx: 50, cy: 30, name: 'Avrupa' },
  { cx: 60, cy: 40, name: 'Orta Doğu' },
  { cx: 75, cy: 35, name: 'Asya' },
  { cx: 80, cy: 75, name: 'Avustralya' },
  { cx: 52, cy: 55, name: 'Afrika' },
];
