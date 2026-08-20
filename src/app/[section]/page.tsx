"use client";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Activity, Ambulance, ArrowLeft, ArrowRight, BarChart3, Bell, Bot, Building2, CheckCircle2, ChevronDown, Clock3, FileText, Home, LayoutDashboard, MapPin, Menu, Package, Play, Plus, RefreshCw, Settings, Shield, Siren, SlidersHorizontal, Truck, Users, Waves, X } from "lucide-react";
import { ResponsiveContainer, Pie, PieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { useRescueChain } from "@/lib/store";
import { incidentSchema, searchSchema } from "@/lib/validation";

const labels: Record<string, string> = { incidents: "Incidents", map: "Live Map", resources: "Resources", teams: "Emergency Teams", hospitals: "Hospitals", shelters: "Shelters", supplies: "Supply Depots", simulation: "Scenario Simulation", analytics: "Analytics", reports: "Reports", notifications: "Notifications", settings: "Settings" };
const resourceRows = [["AMB-04", "Ambulance", "Central Station", "AVAILABLE", "—", "—"], ["BOAT-03", "Rescue Boat", "East Depot", "AVAILABLE", "—", "18 min"], ["MED-02", "Medical Team", "District Hospital", "ASSIGNED", "INC-0241", "18 min"], ["FRT-07", "Fire Truck", "North Station", "EN_ROUTE", "INC-0236", "11 min"], ["AMB-08", "Ambulance", "Central Station", "MAINTENANCE", "—", "—"]];
const chart = [{ name: "Mon", value: 8 }, { name: "Tue", value: 12 }, { name: "Wed", value: 9 }, { name: "Thu", value: 17 }, { name: "Fri", value: 14 }, { name: "Sat", value: 21 }, { name: "Sun", value: 18 }];

function Layout({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);
  const menu: [string, string, typeof LayoutDashboard][] = [["COMMAND CENTER", "/", LayoutDashboard], ["INCIDENTS", "/incidents", Siren], ["LIVE MAP", "/map", MapPin], ["RESOURCES", "/resources", Package], ["EMERGENCY TEAMS", "/teams", Users], ["HOSPITALS", "/hospitals", Building2], ["SHELTERS", "/shelters", Home], ["SUPPLIES", "/supplies", Truck], ["SIMULATION", "/simulation", SlidersHorizontal], ["ANALYTICS", "/analytics", BarChart3], ["REPORTS", "/reports", FileText]];
  const navigate = (path: string) => { setMobileNav(false); router.push(path); };
  return <div className="app-shell">{mobileNav && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileNav(false)} />}<aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}><div className="mobile-sidebar-head"><span>Navigation</span><button aria-label="Close navigation menu" onClick={() => setMobileNav(false)}><X size={20} /></button></div><div className="brand"><div className="brand-mark"><Shield size={20} fill="currentColor" /></div><div><strong>RESCUECHAIN</strong><small>EMERGENCY OPERATIONS</small></div></div><div className="district-switch"><div className="district-label">OPERATING DISTRICT</div><div className="district-value">Guwahati, Assam <ChevronDown size={14} /></div><div className="demo-label"><span /> DEMO ENVIRONMENT</div></div><nav className="nav-list" aria-label="Main navigation">{menu.map(([name, path, Icon]) => <button key={path} className={`nav-item ${pathname === path ? "active" : ""}`} onClick={() => navigate(path)}><Icon size={16} /><span>{name}</span></button>)}</nav><div className="sidebar-bottom"><button className="nav-item" onClick={() => navigate("/notifications")}><Bell size={16} /><span>NOTIFICATIONS</span><b className="nav-count alert">3</b></button><button className="nav-item" onClick={() => navigate("/settings")}><Settings size={16} /><span>SETTINGS</span></button><button className="user-mini" onClick={() => navigate("/settings")}><div className="avatar">ASY</div><div><b>ABHIJEET SINGH YADAV</b><small>District Administrator</small></div></button></div></aside><main className="main-content"><header className="topbar"><button className="mobile-menu" aria-label="Open navigation menu" aria-expanded={mobileNav} onClick={() => setMobileNav((open) => !open)}><Menu size={21} /></button><div className="crumb"><span>OPERATIONS</span><ArrowRight size={13} /><b>{title.toUpperCase()}</b></div><div className="top-actions"><div className="system"><span className="online-dot" /> SYSTEMS OPERATIONAL</div><div className="top-time">14 JUN 2025 · 14:32 IST</div><button className="icon-button" aria-label="Open notifications" onClick={() => navigate("/notifications")}><Bell size={18} /><i /></button><button className="avatar avatar-top" aria-label="Open user settings" onClick={() => navigate("/settings")}>ASY</button></div></header><div className="page-wrap">{children}</div></main></div>;
}

export default function SectionPage() {
  const { section } = useParams<{ section: string }>();
  const { incidents, approved, approve, simulation, setSimulation } = useRescueChain();
  const title = labels[section] || "Operations";
  const icon = section === "hospitals" ? <Building2 /> : section === "supplies" ? <Package /> : section === "resources" ? <Truck /> : section === "teams" ? <Users /> : section === "shelters" ? <Home /> : section === "analytics" ? <BarChart3 /> : <Siren />;
  const page = useMemo(() => {
    if (section === "incidents") return <IncidentWorkspace incidents={incidents} />;
    if (section === "teams") return <TeamsWorkspace />;
    if (section === "map") return <MapWorkspace />;
    if (section === "hospitals") return <FacilitiesWorkspace kind="hospitals" />;
    if (section === "shelters") return <FacilitiesWorkspace kind="shelters" />;
    if (section === "reports") return <ReportsWorkspace />;
    if (section === "notifications") return <NotificationWorkspace />;
    if (section === "resources") return <><PageHeading title="Resource readiness" subtitle="Fleet, teams and supplies available for officer allocation" action="Add resource" /><div className="metric-strip"><Metric label="Available" value="24" note="of 31 ambulances" /><Metric label="Assigned" value="11" note="across 6 incidents" /><Metric label="En route" value="08" note="live tracking" /><Metric label="Maintenance" value="03" note="requires review" /></div><DataTable headers={["Resource ID", "Type", "Location", "Status", "Assigned incident", "ETA"]} rows={resourceRows.map((row) => row.map((cell, index) => index === 3 ? <Status key={String(cell)} status={String(cell)} /> : cell))} /></>;
    if (section === "analytics") return <AnalyticsWorkspace />;
    if (section === "simulation") return <SimulationWorkspace />;
    return <><PageHeading title={title} subtitle="Operational records and decision support for Guwahati, Assam" action={section === "reports" ? "Export report" : undefined} /><div className="section-hero panel"><div className="section-hero-icon">{icon}</div><div><h2>{title} workspace</h2><p>This module is connected to the shared demo state and ready for agency data adapters. Use the Command Center for the five-minute operational walkthrough.</p><div className="hero-actions"><button className="primary-button" onClick={() => window.location.href = "/"}>Open Command Center <ArrowRight size={14} /></button><button className="outline-button" onClick={() => window.location.reload()}><RefreshCw size={14} /> Refresh records</button></div></div></div><div className="metric-strip"><Metric label="Operational records" value="128" note="demo records" /><Metric label="Requires review" value="07" note="officer attention" /><Metric label="Last updated" value="2 min" note="system status online" /></div><div className="panel empty-table"><div className="empty-icon"><CheckCircle2 /></div><b>No live agency connection</b><p>Demo mode is active. Synthetic records keep this prototype safe and presentation-ready.</p></div></>;
  }, [section, title, icon, incidents, simulation, setSimulation]);
  return <Layout title={title}>{page}</Layout>;
}

function IncidentWorkspace({ incidents }: { incidents: ReturnType<typeof useRescueChain>["incidents"] }) {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(() => searchParams.get("new") === "true");
  const [viewing, setViewing] = useState<(typeof incidents)[number] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState("FLOOD");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [affected, setAffected] = useState("");
  const [search, setSearch] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0);
  const safeSearch = searchSchema.safeParse(search).data ?? "";
  const filtered = incidents.filter((item) => `${item.id} ${item.category} ${item.location}`.toLowerCase().includes(safeSearch.toLowerCase()));
  function submitIncident(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Date.now() - lastSubmittedAt < 15_000) { setFormError("Please wait 15 seconds before submitting another report."); return; }
    const result = incidentSchema.safeParse({ title: title || description, category, location, description, countQuality: "UNKNOWN", affectedPeople: affected === "" ? undefined : Number(affected) });
    if (!result.success) { setFormError(result.error.issues[0]?.message ?? "Please check the incident details."); return; }
    setSubmitting(true); setFormError("");
    window.setTimeout(() => { setLastSubmittedAt(Date.now()); setSubmitted(true); setShowForm(false); setTitle(""); setLocation(""); setDescription(""); setAffected(""); setSubmitting(false); }, 350);
  }
  return <>
    <PageHeading title="Incident registry" subtitle="Review, inspect and submit emergency reports" />
    <div className="incident-toolbar"><div className="search-field"><MapPin size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search incident ID, ward or category" /></div><button className="outline-button">All statuses <ChevronDown size={14} /></button><button className="outline-button">Last 24 hours <ChevronDown size={14} /></button><button className="primary-button" onClick={() => { setShowForm(true); setViewing(null); }}><Plus size={15} /> New incident</button></div>
    {submitted && <div className="success-banner"><CheckCircle2 size={16} /><div><b>Incident submitted for triage</b><span>Demo ID INC-DEMO-025 · A responder will verify the report before it affects allocation.</span></div><button onClick={() => setSubmitted(false)}>Dismiss</button></div>}
    {showForm && <form className="new-incident panel" onSubmit={submitIncident}><div className="new-incident-head"><div><div className="detail-id">CITIZEN / RESPONDER INTAKE</div><h2>Submit a new incident</h2><p>Use UNKNOWN or ESTIMATE when exact numbers are not available.</p></div><button type="button" className="icon-button" onClick={() => setShowForm(false)}>×</button></div><div className="form-grid"><label>Emergency category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>FLOOD</option><option>FIRE</option><option>MEDICAL</option><option>ROAD_ACCIDENT</option><option>BUILDING_COLLAPSE</option><option>OTHER</option></select></label><label>Location<input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ward, landmark or GPS location" /></label><label className="form-wide">Description<textarea required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is happening? What help is needed?" /></label><label>People affected<select defaultValue="UNKNOWN"><option>UNKNOWN</option><option>ESTIMATE</option><option>VERIFIED</option></select></label><label>Reported count<input type="number" min="0" value={affected} onChange={(event) => setAffected(event.target.value)} placeholder="Optional" /></label></div><div className="form-actions"><span><Shield size={14} /> Demo submission · officer review required</span><button type="submit" className="primary-button"><Siren size={15} /> Send incident report</button></div></form>}
    {viewing && <div className="incident-view panel"><div><div className="detail-id">INCIDENT DETAIL · {viewing.id}</div><h2>{viewing.category} · {viewing.location}</h2><p>Updated {viewing.updated}. This report is linked to the district operational picture.</p></div><div className="view-metrics"><Metric label="Priority" value={`${viewing.priority}/100`} note={viewing.status} /><Metric label="Estimated people" value={viewing.estimated.toLocaleString()} note="medium confidence" /><Metric label="Verified people" value={viewing.verified.toString()} note="responder confirmed" /></div><div className="view-actions"><button className="outline-button" onClick={() => setViewing(null)}>Close detail</button><button className="primary-button" onClick={() => setShowForm(true)}>Create linked update <ArrowRight size={14} /></button></div></div>}
    <DataTable headers={["Incident", "Location", "Priority", "Population", "Updated", "Action"]} rows={filtered.map((item) => [<b key={item.id}>{item.id}<small className="table-sub">{item.category}</small></b>, item.location, <Status status={item.status} />, <span key={item.id}><b>{item.estimated.toLocaleString()}</b><small className="table-sub">{item.verified} verified</small></span>, item.updated, <button className="table-action" onClick={() => setViewing(item)}>View incident <ArrowRight size={13} /></button>])} />
  </>;
}

const emergencyTeamTypes = [
  ["Water Rescue", "Swift-water rescue, boats, flood evacuation"],
  ["Search & Rescue", "Missing persons, rubble and debris search"],
  ["Medical Response", "First aid, triage and emergency stabilization"],
  ["Fire & Hazmat", "Fire suppression, gas leaks and hazardous materials"],
  ["Mountain Rescue", "Landslide, hill roads and difficult terrain"],
  ["Urban Rescue", "Building collapse and confined-space extraction"],
  ["Evacuation & Shelter", "Household movement, registration and shelter intake"],
  ["Logistics & Supply", "Food, water, oxygen and relief distribution"],
  ["Traffic & Access", "Road closures, diversions and safe corridors"],
  ["Communications", "Radio relay, public information and situation reports"],
] as const;
const officerNames = ["Arjun Kumar", "Meera Nair", "Vikram Singh", "Ananya Rao", "Rohan Das", "Priya Menon", "Kabir Shah", "Nisha Patel", "Dev Malhotra", "Sana Khan"];

function TeamsWorkspace() {
  const [filter, setFilter] = useState("ALL");
  const { deployedTeams: deployed, deployTeam } = useRescueChain();
  const [deploymentHistory, setDeploymentHistory] = useState<{ id: string; action: string; time: string; officer: string }[]>([]);
  const teams = Array.from({ length: 25 }, (_, index) => {
    const [type, skill] = emergencyTeamTypes[index % emergencyTeamTypes.length];
    const statuses = ["AVAILABLE", "AVAILABLE", "ASSIGNED", "EN_ROUTE", "AVAILABLE"];
    return { id: `TEAM-${String(index + 1).padStart(2, "0")}`, type, skill, members: 4 + (index % 5), officer: officerNames[index % officerNames.length], location: ["North Guwahati Unit", "Beltola Response Base", "Dispur Medical Hub", "Maligaon Depot", "Guwahati Central HQ"][index % 5], status: statuses[index % statuses.length], eta: index % 3 === 0 ? "—" : `${12 + (index % 6) * 4} min` };
  });
  const visible = filter === "ALL" ? teams : teams.filter((team) => (deployed.includes(team.id) ? "ASSIGNED" : team.status) === filter);
  const toggleDeploy = (id: string) => {
    const isDeployed = deployed.includes(id);
    // Keep the team visible after assignment so its skills, base and members remain available for review.
    setFilter("ALL");
    deployTeam(id);
    const assignedTeam = teams.find((team) => team.id === id);
    setDeploymentHistory((current) => [{ id, action: isDeployed ? "RECALLED" : "DEPLOYED", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), officer: assignedTeam?.officer ?? "Duty Officer" }, ...current]);
  };
  return <>
    <PageHeading title="Emergency teams" subtitle="25 specialized response teams available for natural disaster operations" action="Register team" />
    <div className="team-intro panel"><div className="section-hero-icon"><Users size={21} /></div><div><b>Recommended district readiness</b><p>Water rescue, medical response, search and rescue, logistics, communications and access teams cover the most common flood, fire, earthquake, landslide and cyclone needs.</p></div><div className="team-total"><b>25</b><span>teams in roster</span></div></div>
    <div className="filter-row"><div className="search-field"><Users size={15} /> Search by team, skill or location</div>{["ALL", "AVAILABLE", "ASSIGNED", "EN_ROUTE"].map((status) => <button key={status} className={`outline-button ${filter === status ? "filter-active" : ""}`} onClick={() => setFilter(status)}>{status === "ALL" ? "All teams" : status.replace("_", " ")}</button>)}</div>
    <DataTable headers={["Team ID", "Specialization", "Team officer", "Members", "Base location", "Status", "ETA", "Action"]} rows={visible.map((team) => { const isDeployed = deployed.includes(team.id); const status = isDeployed ? "ASSIGNED" : team.status; return [<b key={team.id}>{team.id}<small className="table-sub">{team.skill}</small></b>, team.type, <span key={team.officer}><b>{team.officer}</b><small className="table-sub">Team lead</small></span>, team.members, team.location, <Status key={status} status={status} />, isDeployed ? "Assigned · pending dispatch" : team.eta, <button className={`table-action ${isDeployed ? "deployed-action" : ""}`} disabled={team.status !== "AVAILABLE" && !isDeployed} onClick={() => toggleDeploy(team.id)}>{isDeployed ? <><CheckCircle2 size={13} /> Assigned</> : <><Truck size={13} /> Deploy <ArrowRight size={13} /></>} </button>]; })} />
    {deploymentHistory.length > 0 && <div className="deployment-history panel"><div className="panel-head"><div><h2>Deployment history</h2><p>Accountability log for this demo session</p></div><span className="demo-chip">AUDIT TRAIL</span></div><table><thead><tr><th>Time</th><th>Team</th><th>Action</th><th>Officer</th></tr></thead><tbody>{deploymentHistory.map((entry, index) => <tr key={`${entry.id}-${entry.time}-${index}`}><td>{entry.time}</td><td><b>{entry.id}</b></td><td><Status status={entry.action === "DEPLOYED" ? "ASSIGNED" : "MODERATE"} /> <span className="history-action">{entry.action}</span></td><td>{entry.officer}</td></tr>)}</tbody></table></div>}
  </>;
}

const mapScenarios = [
  { title: "GUWAHATI, ASSAM · FLOOD RESPONSE", label: "FLOOD RESPONSE", incidents: [
    { x: 36, y: 31, id: "INC-0241", category: "FLOOD", area: "Beltola · Guwahati", priority: 96, people: "1,240 est.", verified: "186 verified", status: "CRITICAL", recommendation: "2 rescue boats + 1 medical team", color: "#c63e46" },
    { x: 64, y: 24, id: "INC-0238", category: "WATERLOGGING", area: "Dispur · Guwahati", priority: 89, people: "310 est.", verified: "72 verified", status: "CRITICAL", recommendation: "Deploy a drainage and medical response team", color: "#c63e46" },
    { x: 52, y: 49, id: "INC-0234", category: "FLOODING", area: "Riverside · Guwahati", priority: 52, people: "680 est.", verified: "401 verified", status: "MODERATE", recommendation: "Stage a rescue boat and water supply unit", color: "#D4A017" },
  ], resources: [
    { x: 17, y: 72, id: "BOAT-03", category: "RESCUE BOAT", area: "Beltola · Guwahati", priority: 0, people: "4 crew", verified: "Ready", status: "AVAILABLE", recommendation: "Available for immediate water rescue", letter: "B", color: "#3c79ad" },
    { x: 58, y: 40, id: "TEAM-03", category: "MEDICAL TEAM", area: "Dispur · Guwahati", priority: 0, people: "6 responders", verified: "Checked in", status: "ASSIGNED", recommendation: "Supporting flood response", letter: "M", color: "#6c5a99" },
    { x: 81, y: 74, id: "AMB-04", category: "AMBULANCE", area: "Riverside · Guwahati", priority: 0, people: "4 crew", verified: "Ready", status: "AVAILABLE", recommendation: "Available for evacuation support", letter: "A", color: "#17324d" },
  ] },
  { title: "GUWAHATI, ASSAM · ROAD INCIDENT RESPONSE", label: "ROAD INCIDENT RESPONSE", incidents: [
    { x: 28, y: 42, id: "INC-0251", category: "MULTI-VEHICLE ACCIDENT", area: "Jalukbari · Guwahati", priority: 94, people: "46 est.", verified: "31 verified", status: "CRITICAL", recommendation: "Dispatch 3 ambulances and traffic response", color: "#c63e46" },
    { x: 66, y: 35, id: "INC-0252", category: "ROAD COLLISION", area: "Maligaon · Guwahati", priority: 78, people: "18 est.", verified: "14 verified", status: "HIGH", recommendation: "Send an ambulance and extraction team", color: "#c56b22" },
    { x: 54, y: 62, id: "INC-0253", category: "TRAFFIC INCIDENT", area: "Paltan Bazaar · Guwahati", priority: 61, people: "12 est.", verified: "8 verified", status: "MODERATE", recommendation: "Assign traffic control and medical assessment", color: "#D4A017" },
  ], resources: [
    { x: 17, y: 72, id: "AMB-11", category: "AMBULANCE", area: "Jalukbari · Guwahati", priority: 0, people: "4 crew", verified: "En route", status: "ASSIGNED", recommendation: "Responding to INC-0251", letter: "A", color: "#3c79ad" },
    { x: 73, y: 65, id: "TEAM-09", category: "EMERGENCY TEAM", area: "Maligaon · Guwahati", priority: 0, people: "5 responders", verified: "Ready", status: "AVAILABLE", recommendation: "Available for scene management", letter: "E", color: "#6c5a99" },
    { x: 48, y: 20, id: "TRAF-02", category: "TRAFFIC RESPONSE", area: "Paltan Bazaar · Guwahati", priority: 0, people: "3 officers", verified: "Checked in", status: "AVAILABLE", recommendation: "Managing diversions", letter: "T", color: "#17324d" },
  ] },
  { title: "GUWAHATI, ASSAM · HEAVY RAINFALL RESPONSE", label: "HEAVY RAINFALL RESPONSE", incidents: [
    { x: 33, y: 28, id: "INC-0261", category: "WATERLOGGING", area: "Chandmari · Guwahati", priority: 87, people: "540 est.", verified: "116 verified", status: "CRITICAL", recommendation: "Deploy pumps and a drainage response team", color: "#c63e46" },
    { x: 62, y: 46, id: "INC-0262", category: "ROAD FLOODING", area: "Zoo Road · Guwahati", priority: 73, people: "210 est.", verified: "65 verified", status: "HIGH", recommendation: "Close access and stage an ambulance", color: "#c56b22" },
    { x: 74, y: 67, id: "INC-0263", category: "DRAINAGE OVERFLOW", area: "Six Mile · Guwahati", priority: 65, people: "160 est.", verified: "42 verified", status: "MODERATE", recommendation: "Send a field team and portable pump", color: "#D4A017" },
  ], resources: [
    { x: 18, y: 70, id: "PUMP-04", category: "DRAINAGE PUMP", area: "Chandmari · Guwahati", priority: 0, people: "2 operators", verified: "Ready", status: "AVAILABLE", recommendation: "Ready for water clearance", letter: "P", color: "#3c79ad" },
    { x: 51, y: 24, id: "TEAM-14", category: "FIELD TEAM", area: "Zoo Road · Guwahati", priority: 0, people: "6 responders", verified: "Assigned", status: "ASSIGNED", recommendation: "Supporting road flooding response", letter: "F", color: "#6c5a99" },
    { x: 84, y: 42, id: "AMB-07", category: "AMBULANCE", area: "Six Mile · Guwahati", priority: 0, people: "4 crew", verified: "Ready", status: "AVAILABLE", recommendation: "Available for medical support", letter: "A", color: "#17324d" },
  ] },
  { title: "GUWAHATI, ASSAM · FIRE RESPONSE", label: "FIRE RESPONSE", incidents: [
    { x: 58, y: 30, id: "INC-0271", category: "BUILDING FIRE", area: "Paltan Bazaar · Guwahati", priority: 98, people: "88 est.", verified: "39 verified", status: "CRITICAL", recommendation: "Deploy fire response, rescue vehicle and ambulances", color: "#c63e46" },
    { x: 37, y: 52, id: "INC-0272", category: "FIRE ALERT", area: "Central Guwahati", priority: 82, people: "34 est.", verified: "19 verified", status: "HIGH", recommendation: "Send fire team for immediate assessment", color: "#c56b22" },
    { x: 73, y: 65, id: "INC-0273", category: "SMOKE / FIRE HAZARD", area: "Dispur · Guwahati", priority: 57, people: "20 est.", verified: "7 verified", status: "MODERATE", recommendation: "Dispatch a medical team and hazard unit", color: "#D4A017" },
  ], resources: [
    { x: 19, y: 73, id: "FRT-07", category: "FIRE RESPONSE", area: "Paltan Bazaar · Guwahati", priority: 0, people: "5 crew", verified: "En route", status: "ASSIGNED", recommendation: "Responding to INC-0271", letter: "F", color: "#c63e46" },
    { x: 47, y: 23, id: "AMB-15", category: "AMBULANCE", area: "Central Guwahati", priority: 0, people: "4 crew", verified: "Ready", status: "AVAILABLE", recommendation: "Available for casualty support", letter: "A", color: "#3c79ad" },
    { x: 82, y: 42, id: "TEAM-06", category: "MEDICAL TEAM", area: "Dispur · Guwahati", priority: 0, people: "6 responders", verified: "Ready", status: "AVAILABLE", recommendation: "Available for smoke exposure care", letter: "M", color: "#6c5a99" },
  ] },
];

function MapWorkspace() {
  const router = useRouter();
  const [layer, setLayer] = useState("ALL");
  const [lastRefreshed, setLastRefreshed] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const scenario = mapScenarios[currentScenarioIndex];
  const [selected, setSelected] = useState(mapScenarios[0].incidents[0]);
  const markers = scenario.incidents;
  const resources = scenario.resources;
  const severityOrder = { CRITICAL: 0, HIGH: 1, MODERATE: 2 } as const;
  const orderedMarkers = [...markers].sort((a, b) => severityOrder[a.status as keyof typeof severityOrder] - severityOrder[b.status as keyof typeof severityOrder]);
  const visibleMarkers = layer === "RESOURCES" ? [] : layer === "CRITICAL" ? markers.filter((marker) => marker.status === "CRITICAL") : markers;
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1_000); return () => window.clearInterval(timer); }, []);
  const elapsed = Math.floor((now - lastRefreshed) / 1_000);
  const refreshedLabel = elapsed < 5 ? "just now" : `${elapsed} seconds ago`;
  /* Legacy single-scenario data retained below only while preserving surrounding component layout.
  const [selected, setSelected] = useState({ id: "INC-0241", category: "FLOOD", area: "Beltola · Guwahati", priority: 96, people: "1,240 est.", verified: "186 verified", status: "CRITICAL", recommendation: "2 rescue boats + 1 medical team" });
  const markers = [
    { x: 36, y: 31, id: "INC-0241", category: "FLOOD", area: "Beltola · Guwahati", priority: 96, people: "1,240 est.", verified: "186 verified", status: "CRITICAL", recommendation: "2 rescue boats + 1 medical team", color: "#c63e46" },
    { x: 64, y: 24, id: "INC-0238", category: "COLLAPSE", area: "Paltan Bazaar · Guwahati", priority: 89, people: "94 est.", verified: "61 verified", status: "CRITICAL", recommendation: "1 urban rescue team", color: "#c63e46" },
    { x: 25, y: 59, id: "INC-0240", category: "ACCIDENT", area: "Jalukbari · Guwahati", priority: 78, people: "28 est.", verified: "22 verified", status: "HIGH", recommendation: "1 ambulance + traffic team", color: "#c56b22" },
    { x: 70, y: 64, id: "INC-0236", category: "FIRE", area: "Maligaon · Guwahati", priority: 64, people: "240 est.", verified: "128 verified", status: "HIGH", recommendation: "1 fire and hazmat team", color: "#c56b22" },
    { x: 52, y: 49, id: "INC-0234", category: "WATER", area: "Chandmari · Guwahati", priority: 52, people: "680 est.", verified: "401 verified", status: "MODERATE", recommendation: "Water supply transfer", color: "#D4A017" },
  ];
  const severityOrder = { CRITICAL: 0, HIGH: 1, MODERATE: 2 } as const;
  const orderedMarkers = [...markers].sort((a, b) => severityOrder[a.status as keyof typeof severityOrder] - severityOrder[b.status as keyof typeof severityOrder]);
  const visibleMarkers = layer === "RESOURCES" ? [] : layer === "CRITICAL" ? markers.filter((marker) => marker.status === "CRITICAL") : markers;
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1_000); return () => window.clearInterval(timer); }, []);
  const elapsed = Math.floor((now - lastRefreshed) / 1_000);
  const refreshedLabel = elapsed < 5 ? "just now" : `${elapsed} seconds ago`;
  const refreshMap = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => { setLayer("ALL"); setLastRefreshed(Date.now()); setNow(Date.now()); setRefreshing(false); }, 450);
  };
  const resources = [{ x: 17, y: 72, id: "AMB-04", category: "AMBULANCE", area: "Beltola · Guwahati", priority: 0, people: "4 crew", verified: "Ready", status: "AVAILABLE", recommendation: "Available for immediate dispatch", letter: "A", color: "#3c79ad" }, { x: 58, y: 40, id: "TEAM-03", category: "MEDICAL RESPONSE", area: "Dispur · Guwahati", priority: 0, people: "6 responders", verified: "Checked in", status: "ASSIGNED", recommendation: "Supporting the Beltola incident", letter: "R", color: "#6c5a99" }, { x: 81, y: 74, id: "GMC-01", category: "HOSPITAL", area: "Guwahati Medical College", priority: 0, people: "42 beds", verified: "18 oxygen units", status: "AVAILABLE", recommendation: "Emergency intake remains available", letter: "H", color: "#17324d" }];
  */
  return <>
    <PageHeading title={scenario.title} subtitle="Synthetic incidents, resources and critical information for this prototype map" />
    <div className="scenario-indicator">SCENARIO {currentScenarioIndex + 1} / {mapScenarios.length} · {scenario.label}</div>
    <div className="map-page-toolbar"><div className="map-status" aria-live="polite"><span className="live-indicator" /> LIVE · refreshed {refreshedLabel}</div><div className="map-filter-group">{[["ALL", "All layers"], ["CRITICAL", "Critical only"], ["RESOURCES", "Resources"]].map(([value, label]) => <button key={value} className={`outline-button ${layer === value ? "filter-active" : ""}`} onClick={() => setLayer(value)}>{label}</button>)}</div></div>
    <div className="live-map-layout"><div className="live-svg-map panel"><div className="map-svg-head"><b>GUWAHATI, ASSAM · OPERATIONAL PICTURE</b><span><i className="legend-dot red" /> Critical <i className="legend-dot orange" /> High <i className="legend-dot yellow" /> Moderate <i className="legend-square blue" /> Resources</span></div><svg viewBox="0 0 900 560" role="img" aria-label="Interactive synthetic Guwahati district map"><rect width="900" height="560" fill="#e9f0ef" /><path d="M60 80 L260 35 L410 95 L575 52 L830 110 L785 280 L850 455 L610 510 L430 470 L210 525 L70 400 L115 250 Z" fill="#dce9e8" stroke="#a9c2c4" strokeWidth="3" /><path d="M30 250 C160 220 250 290 380 235 S620 220 880 290" fill="none" stroke="#c0d9dc" strokeWidth="34" /><path d="M80 435 C250 360 330 420 455 330 S700 210 850 120" fill="none" stroke="#fff" strokeWidth="13" /><path d="M120 115 C300 185 390 170 530 245 S710 380 820 420" fill="none" stroke="#fff" strokeWidth="10" /><text x="370" y="142" fill="#718d91" fontSize="14" fontStyle="italic">GUWAHATI, ASSAM</text>{visibleMarkers.map((marker) => <g key={marker.id} className={`svg-marker ${selected.id === marker.id ? "svg-marker-selected" : ""}`} role="button" tabIndex={0} aria-label={`Select ${marker.id}`} onClick={() => setSelected(marker)} onKeyDown={(event) => event.key === "Enter" && setSelected(marker)}><circle cx={`${marker.x}%`} cy={`${marker.y}%`} r="24" fill={marker.color} opacity=".16" /><circle cx={`${marker.x}%`} cy={`${marker.y}%`} r="15" fill="#fff" stroke={marker.color} strokeWidth="4" /><text x={`${marker.x}%`} y={`${marker.y + 1}%`} textAnchor="middle" fill={marker.color} fontSize="11" fontWeight="700">{marker.priority}</text><text x={`${marker.x}%`} y={`${marker.y + 8}%`} textAnchor="middle" fill="#5b7078" fontSize="8">{marker.id}</text></g>)}{layer !== "CRITICAL" && resources.map((resource) => <g key={resource.id} className={`svg-marker ${selected.id === resource.id ? "svg-marker-selected" : ""}`} role="button" tabIndex={0} aria-label={`Select ${resource.category}`} onClick={() => setSelected(resource)} onKeyDown={(event) => event.key === "Enter" && setSelected(resource)}><rect x={`${resource.x - 10}%`} y={`${resource.y - 5}%`} width="20" height="20" rx="4" fill={resource.color} /><text x={`${resource.x}%`} y={`${resource.y - 1}%`} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">{resource.letter}</text></g>)}</svg></div><aside className="map-info panel"><div className="panel-head"><div><h2>Situation details</h2><p>Sorted by criticality · select a marker or row</p></div><MapPin size={17} /></div><div className="map-selected"><Status status={selected.status} /><div className="map-selected-id">{selected.id}</div><h2>{selected.category}</h2><p><MapPin size={13} /> {selected.area}</p><div className="map-info-grid"><div><span>PRIORITY</span><b className="score-red">{selected.priority}</b></div><div><span>{selected.category === "AMBULANCE" ? "CREW" : "PEOPLE"}</span><b>{selected.people}</b></div><div><span>VERIFIED</span><b>{selected.verified}</b></div></div><div className="map-next"><Bot size={16} /><div><b>Recommended next</b><span>{selected.recommendation}</span></div></div><button className="primary-button map-detail-button" onClick={() => router.push(`/incidents?selected=${selected.id}`)}>Open full incident <ArrowRight size={14} /></button></div><div className="severity-list">{orderedMarkers.map((marker) => <button key={marker.id} onClick={() => setSelected(marker)} className={selected.id === marker.id ? "severity-selected" : ""}><span className={`severity-bar ${marker.status.toLowerCase()}`} /><span><b>{marker.id}</b><small>{marker.category} · {marker.area}</small></span><strong>{marker.priority}</strong></button>)}</div></aside></div>
  </>;
  return <>
    <PageHeading title="Live district map" subtitle="Incidents, resources and critical information without leaving the map" />
    <div className="map-page-toolbar"><div className="map-status"><span className="live-indicator" /> LIVE · refreshed 30 seconds ago</div><div className="map-filter-group">{["ALL", "CRITICAL", "RESOURCES"].map((item) => <button key={item} className={`outline-button ${layer === item ? "filter-active" : ""}`} onClick={() => setLayer(item)}>{item === "ALL" ? "All layers" : item === "CRITICAL" ? "Critical only" : "Resources"}</button>)}</div></div>
    <div className="live-map-layout"><div className="live-svg-map panel"><div className="map-svg-head"><b>NANDIPUR DISTRICT · OPERATIONAL PICTURE</b><span><i className="legend-dot red" /> Critical <i className="legend-dot orange" /> High <i className="legend-dot yellow" /> Moderate <i className="legend-square blue" /> Resources</span></div><svg viewBox="0 0 900 560" role="img" aria-label="Interactive synthetic district map"><rect width="900" height="560" fill="#e9f0ef" /><path d="M60 80 L260 35 L410 95 L575 52 L830 110 L785 280 L850 455 L610 510 L430 470 L210 525 L70 400 L115 250 Z" fill="#dce9e8" stroke="#a9c2c4" strokeWidth="3" /><path d="M30 250 C160 220 250 290 380 235 S620 220 880 290" fill="none" stroke="#c0d9dc" strokeWidth="34" /><path d="M80 435 C250 360 330 420 455 330 S700 210 850 120" fill="none" stroke="#fff" strokeWidth="13" /><path d="M120 115 C300 185 390 170 530 245 S710 380 820 420" fill="none" stroke="#fff" strokeWidth="10" /><path d="M250 50 L310 500 M570 65 L525 495" stroke="#fff" strokeWidth="8" opacity=".9" /><path d="M120 115 C300 185 390 170 530 245 S710 380 820 420" fill="none" stroke="#bdcfd0" strokeWidth="2" /><text x="370" y="142" fill="#718d91" fontSize="14" fontStyle="italic">NANDIPUR DISTRICT</text><text x="95" y="282" fill="#74959b" fontSize="11">RIVERSIDE</text><text x="650" y="160" fill="#74959b" fontSize="11">OLD MARKET</text>{visibleMarkers.map((marker) => <g key={marker.id} className="svg-marker" onClick={() => setSelected(marker)} tabIndex={0}><circle cx={`${marker.x}%`} cy={`${marker.y}%`} r="24" fill={marker.color} opacity=".16" /><circle cx={`${marker.x}%`} cy={`${marker.y}%`} r="15" fill="#fff" stroke={marker.color} strokeWidth="4" /><text x={`${marker.x}%`} y={`${marker.y + 1}%`} textAnchor="middle" fill={marker.color} fontSize="11" fontWeight="700">{marker.priority}</text><text x={`${marker.x}%`} y={`${marker.y + 8}%`} textAnchor="middle" fill="#5b7078" fontSize="8">{marker.id}</text></g>)}{layer !== "CRITICAL" && [{x:17,y:72,letter:"A",label:"Ambulance"},{x:58,y:40,letter:"R",label:"Rescue team"},{x:81,y:74,letter:"H",label:"Hospital"},{x:44,y:78,letter:"S",label:"Shelter"}].map((resource) => <g key={resource.label}><rect x={`${resource.x - 10}%`} y={`${resource.y - 5}%`} width="20" height="20" rx="4" fill={resource.letter === "H" ? "#17324d" : resource.letter === "R" ? "#6c5a99" : "#3c79ad"} /><text x={`${resource.x}%`} y={`${resource.y - 1}%`} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">{resource.letter}</text></g>)}</svg></div><aside className="map-info panel"><div className="panel-head"><div><h2>Situation details</h2><p>Sorted by criticality · click a row</p></div><MapPin size={17} /></div><div className="map-selected"><Status status={selected.status} /><div className="map-selected-id">{selected.id}</div><h2>{selected.category}</h2><p><MapPin size={13} /> {selected.area}</p><div className="map-info-grid"><div><span>PRIORITY</span><b className="score-red">{selected.priority}<em>/100</em></b></div><div><span>PEOPLE</span><b>{selected.people}</b></div><div><span>VERIFIED</span><b>{selected.verified}</b></div></div><div className="map-next"><Bot size={16} /><div><b>Recommended next</b><span>{selected.recommendation}</span></div></div><button className="primary-button map-detail-button" onClick={() => window.location.href = `/incidents?selected=${selected.id}`}>Open full incident <ArrowRight size={14} /></button></div><div className="severity-list">{orderedMarkers.map((marker) => <button key={marker.id} onClick={() => setSelected(marker)} className={selected.id === marker.id ? "severity-selected" : ""}><span className={`severity-bar ${marker.status.toLowerCase()}`} /><span><b>{marker.id}</b><small>{marker.category} · {marker.area}</small></span><strong>{marker.priority}</strong></button>)}</div><div className="map-key"><b>Map key</b><span><i className="legend-dot red" /> Critical</span><span><i className="legend-dot orange" /> High</span><span><i className="legend-dot yellow" /> Moderate</span><span><i className="legend-square blue" /> Resource</span><small>All locations are synthetic demo data.</small></div></aside></div>
  </>;
}

const hospitalData = [["Guwahati Central Medical Centre", "Guwahati Central", "74%", "42 / 160", "18", "READY"], ["Beltola Emergency Centre", "Beltola", "88%", "8 / 65", "6", "WARNING"], ["Dispur Medical Institute", "Dispur", "61%", "55 / 140", "24", "READY"], ["Jalukbari Community Hospital", "Jalukbari", "93%", "3 / 48", "2", "CRITICAL"], ["Chandmari Care Centre", "Chandmari", "68%", "21 / 72", "11", "READY"]];
const shelterData = [["Beltola School Shelter", "Beltola", "72%", "720 / 1,000", "Good", "OPEN"], ["Dispur Sports Complex Shelter", "Dispur", "84%", "1,260 / 1,500", "Watch", "OPEN"], ["Six Mile Relief Centre", "Six Mile", "49%", "245 / 500", "Good", "OPEN"], ["Maligaon Community Hall", "Maligaon", "96%", "480 / 500", "Low", "NEAR CAPACITY"], ["Paltan Bazaar Safe School", "Paltan Bazaar", "38%", "190 / 500", "Good", "OPEN"]];

function FacilitiesWorkspace({ kind }: { kind: "hospitals" | "shelters" }) {
  const isHospital = kind === "hospitals";
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const rows = isHospital ? hospitalData : shelterData;
  const teams = ["TEAM-01 · Water Rescue", "TEAM-03 · Medical Response", "TEAM-07 · Logistics", "TEAM-12 · Search & Rescue", "TEAM-18 · Communications"];
  return <><PageHeading title={isHospital ? "Hospitals" : "Shelters"} subtitle={isHospital ? "Emergency capacity, oxygen and team coordination" : "Safe accommodation, occupancy and relief coordination"} action={isHospital ? "Add hospital" : "Add shelter"} /><div className="facility-summary"><Metric label={isHospital ? "Emergency beds" : "Total capacity"} value={isHospital ? "485" : "4,000"} note="across 5 facilities" /><Metric label={isHospital ? "Available beds" : "Available spaces"} value={isHospital ? "129" : "1,105"} note="demo estimate" /><Metric label={isHospital ? "Facilities warning" : "Facilities near capacity"} value={isHospital ? "2" : "1"} note="requires officer attention" /><Metric label="Assigned teams" value={Object.keys(assigned).length.toString()} note="linked this session" /></div><div className="facility-table panel"><table><thead><tr><th>{isHospital ? "Hospital" : "Shelter"}</th><th>Location</th><th>Capacity used</th><th>{isHospital ? "Beds / total" : "Occupied / capacity"}</th><th>{isHospital ? "Oxygen units" : "Water / food"}</th><th>Status</th><th>Assign team</th></tr></thead><tbody>{rows.map((row) => { const [name, location, capacity, counts, supplies, status] = row; const selectedTeam = assigned[name]; return <tr key={name}><td><b>{name}</b><small className="table-sub">{isHospital ? "Emergency care facility" : "Relief accommodation"}</small></td><td>{location}</td><td><div className="capacity-cell"><span><i style={{ width: capacity }} /></span><b>{capacity}</b></div></td><td>{counts}</td><td>{supplies}</td><td><Status status={status === "OPEN" || status === "READY" ? "AVAILABLE" : status === "WARNING" || status === "NEAR CAPACITY" ? "HIGH" : "CRITICAL"} /></td><td><div className="assign-control"><select value={selectedTeam || ""} onChange={(event) => setAssigned((current) => ({ ...current, [name]: event.target.value }))}><option value="">Select team</option>{teams.map((team) => <option key={team}>{team}</option>)}</select>{selectedTeam && <small><CheckCircle2 size={12} /> {selectedTeam.split(" · ")[0]} assigned</small>}</div></td></tr>; })}</tbody></table></div></>;
}

function AnalyticsWorkspace() {
  const { incidents, deployedTeams, scenario } = useRescueChain();
  const critical = scenario.ran ? Math.min(12, 4 + Math.floor(scenario.rainfall / 20) + scenario.closures) : 4;
  const hospital = scenario.ran ? Math.min(99, scenario.hospital + Math.floor(scenario.rainfall / 8) + scenario.closures * 2) : 74;
  const activity = chart.map((item, index) => ({ ...item, value: item.value + (scenario.ran ? Math.floor(scenario.rainfall / 25) + scenario.closures + (index > 4 ? 2 : 0) : 0) }));
  return <><PageHeading title="Operational analytics" subtitle="Live demo metrics update after assignments and scenario changes" /><div className="analytics-live-note"><Activity size={15} /><b>Live demo analytics</b><span>{deployedTeams.length} team assignment{deployedTeams.length === 1 ? "" : "s"} and {scenario.ran ? "active scenario changes" : "baseline conditions"} reflected here.</span></div><div className="analytics-grid"><ChartCard title="Incidents over time" subtitle="Reports received · updates with scenario"><ResponsiveContainer width="100%" height="100%"><LineChart data={activity}><CartesianGrid vertical={false} stroke="#e7edf0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#2d6b91" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></ChartCard><ChartCard title="Current priority mix" subtitle={`${incidents.length} tracked incidents`}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: "Critical", value: critical }, { name: "High", value: 5 }, { name: "Moderate", value: Math.max(1, incidents.length - 9) }]} dataKey="value" innerRadius={48} outerRadius={76} paddingAngle={3}><Cell fill="#c63e46" /><Cell fill="#c56b22" /><Cell fill="#d3a32b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard><ChartCard title="Capacity after changes" subtitle="Hospital occupancy by scenario"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{ n: "District", v: hospital }, { n: "St. Mary", v: Math.min(99, hospital + 14) }, { n: "Unity", v: Math.max(40, hospital - 13) }, { n: "Civil", v: Math.min(99, hospital + 19) }]}><CartesianGrid vertical={false} stroke="#e7edf0" /><XAxis dataKey="n" tick={{ fontSize: 10 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 10 }} /><Bar dataKey="v" fill="#527f95" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard></div><div className="analytics-footer-metrics"><Metric label="Critical incidents" value={String(critical).padStart(2, "0")} note="updates from scenario" /><Metric label="Teams assigned" value={deployedTeams.length.toString().padStart(2, "0")} note="shared roster state" /><Metric label="Hospital occupancy" value={`${hospital}%`} note="scenario-aware" /><Metric label="Estimated affected" value={(scenario.ran ? scenario.population + scenario.rainfall * 20 + scenario.closures * 150 : 3842).toLocaleString()} note="demo estimate" /></div></>;
}

function SimulationWorkspace() {
  const { setScenario } = useRescueChain();
  const [rainfall, setRainfall] = useState(40);
  const [closures, setClosures] = useState(3);
  const [ambulances, setAmbulances] = useState(22);
  const [boats, setBoats] = useState(4);
  const [hospital, setHospital] = useState(74);
  const [shelter, setShelter] = useState(72);
  const [population, setPopulation] = useState(2400);
  const [ran, setRan] = useState(false);
  const critical = Math.min(12, 4 + Math.floor(rainfall / 20) + closures);
  const affected = population + Math.round(rainfall * 20) + closures * 150;
  const hospitalAfter = Math.min(99, hospital + Math.floor(rainfall / 8) + closures * 2 + (ambulances < 20 ? 4 : 0));
  const shelterAfter = Math.min(99, shelter + Math.floor(rainfall / 12) + closures);
  const response = 18 + closures * 3 + Math.max(0, 24 - ambulances) * 2;
  const updateInput = (setValue: (value: number) => void, value: number) => {
    setValue(value);
    setRan(false);
    setScenario({ ran: false });
  };
  const reset = () => { setRainfall(40); setClosures(3); setAmbulances(22); setBoats(4); setHospital(74); setShelter(72); setPopulation(2400); setRan(false); setScenario({ rainfall: 40, closures: 3, ambulances: 22, boats: 4, hospital: 74, shelter: 72, population: 2400, ran: false }); };
  return <>
    <PageHeading title="Scenario simulation" subtitle="Edit conditions manually and test a response plan before reality changes" />
    <div className="simulation-form panel"><div className="sim-form-head"><div><SlidersHorizontal size={18} /><b>Build your own what-if scenario</b><p>Change any input, then run the simulation. This is a planning aid, not a prediction of reality.</p></div><span className="demo-chip">DEMO PREDICTION</span></div><div className="manual-scenario-grid"><ManualInput label="Rainfall increase (%)" value={rainfall} min={0} max={100} onChange={(value) => updateInput(setRainfall, value)} /><ManualInput label="Road closures" value={closures} min={0} max={10} onChange={(value) => updateInput(setClosures, value)} /><ManualInput label="Available ambulances" value={ambulances} min={0} max={31} onChange={(value) => updateInput(setAmbulances, value)} /><ManualInput label="Available rescue boats" value={boats} min={0} max={12} onChange={(value) => updateInput(setBoats, value)} /><ManualInput label="Hospital occupancy (%)" value={hospital} min={0} max={100} onChange={(value) => updateInput(setHospital, value)} /><ManualInput label="Shelter occupancy (%)" value={shelter} min={0} max={100} onChange={(value) => updateInput(setShelter, value)} /><ManualInput label="Affected population" value={population} min={0} max={20000} onChange={(value) => updateInput(setPopulation, value)} /></div><div className="simulation-actions"><button className="primary-button" onClick={() => { setRan(true); setScenario({ rainfall, closures, ambulances, boats, hospital, shelter, population, ran: true }); }}><Play size={15} /> Run simulation</button><button className="outline-button" onClick={reset}>Reset inputs</button><span><Shield size={13} /> No live resources are dispatched</span></div></div>
    <div className="scenario-compare"><div className="compare-heading"><div><h2>{ran ? "Simulated response picture" : "Baseline response picture"}</h2><p>{ran ? "Results use your manually entered scenario values." : "Run the simulation to apply your edited values."}</p></div><span className="demo-chip">SYNTHETIC DATA</span></div><div className="scenario-results"><Metric label="Critical incidents" value={ran ? String(critical).padStart(2, "0") : "04"} note={ran ? "scenario result" : "current baseline"} /><Metric label="Affected population" value={(ran ? affected : population).toLocaleString()} note="estimated · medium confidence" /><Metric label="Hospital occupancy" value={`${ran ? hospitalAfter : hospital}%`} note={ran && hospitalAfter > 90 ? "CRITICAL" : "capacity signal"} /><Metric label="Response time" value={`${ran ? response : 18} min`} note="estimated average" /></div>{ran && <div className="recommendation-grid"><div><b>Recommended response plan</b><span>{boats < 4 ? "Request mutual aid rescue boats. " : "Stage rescue boats at Riverside. "}{ambulances < 20 ? "Transfer an ambulance from North Station. " : "Keep ambulance reserve active. "}Move shelter intake to facilities below 80% occupancy.</span></div><div><b>Capacity warnings</b><span>{hospitalAfter > 90 ? "Hospital capacity is critical. " : "Hospital capacity remains within watch range. "}{shelterAfter > 90 ? "Shelter overflow likely." : "Shelter network has usable headroom."}</span></div></div>}</div>
  </>;
}

const reportData = [
  { id: "RPT-0614-01", name: "Daily emergency situation report", type: "OPERATIONS", date: "14 Jun 2025 · 14:00", owner: "District EOC", status: "READY", detail: "18 active incidents, 4 critical, 3,842 estimated people affected, 24 ambulances available and 74% hospital capacity." },
  { id: "RPT-0614-02", name: "INC-0241 incident report", type: "INCIDENT", date: "14 Jun 2025 · 13:42", owner: "Flood Response Desk", status: "READY", detail: "Beltola, Guwahati flood simulation. 1,240 estimated and 186 responder-verified affected. Recommended allocation: 2 boats, 1 medical team and 1 ambulance." },
  { id: "RPT-0614-03", name: "Resource utilization report", type: "RESOURCES", date: "14 Jun 2025 · 13:30", owner: "Logistics Cell", status: "READY", detail: "31 ambulances in roster, 24 available, 7 assigned and 3 in maintenance. Eight emergency teams are operational." },
  { id: "RPT-0614-04", name: "Hospital capacity report", type: "HEALTH", date: "14 Jun 2025 · 13:15", owner: "Medical Desk", status: "WARNING", detail: "485 simulated emergency beds across 5 facilities. 129 beds are available. Jalukbari Community Hospital is at 93% and requires officer attention." },
  { id: "RPT-0614-05", name: "Shelter capacity report", type: "RELIEF", date: "14 Jun 2025 · 13:00", owner: "Relief Coordinator", status: "WARNING", detail: "4,000 simulated shelter spaces across 5 facilities. 1,105 spaces remain available. Maligaon Community Hall is at 96% occupancy." },
  { id: "RPT-0614-06", name: "Response performance report", type: "PERFORMANCE", date: "14 Jun 2025 · 12:00", owner: "Operations Analytics", status: "READY", detail: "Current average estimated response time is 18 minutes. The report separates synthetic estimates from verified responder timestamps." },
];

function ReportsWorkspace() {
  const [selected, setSelected] = useState(reportData[0]);
  const [exported, setExported] = useState(false);
  const [printPreview, setPrintPreview] = useState(false);

  const handlePrintCurrentReport = () => {
    setPrintPreview(true);
    window.setTimeout(() => {
      window.print();
    }, 50);
  };

  useEffect(() => {
    const handleAfterPrint = () => setPrintPreview(false);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  return <>
    <PageHeading title="Reports" subtitle="Detailed operational reports for review, export and accountability" />
    <div className="report-toolbar"><div><b>Generated reports</b><span>All reports use synthetic demo data.</span></div><button className="outline-button" onClick={() => setExported(true)}><FileText size={14} /> Export CSV</button><button className="primary-button" onClick={handlePrintCurrentReport}><FileText size={14} /> Print report</button></div>
    {exported && <div className="success-banner"><CheckCircle2 size={16} /><div><b>Report export prepared</b><span>Demo CSV package is ready. No live agency data was exported.</span></div><button onClick={() => setExported(false)}>Dismiss</button></div>}
    <div className="reports-layout"><div className="report-list panel">{reportData.map((report) => <button key={report.id} className={selected.id === report.id ? "report-row report-selected" : "report-row"} onClick={() => setSelected(report)}><div className="report-file"><FileText size={17} /></div><div><b>{report.name}</b><small>{report.id} · {report.type}</small><span>{report.date}</span></div><Status status={report.status === "WARNING" ? "HIGH" : "AVAILABLE"} /></button>)}</div><div className="report-detail panel"><div className="detail-id">REPORT DETAIL · {selected.id}</div><h2>{selected.name}</h2><div className="report-meta"><span>Generated <b>{selected.date}</b></span><span>Owner <b>{selected.owner}</b></span><Status status={selected.status === "WARNING" ? "HIGH" : "AVAILABLE"} /></div><div className="report-body"><h3>Report contents</h3><p>{selected.detail}</p><h3>Data handling note</h3><p>This is a demo report generated from synthetic district records. Estimated values are clearly separated from verified values and should not be used for real-world deployment.</p></div><div className="report-actions"><button className="outline-button" onClick={() => setExported(true)}>Download CSV</button><button className="primary-button" onClick={handlePrintCurrentReport}>Print detailed report</button></div></div></div>
    <div className={`report-print-shell ${printPreview ? "report-print-visible" : ""}`} aria-live="polite">
      <div className="report-print-card">
        <div className="detail-id">REPORT DETAIL · {selected.id}</div>
        <h2>{selected.name}</h2>
        <div className="report-meta"><span>Generated <b>{selected.date}</b></span><span>Owner <b>{selected.owner}</b></span><Status status={selected.status === "WARNING" ? "HIGH" : "AVAILABLE"} /></div>
        <div className="report-body"><h3>Report contents</h3><p>{selected.detail}</p><h3>Data handling note</h3><p>This is a demo report generated from synthetic district records. Estimated values are clearly separated from verified values and should not be used for real-world deployment.</p></div>
      </div>
    </div>
  </>;
}

const notificationSeed = [{ id: 1, title: "CRITICAL INCIDENT DETECTED", body: "INC-0241 flood priority increased to 96 in Ward 18 Riverside.", time: "2 min ago", severity: "CRITICAL", unread: true }, { id: 2, title: "RESOURCE RECOMMENDATION READY", body: "Officer review required for 2 rescue boats and 1 medical team.", time: "8 min ago", severity: "ACTION", unread: true }, { id: 3, title: "HOSPITAL CAPACITY WARNING", body: "Civil Hospital North is at 93% occupancy with 3 beds available.", time: "18 min ago", severity: "WARNING", unread: true }, { id: 4, title: "RESOURCE SHORTAGE PREDICTED", body: "Oxygen stock may reach a high-risk threshold in 2.5 days.", time: "42 min ago", severity: "WARNING", unread: false }, { id: 5, title: "INCIDENT STATUS UPDATED", body: "INC-0236 fire response team is now en route.", time: "1 hr ago", severity: "INFO", unread: false }, { id: 6, title: "SIMULATION COMPLETED", body: "Rainfall scenario produced 9 critical incidents and 5,700 estimated affected.", time: "2 hrs ago", severity: "INFO", unread: false }];

function NotificationWorkspace() {
  const [items, setItems] = useState(notificationSeed);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<(typeof notificationSeed)[number] | null>(null);
  const visible = filter === "UNREAD" ? items.filter((item) => item.unread) : filter === "CRITICAL" ? items.filter((item) => item.severity === "CRITICAL") : items;
  const markRead = (id: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item));
  return <><PageHeading title="Notifications" subtitle="Every operational alert, recommendation and capacity warning in one place" /><div className="notification-toolbar"><div><b>{items.filter((item) => item.unread).length} unread notifications</b><span>Demo notifications are generated from the synthetic operational picture.</span></div><div className="notification-filters">{["ALL", "UNREAD", "CRITICAL"].map((item) => <button key={item} className={`outline-button ${filter === item ? "filter-active" : ""}`} onClick={() => setFilter(item)}>{item === "ALL" ? "All" : item === "UNREAD" ? "Unread" : "Critical"}</button>)}</div><button className="outline-button" onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))}><CheckCircle2 size={14} /> Mark all read</button></div>{selected && <div className="notification-detail panel"><div className={`notification-symbol ${selected.severity.toLowerCase()}`}><Bell size={18} /></div><div><div className="detail-id">NOTIFICATION DETAIL · {selected.time.toUpperCase()}</div><h2>{selected.title}</h2><p>{selected.body}</p><small>This notification is part of the demo operational record and has been marked as read.</small></div><button className="outline-button" onClick={() => setSelected(null)}>Close</button></div>}<div className="notification-list panel">{visible.map((item) => <button className={`notification-row ${item.unread ? "notification-unread" : ""} ${selected?.id === item.id ? "notification-selected" : ""}`} key={item.id} onClick={() => { setSelected(item); markRead(item.id); }}><div className={`notification-symbol ${item.severity.toLowerCase()}`}><Bell size={16} /></div><div className="notification-copy"><div><b>{item.title}</b>{item.unread && <span className="unread-dot" />}</div><p>{item.body}</p><small>{item.time} · Click to open details</small></div><ArrowRight size={15} /></button>)}{visible.length === 0 && <div className="notification-empty"><CheckCircle2 size={28} /><b>No notifications in this view</b><span>Everything is clear for the selected filter.</span></div>}</div></>;
}

function ManualInput({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) { return <label className="manual-input"><span>{label}</span><input type="number" min={min} max={max} value={value} onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value) || 0)))} /><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }

function PageHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: string }) { return <section className="page-heading"><div><div className="eyebrow"><Shield size={13} /> RESCUECHAIN OPERATIONS <span className="eyebrow-line" /></div><h1>{title}</h1><p>{subtitle}</p></div>{action && <button className="primary-button" onClick={() => action.startsWith("Export") ? window.print() : window.alert(`${action} is ready to be connected to your agency data source.`)}><Plus size={15} /> {action}</button>}</section>; }
function Status({ status }: { status: string }) { const tone = status === "CRITICAL" ? "red" : status === "HIGH" || status === "EN_ROUTE" ? "orange" : status === "MODERATE" ? "yellow" : status === "AVAILABLE" ? "green" : status === "ASSIGNED" ? "blue" : "muted"; return <span className={`pill pill-${tone}`}><span className="pill-dot" />{status}</span>; }
function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) { return <div className="table-panel panel"><table><thead><tr>{headers.map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>; }
function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <div className="metric-card"><span>{label}</span><b>{value}</b><small>{note}</small></div>; }
function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <div className="chart-card panel"><div className="panel-head"><div><h2>{title}</h2><p>{subtitle}</p></div></div><div className="section-chart">{children}</div></div>; }
function Slider({ label, value }: { label: string; value: string }) { return <div className="slider-row"><label>{label}<b>{value}</b></label><div className="fake-slider"><span /></div></div>; }
