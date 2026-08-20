"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Shield, UserRound } from "lucide-react";
import { useRescueChain } from "@/lib/store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useRescueChain();
  return isAuthenticated ? <>{children}</> : <LoginPage />;
}

function LoginPage() {
  const { login } = useRescueChain();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!login(username, password)) {
      setError("Unable to verify your access details.");
      return;
    }

    setError("");
    router.replace("/");
  };

  return <main className="login-shell"><div className="login-rail"><div className="login-brand"><div className="brand-mark"><Shield size={23} fill="currentColor" /></div><div><strong>RESCUECHAIN</strong><small>EMERGENCY OPERATIONS</small></div></div><div className="login-message"><span>EMERGENCY OPERATIONS PLATFORM</span><h1>Clarity when every minute matters.</h1><p>A workspace for reviewing incidents, coordinating resources, and supporting response decisions.</p><div className="login-assurance"><CheckCircle2 size={16} /><span>Review and approval remain with the duty officer</span></div></div><small className="login-foot">Guwahati, Assam · Emergency Operations Centre</small></div><section className="login-card"><div className="login-card-top"><div className="login-emblem"><Shield size={22} /></div><div><span>AUTHORIZED PERSONNEL ACCESS</span><h2>Sign in to RESCUECHAIN</h2></div></div><p className="login-subtitle">Secure access for authorized personnel.</p><form onSubmit={submit}><label><span>Operator email</span><div className="login-input"><UserRound size={16} /><input required type="email" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="officer_guwahati101@gmail.com" /></div></label><label><span>Password</span><div className="login-input"><LockKeyhole size={16} /><input required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>{error && <div className="login-error">{error}</div>}<button className="login-submit" type="submit">Sign in <ArrowRight size={16} /></button></form><small className="login-note">ACADEMIC PROTOTYPE · Training environment</small></section></main>;
}
