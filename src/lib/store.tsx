"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type IncidentStatus = "CRITICAL" | "HIGH" | "MODERATE" | "RESOLVED";
export type IncidentRecord = {
  id: string;
  category: string;
  location: string;
  status: IncidentStatus;
  priority: number;
  estimated: number;
  verified: number;
  updated: string;
};

const prototypeIncidents: IncidentRecord[] = [
  { id: "INC-0241", category: "Flood", location: "Beltola · Guwahati", status: "CRITICAL", priority: 96, estimated: 1240, verified: 186, updated: "32 min ago" },
  { id: "INC-0238", category: "Building collapse", location: "Paltan Bazaar · Guwahati", status: "CRITICAL", priority: 89, estimated: 94, verified: 61, updated: "48 min ago" },
  { id: "INC-0240", category: "Road accident", location: "Jalukbari · Guwahati", status: "HIGH", priority: 78, estimated: 28, verified: 22, updated: "1 hr ago" },
  { id: "INC-0236", category: "Fire", location: "Maligaon · Guwahati", status: "HIGH", priority: 64, estimated: 240, verified: 128, updated: "2 hrs ago" },
  { id: "INC-0234", category: "Water shortage", location: "Chandmari · Guwahati", status: "MODERATE", priority: 52, estimated: 680, verified: 401, updated: "3 hrs ago" },
];

type Scenario = { rainfall: number; closures: number; ambulances: number; boats: number; hospital: number; shelter: number; population: number; ran: boolean };
type Store = { incidents: IncidentRecord[]; approved: string[]; approve: (id: string) => void; simulation: boolean; setSimulation: (value: boolean) => void; deployedTeams: string[]; deployTeam: (id: string) => void; scenario: Scenario; setScenario: (value: Partial<Scenario>) => void; isAuthenticated: boolean; login: (username: string, password: string) => boolean; logout: () => void };
const StoreContext = createContext<Store | null>(null);

export function RescueChainProvider({ children }: { children: React.ReactNode }) {
  const [approved, setApproved] = useState<string[]>([]);
  const [simulation, setSimulation] = useState(false);
  const [deployedTeams, setDeployedTeams] = useState<string[]>([]);
  const [scenario, setScenarioState] = useState<Scenario>({ rainfall: 40, closures: 3, ambulances: 22, boats: 4, hospital: 74, shelter: 72, population: 2400, ran: false });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const value = useMemo(() => ({ incidents: prototypeIncidents, approved, approve: (id: string) => setApproved((items) => items.includes(id) ? items : [...items, id]), simulation, setSimulation, deployedTeams, deployTeam: (id: string) => setDeployedTeams((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]), scenario, setScenario: (value: Partial<Scenario>) => setScenarioState((current) => ({ ...current, ...value })), isAuthenticated, login: (username: string, password: string) => { const valid = username.trim().toLowerCase() === "operator123@gmail.com" && password === "admin@123"; if (valid) setIsAuthenticated(true); return valid; }, logout: () => setIsAuthenticated(false) }), [approved, simulation, deployedTeams, scenario, isAuthenticated]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useRescueChain() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useRescueChain must be used within RescueChainProvider");
  return store;
}
