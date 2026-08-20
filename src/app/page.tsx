"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRescueChain } from "@/lib/store";
import {
  Activity, AlertTriangle, Ambulance, ArrowRight, Bell, Bot, Building2,
  Check, ChevronDown, CircleHelp, Clock3, CloudRain, Droplets, FileText,
  Flame, Home as HomeIcon, Layers3, LayoutDashboard, MapPin, Menu, MessageSquare,
  MoreHorizontal, Navigation, Package, Radio, RefreshCw, Route, Search,
  Settings, Shield, Siren, SlidersHorizontal, Truck, Users, Waves, X, Play,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Incident = { id: string; type: string; area: string; priority: number; people: string; verified: string; tag: string; time: string; icon: typeof Waves; color: string; }; 

const incidents: Incident[] = [
  { id: "INC-0241", type: "FLOOD", area: "Beltola · Guwahati", priority: 96, people: "1,240", verified: "186", tag: "CRITICAL", time: "32 min ago", icon: Waves, color: "red" },
  { id: "INC-0238", type: "BUILDING COLLAPSE", area: "Paltan Bazaar · Guwahati", priority: 89, people: "94", verified: "61", tag: "CRITICAL", time: "48 min ago", icon: Building2, color: "red" },
  { id: "INC-0240", type: "ROAD ACCIDENT", area: "Jalukbari · Guwahati", priority: 78, people: "28", verified: "22", tag: "HIGH", time: "1 hr ago", icon: Ambulance, color: "orange" },
  { id: "INC-0236", type: "FIRE", area: "Maligaon · Guwahati", priority: 64, people: "240", verified: "128", tag: "HIGH", time: "2 hrs ago", icon: Flame, color: "orange" },
];

const chartData = [{day:"Mon", incidents:8}, {day:"Tue", incidents:12}, {day:"Wed", incidents:9}, {day:"Thu", incidents:17}, {day:"Fri", incidents:14}, {day:"Sat", incidents:21}, {day:"Sun", incidents:18}];

const nav = [
  ["COMMAND CENTER", LayoutDashboard], ["INCIDENTS", Siren], ["LIVE MAP", MapPin], ["RESOURCES", Package], ["EMERGENCY TEAMS", Users], ["HOSPITALS", Building2], ["SHELTERS", HomeIcon], ["SUPPLIES", Truck], ["SIMULATION", SlidersHorizontal], ["ANALYTICS", Activity], ["REPORTS", FileText],
] as const;
const navRoutes: Record<string, string> = { "COMMAND CENTER": "/", "INCIDENTS": "/incidents", "LIVE MAP": "/map", "RESOURCES": "/resources", "EMERGENCY TEAMS": "/teams", "HOSPITALS": "/hospitals", "SHELTERS": "/shelters", "SUPPLIES": "/supplies", "SIMULATION": "/simulation", "ANALYTICS": "/analytics", "REPORTS": "/reports" };

function StatusPill({ children, tone = "muted" }: { children: React.ReactNode; tone?: "red" | "orange" | "green" | "blue" | "muted" }) {
  return <span className={`pill pill-${tone}`}><span className="pill-dot" />{children}</span>;
}

export default function Home() {
  const router = useRouter();
  const { logout } = useRescueChain();
  const [active, setActive] = useState("COMMAND CENTER");
  const [selected, setSelected] = useState<Incident>(incidents[0]);
  const [approved, setApproved] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [rainfall, setRainfall] = useState(40);
  const [roadClosures, setRoadClosures] = useState(3);
  const [ambulanceDelta, setAmbulanceDelta] = useState(-2);
  const [mapFilter, setMapFilter] = useState<"all" | "incidents" | "resources">("all");
  const [incidentWindow, setIncidentWindow] = useState("30 days");

  const currentTime = useMemo(() => new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()), []);

  return <div className="app-shell">
    {mobileNav && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileNav(false)} />}
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="mobile-sidebar-head"><span>Navigation</span><button aria-label="Close navigation menu" onClick={() => setMobileNav(false)}><X size={20} /></button></div>
      <div className="brand"><div className="brand-mark"><Shield size={20} fill="currentColor" /></div><div><strong>RESCUECHAIN</strong><small>EMERGENCY OPERATIONS</small></div></div>
      <div className="district-switch"><div className="district-label">OPERATING AREA</div><div className="district-value">Guwahati, Assam <ChevronDown size={14} /></div><div className="demo-label"><span /> PROTOTYPE ENVIRONMENT</div></div>
      <nav className="nav-list" aria-label="Main navigation">
        {nav.map(([label, Icon]) => <button key={label} onClick={() => {setActive(label); setMobileNav(false); router.push(navRoutes[label])}} className={`nav-item ${active === label ? "active" : ""}`}><Icon size={17} strokeWidth={active === label ? 2.4 : 1.8} /><span>{label}</span>{label === "INCIDENTS" && <b className="nav-count">4</b>}</button>)}
      </nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => router.push("/notifications")}><Bell size={17} /><span>NOTIFICATIONS</span><b className="nav-count alert">3</b></button><button className="nav-item" onClick={() => router.push("/settings")}><Settings size={17} /><span>SETTINGS</span></button><div className="user-mini"><div className="avatar">ASY</div><div><b>ABHIJEET SINGH YADAV</b><small>District Administrator</small></div><button className="logout-button" onClick={logout}>Sign out</button></div></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu /></button><div className="crumb"><span>OPERATIONS</span><ArrowRight size={13} /><b>{active}</b></div><div className="top-actions"><div className="system"><span className="online-dot" /> SYSTEMS OPERATIONAL</div><div className="top-time">{currentTime} IST <span>·</span> 14 JUN 2025</div><button className="icon-button" aria-label="Open notifications" onClick={() => router.push("/notifications")}><Bell size={18} /><i /></button><div className="avatar avatar-top">ASY</div></div></header>
      <div className="page-wrap">
        <section className="page-heading"><div><div className="eyebrow"><Radio size={13} /> LIVE OPERATIONS VIEW <span className="eyebrow-line" /></div><h1>Command Center</h1><p>Simulated decision support for the Guwahati Emergency Operations Centre</p></div><div className="heading-actions"><button className="outline-button" onClick={() => window.location.reload()}><RefreshCw size={15} /> Refresh data</button><button className="primary-button" onClick={() => router.push("/incidents?new=true")}><Siren size={16} /> Report incident</button></div></section>
        <div className="notice"><div className="notice-icon"><Bot size={18} /></div><div><b>Decision support is active</b><span>Recommendations require officer review before dispatch. All figures are demo estimates unless marked verified.</span></div><button onClick={() => setDemoOpen(!demoOpen)} aria-label="Open demo controls"><SlidersHorizontal size={16} /></button></div>
        {demoOpen && <section className="demo-controls panel"><div><div className="detail-id">DEMO CONTROL ROOM</div><h2>Shape the scenario live</h2><p>Adjust conditions during the presentation. No real dispatch occurs and all outputs remain synthetic.</p></div><label>Rainfall <b>+{rainfall}%</b><input type="range" min="0" max="100" value={rainfall} onChange={(event) => setRainfall(Number(event.target.value))} /></label><label>Road closures <b>{roadClosures}</b><input type="range" min="0" max="8" value={roadClosures} onChange={(event) => setRoadClosures(Number(event.target.value))} /></label><label>Ambulances available <b>{24 + ambulanceDelta}</b><input type="range" min="-6" max="0" value={ambulanceDelta} onChange={(event) => setAmbulanceDelta(Number(event.target.value))} /></label><button className="primary-button" onClick={() => setSimulated(true)}><Play size={14} /> Apply to dashboard</button></section>}

        <section className="kpi-grid">
          <div className="kpi-card"><div className="kpi-top"><span>ACTIVE EMERGENCIES</span><Siren size={17} /></div><strong>18</strong><small><span className="up">+3</span> since 06:00 today</small></div>
          <div className="kpi-card critical-kpi"><div className="kpi-top"><span>CRITICAL PRIORITY</span><AlertTriangle size={17} /></div><strong>04</strong><small><span className="critical-text">Requires attention now</span></small></div>
          <div className="kpi-card"><div className="kpi-top"><span>PEOPLE AFFECTED</span><Users size={17} /></div><strong>3,842</strong><small><span className="estimate-tag">EST.</span> 1,136 verified</small></div>
          <div className="kpi-card"><div className="kpi-top"><span>AVAILABLE FLEET</span><Ambulance size={17} /></div><strong>24 <em>/ 31</em></strong><small>ambulances available</small></div>
          <div className="kpi-card"><div className="kpi-top"><span>RESPONSE TEAMS</span><Users size={17} /></div><strong>08 <em>/ 12</em></strong><small>teams operational</small></div>
          <div className="kpi-card warning-kpi"><div className="kpi-top"><span>HOSPITAL CAPACITY</span><Building2 size={17} /></div><strong>74%</strong><small><span className="warning-text">2 facilities above 80%</span></small></div>
        </section>

        <section className="operations-grid">
          <div className="map-card panel"><div className="panel-head"><div><h2>District situation map</h2><p><span className="live-indicator" /> Updated 2 min ago · 18 active incidents</p></div><div className="map-tools"><button aria-label="Show all map layers" className={mapFilter === "all" ? "map-tool-active" : ""} onClick={() => setMapFilter("all")}><Layers3 size={16} /></button><button aria-label="Show incidents only" className={mapFilter === "incidents" ? "map-tool-active" : ""} onClick={() => setMapFilter("incidents")}><Siren size={16} /></button><button aria-label="Show resources only" className={mapFilter === "resources" ? "map-tool-active" : ""} onClick={() => setMapFilter("resources")}><Ambulance size={16} /></button></div></div><div className="map-canvas"><div className="map-water water-a" /><div className="map-water water-b" /><div className="road road-a" /><div className="road road-b" /><div className="road road-c" /><div className="road-label label-a">NH-47</div><div className="road-label label-b">RIVERSIDE ROAD</div><div className="zone zone-a" /><div className="zone zone-b" />{mapFilter !== "resources" && [{x:49,y:37,c:"red",n:"96"},{x:73,y:27,c:"red",n:"89"},{x:29,y:60,c:"orange",n:"78"},{x:61,y:68,c:"orange",n:"64"},{x:38,y:25,c:"yellow",n:"52"}].map((p,i)=><button key={i} className={`map-pin pin-${p.c}`} style={{left:`${p.x}%`,top:`${p.y}%`}} onClick={() => setSelected(incidents[i % incidents.length])} aria-label={`Priority ${p.n} incident`}><span>{p.n}</span></button>)}{mapFilter !== "incidents" && [{x:19,y:40,icon:"A"},{x:57,y:50,icon:"R"},{x:78,y:63,icon:"H"},{x:35,y:78,icon:"S"}].map((p,i)=><div key={i} className={`map-resource resource-${p.icon}`} style={{left:`${p.x}%`,top:`${p.y}%`}}>{p.icon}</div>)}<div className="map-legend"><span><i className="legend-dot red" /> Critical</span><span><i className="legend-dot orange" /> High</span><span><i className="legend-square blue" /> Ambulance</span><span><i className="legend-square navy" /> Hospital</span></div><div className="map-scale">1 km</div></div></div>

          <div className="critical-panel panel"><div className="panel-head"><div><h2>Critical incidents</h2><p>Immediate officer attention required</p></div><span className="count-badge">4 open</span></div><div className="incident-list">{incidents.slice(0, 3).map((item) => {const Icon = item.icon; return <button className={`incident-row ${selected.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => setSelected(item)}><div className={`incident-icon ${item.color}`}><Icon size={18} /></div><div className="incident-copy"><div className="incident-title"><b>{item.id}</b><StatusPill tone={item.color === "red" ? "red" : "orange"}>{item.tag}</StatusPill></div><strong>{item.type}</strong><span><MapPin size={12} /> {item.area}</span><small>{item.time}</small></div><div className="priority-score"><b>{item.priority}</b><span>/ 100</span></div></button>})}</div><button className="view-all" onClick={() => router.push("/incidents")}>View all incidents <ArrowRight size={14} /></button></div>
        </section>

        <section className="lower-grid">
          <div className="panel incident-detail"><div className="panel-head"><div><div className="detail-id"><span className="live-indicator" /> SELECTED INCIDENT · {selected.id}</div><h2>{selected.type.charAt(0) + selected.type.slice(1).toLowerCase()} at {selected.area}</h2></div><button className="icon-button" aria-label="Open incident details" onClick={() => router.push(`/incidents?selected=${selected.id}`)}><MoreHorizontal size={18} /></button></div><div className="detail-stats"><div><span>ESTIMATED AFFECTED</span><b>{selected.people}</b><small>Medium confidence</small></div><div><span>VERIFIED AFFECTED</span><b>{selected.verified}</b><small>Responder confirmed</small></div><div><span>PRIORITY SCORE</span><b className="score-red">{selected.priority}<em>/100</em></b><small>Critical · rising</small></div></div><div className="detail-body"><div className="vulnerable"><h3>Vulnerable population</h3><div className="vuln-row"><span><Users size={14} /> Children</span><b>12 reported</b></div><div className="vuln-row"><span><Users size={14} /> Elderly</span><b>24 estimated</b></div><div className="vuln-row"><span><Activity size={14} /> Medical assistance</span><b>18 reported</b></div></div><div className="recommendation"><div className="rec-header"><div><Bot size={16} /><b>Recommended action</b></div><StatusPill tone="blue">OFFICER REVIEW</StatusPill></div><p>Deploy water rescue and medical support to Riverside Ward 18. Current access remains possible via East Bridge.</p><div className="allocation"><span><Waves size={14} /> 2 rescue boats</span><span><Users size={14} /> 1 medical team</span><span><Ambulance size={14} /> 1 ambulance</span></div><div className="rec-footer"><span><Clock3 size={13} /> Estimated response: <b>18 min</b></span><button className={approved ? "approved-button" : "primary-button"} onClick={() => setApproved(!approved)}>{approved ? <><Check size={15} /> Approved & recorded</> : <><Shield size={15} /> Review recommendation</>}</button></div></div></div><div className="explain"><b>Why this priority?</b><span>People affected +25 · Medical need +20 · Vulnerable population +15 · Rising water +10 · Limited nearby resources +7</span><ChevronDown size={15} /></div></div>

          <div className="side-stack"><div className="panel chart-panel"><div className="panel-head"><div><h2>Incident activity</h2><p>Reports received · last {incidentWindow}</p></div><label className="small-select-wrap"><select className="small-select" value={incidentWindow} aria-label="Incident activity range" onChange={(event) => {
            const nextValue = event.target.value;
            setIncidentWindow(nextValue);
            window.alert(`The dashboard is showing the most recent ${nextValue} of incident activity.`);
          }}><option value="7 days">7 days</option><option value="14 days">14 days</option><option value="30 days">30 days</option><option value="60 days">60 days</option><option value="90 days">90 days</option></select></label></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{top:8,right:4,left:-25,bottom:0}}><CartesianGrid vertical={false} stroke="#e9eef3" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:"#81909d"}} /><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:"#9aa6b2"}} /><Tooltip cursor={{fill:"#f3f6f8"}} contentStyle={{borderRadius:8,border:"1px solid #e0e7ed",fontSize:12}} /><Bar dataKey="incidents" fill="#2d6b91" radius={[3,3,0,0]} barSize={18} /></BarChart></ResponsiveContainer></div></div><div className="panel shortage-panel"><div className="panel-head"><div><h2>Resource watch</h2><p>Forecast signals from demo data</p></div><ArrowRight size={16} /></div><div className="shortage-row"><div className="shortage-icon red"><Droplets size={16} /></div><div><b>Oxygen supply</b><small>High shortage risk · 2.5 days</small></div><span className="warning-text">HIGH</span></div><div className="shortage-row"><div className="shortage-icon orange"><Ambulance size={16} /></div><div><b>Ambulances</b><small>24 available · 7 assigned</small></div><span className="warning-text">WATCH</span></div></div></div>
        </section>

        <section className="simulation-strip"><div className="sim-icon"><CloudRain size={19} /></div><div><b>Scenario planning simulator</b><span>Test changing rainfall, road access and resource availability before conditions change.</span></div><div className="sim-result">{simulated ? <><b>Scenario complete</b><span>{Math.min(12, 4 + Math.floor(rainfall / 20) + roadClosures)} critical incidents · {(2400 + rainfall * 20 + roadClosures * 150).toLocaleString()} est. affected</span></> : <><b>Current baseline</b><span>4 critical incidents · 2,400 est. affected</span></>}</div><button className="outline-button" onClick={() => setSimulated(!simulated)}>{simulated ? "Reset scenario" : "Run scenario"} <ArrowRight size={15} /></button></section>
        <footer className="footer"><span><Shield size={14} /> RESCUECHAIN · Decision support prototype</span><span><span className="demo-chip">DEMO DATA</span> Synthetic district information · Human approval required</span></footer>
      </div>
    </main>
  </div>;
}
