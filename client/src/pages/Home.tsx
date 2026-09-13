import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Download,
  Eye,
  Facebook,
  Filter,
  LayoutDashboard,
  Lightbulb,
  Link2,
  LockKeyhole,
  Megaphone,
  Menu,
  MoreHorizontal,
  MousePointerClick,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Wallet,
  X,
  Zap,
} from "lucide-react";


type View = "dashboard" | "campaigns" | "insights" | "connect" | "settings";
type Range = "7" | "14" | "30";
type MetricKey = "spend" | "clicks" | "impressions" | "roas";

const navItems: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "campaigns", label: "Kampanyalar", icon: Megaphone },
  { id: "insights", label: "AI İçgörüler", icon: Sparkles },
  { id: "connect", label: "Hesaplar", icon: Link2 },
];

const chartData = [
  { date: "04 Mar", spend: 1180, clicks: 820, impressions: 22800, roas: 2.9 },
  { date: "05 Mar", spend: 1320, clicks: 965, impressions: 26400, roas: 3.2 },
  { date: "06 Mar", spend: 1060, clicks: 760, impressions: 21700, roas: 2.7 },
  { date: "07 Mar", spend: 1490, clicks: 1120, impressions: 29100, roas: 3.5 },
  { date: "08 Mar", spend: 1680, clicks: 1290, impressions: 33800, roas: 3.8 },
  { date: "09 Mar", spend: 1540, clicks: 1185, impressions: 31400, roas: 3.6 },
  { date: "10 Mar", spend: 1890, clicks: 1430, impressions: 38700, roas: 4.1 },
  { date: "11 Mar", spend: 1760, clicks: 1350, impressions: 35900, roas: 3.9 },
  { date: "12 Mar", spend: 1930, clicks: 1490, impressions: 40100, roas: 4.3 },
  { date: "13 Mar", spend: 2120, clicks: 1650, impressions: 43800, roas: 4.5 },
  { date: "14 Mar", spend: 1980, clicks: 1540, impressions: 41600, roas: 4.2 },
  { date: "15 Mar", spend: 2280, clicks: 1800, impressions: 47200, roas: 4.7 },
  { date: "16 Mar", spend: 2410, clicks: 1940, impressions: 49900, roas: 4.9 },
  { date: "17 Mar", spend: 2350, clicks: 1860, impressions: 48300, roas: 4.8 },
  { date: "18 Mar", spend: 2590, clicks: 2050, impressions: 52600, roas: 5.1 },
  { date: "19 Mar", spend: 2490, clicks: 1980, impressions: 51100, roas: 5.0 },
  { date: "20 Mar", spend: 2720, clicks: 2180, impressions: 55800, roas: 5.3 },
  { date: "21 Mar", spend: 2860, clicks: 2330, impressions: 58100, roas: 5.5 },
  { date: "22 Mar", spend: 2680, clicks: 2200, impressions: 54900, roas: 5.2 },
  { date: "23 Mar", spend: 2940, clicks: 2410, impressions: 60100, roas: 5.6 },
  { date: "24 Mar", spend: 3050, clicks: 2540, impressions: 62700, roas: 5.8 },
  { date: "25 Mar", spend: 2980, clicks: 2470, impressions: 61300, roas: 5.7 },
  { date: "26 Mar", spend: 3220, clicks: 2690, impressions: 65800, roas: 6.0 },
  { date: "27 Mar", spend: 3150, clicks: 2630, impressions: 64200, roas: 5.9 },
  { date: "28 Mar", spend: 3380, clicks: 2830, impressions: 68400, roas: 6.2 },
  { date: "29 Mar", spend: 3490, clicks: 2940, impressions: 71100, roas: 6.4 },
  { date: "30 Mar", spend: 3350, clicks: 2830, impressions: 68900, roas: 6.1 },
  { date: "31 Mar", spend: 3610, clicks: 3060, impressions: 73100, roas: 6.5 },
  { date: "01 Nis", spend: 3720, clicks: 3180, impressions: 75800, roas: 6.7 },
  { date: "02 Nis", spend: 3890, clicks: 3340, impressions: 79000, roas: 6.9 },
];

const campaigns = [
  { id: 1, name: "Yaz Koleksiyonu 2026", channel: "Facebook + Instagram", status: "ACTIVE", objective: "Dönüşümler", spend: "₺12.400", roas: "3,2x", ctr: "%4,1", budget: "₺1.250 / gün", color: "blue" },
  { id: 2, name: "Marka Bilinirliği Q1", channel: "Instagram", status: "ACTIVE", objective: "Erişim", spend: "₺8.900", roas: "2,1x", ctr: "%2,8", budget: "₺850 / gün", color: "violet" },
  { id: 3, name: "Retargeting · Sepet", channel: "Facebook + Instagram", status: "PAUSED", objective: "Dönüşümler", spend: "₺5.600", roas: "5,8x", ctr: "%6,2", budget: "₺600 / gün", color: "amber" },
  { id: 4, name: "Yeni Müşteri Kazanım", channel: "Facebook", status: "ACTIVE", objective: "Trafik", spend: "₺9.230", roas: "1,9x", ctr: "%1,4", budget: "₺950 / gün", color: "emerald" },
  { id: 5, name: "Bahar Video Serisi", channel: "Instagram Reels", status: "ACTIVE", objective: "Video Görüntüleme", spend: "₺6.480", roas: "3,7x", ctr: "%5,4", budget: "₺540 / gün", color: "cyan" },
];

const recommendations = [
  { priority: "YÜKSEK", icon: Target, accent: "red", title: "Retargeting kampanyasını yeniden aktif edin", impact: "+%58 ROAS bekleniyor", rationale: "Duraklatılmış Sepet kampanyası 5,8x ROAS ile hesabınızın en verimli kampanyası. Günlük bütçeyi kademeli artırın.", tag: "Bütçe optimizasyonu" },
  { priority: "YÜKSEK", icon: Video, accent: "blue", title: "Video içerik oranını %30’dan %60’a çıkarın", impact: "+%45 CTR bekleniyor", rationale: "Son 14 günde video içerikler statik görsellere göre 2,3 kat daha fazla tıklama aldı.", tag: "İçerik stratejisi" },
  { priority: "ORTA", icon: Users, accent: "amber", title: "25–34 yaş kadın segmentine bütçe kaydırın", impact: "-%30 CPC bekleniyor", rationale: "Bu segment harcamanın %22’sini alırken dönüşümlerin %41’ini üretiyor.", tag: "Hedef kitle" },
  { priority: "ORTA", icon: Clock3, accent: "violet", title: "Gösterim zamanlamasını 18:00–22:00 aralığına yoğunlaştırın", impact: "+%22 dönüşüm oranı", rationale: "Akşam saatlerinde CPC ortalama %31 daha düşük, dönüşüm oranı %22 daha yüksek.", tag: "Zamanlama" },
  { priority: "DÜŞÜK", icon: Lightbulb, accent: "emerald", title: "Marka Bilinirliği bütçesini %20 azaltın", impact: "₺1.780 / ay tasarruf", rationale: "Frekans 4,2 ile önerilen eşiğin üzerinde. Reklam yorgunluğu başlamış olabilir.", tag: "Verimlilik" },
];

const accounts = [
  { name: "Moda Markası TR", id: "act_123456789", spend: "₺45.230", impressions: "1,2M", status: "Bağlı", color: "#2d7dff" },
  { name: "E-Ticaret Mağaza", id: "act_987654321", spend: "₺28.750", impressions: "890K", status: "Bağlı", color: "#8b5cf6" },
];

const metricOptions: { key: MetricKey; label: string; color: string; icon: LucideIcon }[] = [
  { key: "spend", label: "Harcama", color: "#3b82f6", icon: Wallet },
  { key: "clicks", label: "Tıklama", color: "#2dd4bf", icon: MousePointerClick },
  { key: "impressions", label: "Gösterim", color: "#f59e0b", icon: Eye },
  { key: "roas", label: "ROAS", color: "#a78bfa", icon: TrendingUp },
];

const money = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 1 });

function formatMetric(value: number, metric: MetricKey) {
  if (metric === "spend") return `₺${money.format(value)}`;
  if (metric === "roas") return `${decimal.format(value)}x`;
  return compact.format(value);
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "ACTIVE" || status === "Bağlı";
  return (
    <span className={`status-badge ${active ? "status-active" : "status-paused"}`}>
      <span className="status-dot" />
      {status === "ACTIVE" ? "Aktif" : status === "PAUSED" ? "Duraklatıldı" : status}
    </span>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup">
      <div className="brand-mark"><Activity size={19} strokeWidth={2.4} /></div>
      {!compact && <div><div className="brand-name">reklam<span>rapor</span></div><div className="brand-caption">PERFORMANS STÜDYOSU</div></div>}
    </div>
  );
}

function Sidebar({ view, setView, onLogout }: { view: View; setView: (view: View) => void; onLogout: () => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Logo />
        <button className="icon-button sidebar-collapse" aria-label="Menüyü daralt"><Menu size={18} /></button>
      </div>
      <div className="workspace-switcher">
        <div className="workspace-avatar">M</div>
        <div className="workspace-copy"><span>Çalışma alanı</span><strong>Moda Markası TR</strong></div>
        <ChevronDown size={15} className="muted-icon" />
      </div>
      <div className="nav-section-label">Çalışma alanı</div>
      <nav className="main-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${view === id ? "nav-item-active" : ""}`} onClick={() => setView(id)}>
            <Icon size={18} strokeWidth={view === id ? 2.3 : 1.8} />
            <span>{label}</span>
            {id === "insights" && <span className="nav-count">5</span>}
          </button>
        ))}
      </nav>
      <div className="nav-section-label">Yönetim</div>
      <nav className="main-nav">
        <button className={`nav-item ${view === "settings" ? "nav-item-active" : ""}`} onClick={() => setView("settings")}><Settings size={18} /><span>Ayarlar</span></button>
        <button className="nav-item" onClick={() => setView("connect")}><CircleHelp size={18} /><span>Yardım merkezi</span></button>
      </nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <div className="upgrade-icon"><Zap size={16} /></div>
          <div><strong>Pro analitik</strong><p>Daha derin içgörüler keşfedin.</p></div>
          <ArrowRight size={16} />
        </div>
        <div className="profile-row">
          <div className="profile-avatar">DA</div>
          <div className="profile-copy"><strong>Demo Kullanıcı</strong><span>demo@reklamrapor.com</span></div>
          <button className="icon-button profile-more" onClick={onLogout} title="Çıkış yap"><MoreHorizontal size={18} /></button>
        </div>
      </div>
    </aside>
  );
}

function MobileNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <nav className="mobile-nav">
      {navItems.slice(0, 4).map(({ id, label, icon: Icon }) => (
        <button key={id} className={`mobile-nav-item ${view === id ? "mobile-nav-item-active" : ""}`} onClick={() => setView(id)}>
          <Icon size={19} /><span>{id === "dashboard" ? "Özet" : id === "campaigns" ? "Kampanya" : id === "insights" ? "AI İçgörü" : "Hesap"}</span>
        </button>
      ))}
    </nav>
  );
}

function Topbar({ title, subtitle, onSync, syncing, onConnect }: { title: string; subtitle: string; onSync: () => void; syncing: boolean; onConnect: () => void }) {
  return (
    <header className="topbar">
      <div className="topbar-heading"><p>PERFORMANS STÜDYOSU <span className="heading-dot" /> MART 2026</p><h1>{title}</h1><span>{subtitle}</span></div>
      <div className="topbar-actions">
        <button className="date-picker"><CalendarDays size={16} /><span>04 Mar — 02 Nis 2026</span><ChevronDown size={15} /></button>
        <button className={`icon-button notification-button ${syncing ? "is-loading" : ""}`} onClick={onSync} title="Veriyi yenile"><RefreshCw size={17} /></button>
        <button className="icon-button notification-button" title="Bildirimler"><Bell size={17} /><span className="notification-dot" /></button>
        <button className="primary-button topbar-connect" onClick={onConnect}><Plus size={16} /> Hesap bağla</button>
      </div>
    </header>
  );
}

function KpiCard({ label, value, change, icon: Icon, tone, note }: { label: string; value: string; change: string; icon: LucideIcon; tone: string; note: string }) {
  const positive = !change.startsWith("-");
  return (
    <div className="kpi-card">
      <div className="kpi-top"><span className={`kpi-icon kpi-icon-${tone}`}><Icon size={17} /></span><span className={`trend-pill ${positive ? "trend-positive" : "trend-negative"}`}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{change}</span></div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-note">{note}</div>
    </div>
  );
}

function PerformanceChart({ range, metric, setMetric }: { range: Range; metric: MetricKey; setMetric: (metric: MetricKey) => void }) {
  const visible = chartData.slice(-Number(range));
  const option = metricOptions.find((item) => item.key === metric) ?? metricOptions[0];
  const width = 820;
  const height = 260;
  const padX = 14;
  const padY = 22;
  const values = visible.map((item) => item[metric]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = visible.map((item, index) => {
    const x = padX + (index / Math.max(visible.length - 1, 1)) * (width - padX * 2);
    const y = height - padY - ((item[metric] - min) / span) * (height - padY * 2);
    return `${x},${y}`;
  });
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width - padX},${height - padY} L ${padX},${height - padY} Z`;
  const labelEvery = Math.max(1, Math.ceil(visible.length / 5));

  return (
    <section className="panel chart-panel">
      <div className="panel-header chart-header"><div><div className="eyebrow"><span className="eyebrow-dot" /> KAMPANYA PERFORMANSI</div><h2>Performans eğrisi</h2></div><button className="secondary-button download-button"><Download size={15} /> Raporu indir</button></div>
      <div className="metric-tabs">
        {metricOptions.map(({ key, label, color, icon: Icon }) => <button key={key} className={`metric-tab ${metric === key ? "metric-tab-active" : ""}`} onClick={() => setMetric(key)} style={metric === key ? { color, borderColor: `${color}55`, background: `${color}12` } : undefined}><Icon size={14} />{label}</button>)}
      </div>
      <div className="chart-wrap">
        <div className="chart-y-labels"><span>{formatMetric(max, metric)}</span><span>{formatMetric(min + span * 0.66, metric)}</span><span>{formatMetric(min + span * 0.33, metric)}</span><span>{formatMetric(min, metric)}</span></div>
        <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${option.label} performans grafiği`} preserveAspectRatio="none">
          <defs><linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={option.color} stopOpacity="0.28" /><stop offset="100%" stopColor={option.color} stopOpacity="0" /></linearGradient></defs>
          {[0, 1, 2, 3].map((row) => <line key={row} x1={padX} x2={width - padX} y1={padY + row * ((height - padY * 2) / 3)} y2={padY + row * ((height - padY * 2) / 3)} stroke="rgba(148,163,184,0.12)" strokeDasharray="3 7" />)}
          <path d={areaPath} fill="url(#chartGradient)" />
          <path d={linePath} fill="none" stroke={option.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {visible.map((item, index) => { const [x, y] = points[index].split(","); return index === visible.length - 1 || index === Math.floor(visible.length / 2) ? <circle key={item.date} cx={x} cy={y} r="5" fill="#111827" stroke={option.color} strokeWidth="3" /> : null; })}
        </svg>
      </div>
      <div className="chart-x-labels">{visible.map((item, index) => index % labelEvery === 0 ? <span key={item.date}>{item.date}</span> : <span key={item.date} />)}</div>
      <div className="chart-footnote"><span><span className="legend-line" style={{ background: option.color }} />{option.label} <strong>{formatMetric(values[values.length - 1], metric)}</strong></span><span className="chart-period"><TrendingUp size={14} /> Son 7 günde %18,4 artış</span></div>
    </section>
  );
}

function CampaignPreview({ setView }: { setView: (view: View) => void }) {
  return (
    <section className="panel campaign-panel">
      <div className="panel-header"><div><div className="eyebrow"><span className="eyebrow-dot violet-dot" /> AKTİF PORTFÖY</div><h2>Kampanyalar</h2></div><button className="text-button" onClick={() => setView("campaigns")}>Tümünü gör <ArrowRight size={14} /></button></div>
      <div className="campaign-list">{campaigns.slice(0, 4).map((campaign) => <div className="campaign-row" key={campaign.id}><div className={`campaign-avatar campaign-avatar-${campaign.color}`}><Megaphone size={16} /></div><div className="campaign-main"><div className="campaign-name-line"><strong>{campaign.name}</strong><StatusBadge status={campaign.status} /></div><span>{campaign.channel} · {campaign.objective}</span></div><div className="campaign-stat"><span>Harcama</span><strong>{campaign.spend}</strong></div><div className="campaign-stat campaign-stat-roas"><span>ROAS</span><strong>{campaign.roas}</strong></div><button className="icon-button small-icon"><MoreHorizontal size={16} /></button></div>)}</div>
    </section>
  );
}

function InsightRail({ setView, acted, setActed }: { setView: (view: View) => void; acted: number | null; setActed: (id: number | null) => void }) {
  return (
    <section className="panel insight-panel">
      <div className="panel-header"><div><div className="eyebrow"><span className="eyebrow-dot amber-dot" /> AI ÖNERİLERİ</div><h2>Bugün neyi iyileştirebilirsiniz?</h2></div><button className="sparkle-button" onClick={() => setView("insights")}><Sparkles size={16} /> 5 içgörü</button></div>
      <div className="insight-list">{recommendations.slice(0, 3).map((item, index) => { const Icon = item.icon; return <div className={`insight-item insight-${item.accent}`} key={item.title}><div className={`insight-icon insight-icon-${item.accent}`}><Icon size={17} /></div><div className="insight-copy"><div className="insight-meta"><span>{item.priority}</span><span>{item.tag}</span></div><strong>{item.title}</strong><p>{item.impact}</p></div>{acted === index ? <span className="acted-check"><Check size={15} /></span> : <button className="insight-action" onClick={() => setActed(index)}><ArrowRight size={16} /></button>}</div>; })}</div>
      <button className="insight-footer" onClick={() => setView("insights")}>Tüm önerileri incele <ArrowRight size={15} /></button>
    </section>
  );
}

function Dashboard({ range, setRange, metric, setMetric, setView, syncMessage, onSync, syncing, acted, setActed }: { range: Range; setRange: (range: Range) => void; metric: MetricKey; setMetric: (metric: MetricKey) => void; setView: (view: View) => void; syncMessage: string; onSync: () => void; syncing: boolean; acted: number | null; setActed: (id: number | null) => void }) {
  return <>
    <div className="dashboard-summary"><div><p className="summary-kicker">HESABINIZ ÖZETİ</p><h2>Merhaba, Demo Kullanıcı <span>✦</span></h2><p className="summary-sub">Son 30 günde reklam performansınız istikrarlı biçimde büyüyor.</p></div><div className="summary-status"><span className={`sync-status ${syncing ? "syncing" : ""}`}><span className="sync-pulse" />{syncing ? "Veriler yenileniyor" : syncMessage || "Son güncelleme 4 dk önce"}</span><button className="secondary-button" onClick={onSync}><RefreshCw size={15} className={syncing ? "spin" : ""} /> Yenile</button></div></div>
    <div className="range-row"><div className="range-tabs">{(["7", "14", "30"] as Range[]).map((value) => <button key={value} className={range === value ? "range-active" : ""} onClick={() => setRange(value)}>{value} gün</button>)}</div><div className="comparison-note"><TrendingUp size={14} /> Önceki döneme göre <strong>%18,4 daha iyi</strong></div></div>
    <div className="kpi-grid"><KpiCard label="Toplam harcama" value="₺54.820" change="%12,8" icon={Wallet} tone="blue" note="Geçen döneme göre" /><KpiCard label="Gösterim" value="1,42M" change="%8,6" icon={Eye} tone="amber" note="Erişim istikrarlı" /><KpiCard label="Tıklama" value="38.420" change="%18,4" icon={MousePointerClick} tone="teal" note="Trafik kalitesi arttı" /><KpiCard label="Dönüşüm" value="2.846" change="%24,1" icon={Target} tone="violet" note="Hedefin üzerinde" /><KpiCard label="Ort. CTR" value="%4,82" change="%0,3" icon={TrendingUp} tone="pink" note="Sektör ort. %2,9" /><KpiCard label="Ort. CPC" value="₺1,43" change="-%5,2" icon={MousePointerClick} tone="slate" note="Maliyet düşüyor" /></div>
    <div className="content-grid"><PerformanceChart range={range} metric={metric} setMetric={setMetric} /><CampaignPreview setView={setView} /></div>
    <InsightRail setView={setView} acted={acted} setActed={setActed} />
  </>;
}

function CampaignsView() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tümü");
  const filtered = campaigns.filter((campaign) => campaign.name.toLowerCase().includes(query.toLowerCase()) && (filter === "Tümü" || (filter === "Aktif" ? campaign.status === "ACTIVE" : campaign.status === "PAUSED")));
  return <div className="view-stack"><div className="view-intro"><div><div className="eyebrow"><span className="eyebrow-dot violet-dot" /> REKLAM YÖNETİMİ</div><h2>Tüm kampanyalar</h2><p>Portföyünüzün tamamını tek ekranda takip edin.</p></div><button className="primary-button"><Plus size={16} /> Yeni kampanya</button></div><div className="filter-bar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kampanya ara..." /></div><div className="filter-tabs">{["Tümü", "Aktif", "Duraklatıldı"].map((item) => <button key={item} className={filter === item ? "filter-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="secondary-button"><Filter size={15} /> Filtrele</button></div><div className="panel table-panel"><div className="table-head"><span>Kampanya</span><span>Durum</span><span>Günlük bütçe</span><span>Harcama</span><span>ROAS</span><span>CTR</span><span /></div>{filtered.map((campaign) => <div className="table-row" key={campaign.id}><div className="campaign-main"><div className={`campaign-avatar campaign-avatar-${campaign.color}`}><Megaphone size={16} /></div><div><strong>{campaign.name}</strong><span>{campaign.channel} · {campaign.objective}</span></div></div><StatusBadge status={campaign.status} /><span className="table-value">{campaign.budget}</span><strong className="table-value">{campaign.spend}</strong><strong className="table-value roas-value">{campaign.roas}</strong><span className="table-value">{campaign.ctr}</span><button className="icon-button small-icon"><MoreHorizontal size={16} /></button></div>)}{filtered.length === 0 && <div className="empty-state"><Search size={22} /><strong>Sonuç bulunamadı</strong><span>Farklı bir kampanya adı deneyin.</span></div>}</div></div>;
}

function InsightsView({ acted, setActed }: { acted: number | null; setActed: (id: number | null) => void }) {
  return <div className="view-stack"><div className="view-intro insight-intro"><div><div className="eyebrow"><span className="eyebrow-dot amber-dot" /> YAPAY ZEKA DESTEKLİ</div><h2>AI içgörüler</h2><p>Hesabınızdaki sinyalleri fırsata dönüştüren öneriler.</p></div><div className="ai-score"><Sparkles size={18} /><div><span>HESAP SAĞLIĞI</span><strong>86 / 100</strong></div></div></div><div className="insight-banner"><div className="banner-orbit" /><div className="banner-icon"><Sparkles size={24} /></div><div><strong>Bu hafta 3 büyüme fırsatı tespit edildi</strong><p>AI analiz motoru 30 günlük verinizi taradı ve toplamda ₺14.280 ek potansiyel gelir öngörüyor.</p></div><ArrowRight size={18} /></div><div className="full-insight-grid">{recommendations.map((item, index) => { const Icon = item.icon; return <article className={`full-insight-card insight-${item.accent}`} key={item.title}><div className="full-insight-top"><div className={`insight-icon insight-icon-${item.accent}`}><Icon size={19} /></div><span className={`priority-label priority-${item.accent}`}>{item.priority}</span></div><span className="insight-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.rationale}</p><div className="impact-row"><strong>{item.impact}</strong>{acted === index ? <span className="action-done"><Check size={14} /> Uygulandı</span> : <button onClick={() => setActed(index)}>Öneriyi uygula <ArrowRight size={14} /></button>}</div></article>; })}</div></div>;
}

function ConnectView({ connected, setConnected }: { connected: boolean; setConnected: (connected: boolean) => void }) {
  const [connecting, setConnecting] = useState(false);
  const handleConnect = () => { setConnecting(true); window.setTimeout(() => { setConnecting(false); setConnected(true); }, 1200); };
  return <div className="view-stack"><div className="view-intro"><div><div className="eyebrow"><span className="eyebrow-dot blue-dot" /> ENTEGRASYONLAR</div><h2>Reklam hesapları</h2><p>Meta reklam verilerinizi güvenli biçimde tek yerde yönetin.</p></div><button className="primary-button" onClick={handleConnect}><Plus size={16} /> Hesap bağla</button></div><div className="connect-hero"><div className="connect-hero-icon"><Facebook size={28} /></div><div><span className="eyebrow">META ADS BAĞLANTISI</span><h3>{connected ? "Meta hesabınız bağlı" : "Meta reklam hesabınızı bağlayın"}</h3><p>{connected ? "Reklam verileriniz otomatik olarak senkronize ediliyor." : "Kampanyalarınızı, harcamalarınızı ve dönüşümlerinizi canlı takip edin."}</p></div><div className="connect-hero-action">{connecting ? <span className="connecting-label"><RefreshCw size={15} className="spin" /> Bağlanıyor...</span> : connected ? <span className="connected-label"><CheckCircle2 size={16} /> Bağlı</span> : <button className="primary-button" onClick={handleConnect}>Facebook ile bağlan <ArrowRight size={15} /></button>}</div></div><div className="account-grid">{accounts.map((account) => <article className="account-card" key={account.id}><div className="account-card-top"><div className="account-platform" style={{ background: `${account.color}16`, color: account.color }}><Facebook size={17} /></div><StatusBadge status={account.status} /><button className="icon-button small-icon"><MoreHorizontal size={16} /></button></div><h3>{account.name}</h3><span className="account-id">{account.id}</span><div className="account-metrics"><div><span>Bu ay harcama</span><strong>{account.spend}</strong></div><div><span>Gösterim</span><strong>{account.impressions}</strong></div></div><div className="account-footer"><span><ShieldCheck size={14} /> Salt okunur erişim</span><button>Detay <ArrowRight size={13} /></button></div></article>)}</div><div className="security-note"><LockKeyhole size={18} /><div><strong>Verileriniz güvende</strong><p>OAuth bağlantısı yalnızca reklam raporlarını okuma izni ister. Erişimi istediğiniz zaman kaldırabilirsiniz.</p></div></div></div>;
}

function SettingsView() {
  return <div className="view-stack"><div className="view-intro"><div><div className="eyebrow"><span className="eyebrow-dot slate-dot" /> HESAP AYARLARI</div><h2>Ayarlar</h2><p>Çalışma alanınızı ve bildirim tercihlerinizi yönetin.</p></div></div><div className="settings-grid"><section className="panel settings-panel"><div className="settings-heading"><div className="settings-heading-icon"><Settings size={17} /></div><div><h3>Çalışma alanı</h3><p>Raporlarınızda görünen temel bilgiler.</p></div></div><label>Çalışma alanı adı<input defaultValue="Moda Markası TR" /></label><label>Para birimi<select defaultValue="TRY"><option value="TRY">Türk Lirası (₺)</option><option value="USD">Amerikan Doları ($)</option></select></label><button className="primary-button settings-save"><Check size={15} /> Değişiklikleri kaydet</button></section><section className="panel settings-panel"><div className="settings-heading"><div className="settings-heading-icon"><Bell size={17} /></div><div><h3>Bildirimler</h3><p>Önemli gelişmelerden haberdar olun.</p></div></div><div className="toggle-row"><div><strong>Haftalık rapor</strong><span>Her pazartesi e-posta özeti</span></div><button className="toggle toggle-on"><span /></button></div><div className="toggle-row"><div><strong>Performans uyarıları</strong><span>ROAS düştüğünde bildirim gönder</span></div><button className="toggle toggle-on"><span /></button></div><div className="toggle-row"><div><strong>AI fırsat bildirimleri</strong><span>Yeni önerileri anında alın</span></div><button className="toggle"><span /></button></div></section></div></div>;
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!email || password.length < 6) { setError("Demo için geçerli bir e-posta ve en az 6 karakterli şifre girin."); return; } setError(""); setLoading(true); window.setTimeout(() => { setLoading(false); onLogin(); }, 700); };
  return <div className="login-page"><div className="login-orb orb-one" /><div className="login-orb orb-two" /><div className="login-side"><Logo /><div className="login-side-copy"><span className="eyebrow">REKLAM RAPOR · 2026</span><h1>Reklam verisini<br /><em>büyüme sinyaline</em> çevirin.</h1><p>Meta reklam hesaplarınızı tek bir odak ekranında izleyin, optimize edin ve daha hızlı karar verin.</p><div className="login-testimonial"><div className="testimonial-stars">★★★★★</div><p>“Ne olup bittiğini anlamak için artık beş farklı ekran açmıyorum.”</p><span>— Ece, Moda Markası TR</span></div></div><div className="login-side-footer"><span><ShieldCheck size={15} /> Kurumsal düzeyde veri güvenliği</span><span>© 2026 Reklam Rapor</span></div></div><div className="login-card-wrap"><div className="login-card"><div className="mobile-login-logo"><Logo compact /></div><div className="login-heading"><div className="login-icon"><Activity size={21} /></div><span>Çalışma alanınıza hoş geldiniz</span><h2>Hesabınıza giriş yapın</h2><p>Reklam performansınızı tek bakışta yönetin.</p></div><form onSubmit={submit} className="login-form"><label>E-posta adresi<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ornek@mail.com" /></label><label>Şifre<div className="password-field"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" /><button type="button">Göster</button></div></label>{error && <div className="form-error"><AlertTriangle size={15} />{error}</div>}<button className="primary-button login-submit" disabled={loading}>{loading ? <><RefreshCw size={16} className="spin" /> Giriş yapılıyor</> : <>Giriş yap <ArrowRight size={16} /></>}</button></form><div className="login-divider"><span>veya</span></div><button className="demo-button" onClick={onLogin}><Sparkles size={16} /> Demo hesabı ile devam et</button><p className="login-legal">Devam ederek <u>Kullanım Koşulları</u> ve <u>Gizlilik Politikası</u>'nı kabul etmiş olursunuz.</p></div></div></div>;
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [range, setRange] = useState<Range>("7");
  const [metric, setMetric] = useState<MetricKey>("spend");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [acted, setActed] = useState<number | null>(null);
  const [connected, setConnected] = useState(true);
  const pageTitle = useMemo(() => ({ dashboard: ["Genel Bakış", "Hesabınızın performansını tek bakışta takip edin."], campaigns: ["Kampanyalar", "Kampanyalarınızı yönetin ve verimi artırın."], insights: ["AI İçgörüler", "Verilerinizin söylediği fırsatları keşfedin."], connect: ["Hesaplar", "Bağlı reklam hesaplarınızı yönetin."], settings: ["Ayarlar", "Çalışma alanı tercihlerinizi güncelleyin."] }[view]), [view]);
  const sync = () => { setSyncing(true); setSyncMessage(""); window.setTimeout(() => { setSyncing(false); setSyncMessage("Az önce güncellendi"); window.setTimeout(() => setSyncMessage(""), 3200); }, 1200); };
  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  return <div className="app-shell"><Sidebar view={view} setView={setView} onLogout={() => setLoggedIn(false)} /><main className="main-area"><Topbar title={pageTitle[0]} subtitle={pageTitle[1]} onSync={sync} syncing={syncing} onConnect={() => setView("connect")} /><div className="page-content">{view === "dashboard" && <Dashboard range={range} setRange={setRange} metric={metric} setMetric={setMetric} setView={setView} syncMessage={syncMessage} onSync={sync} syncing={syncing} acted={acted} setActed={setActed} />}{view === "campaigns" && <CampaignsView />}{view === "insights" && <InsightsView acted={acted} setActed={setActed} />}{view === "connect" && <ConnectView connected={connected} setConnected={setConnected} />}{view === "settings" && <SettingsView />}</div></main><MobileNav view={view} setView={setView} /></div>;
}
