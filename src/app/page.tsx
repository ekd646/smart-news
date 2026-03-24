"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, X, BookOpen, Calculator, ShieldCheck, Scale, Gavel, FileText, Send, Paperclip, Image, MessageSquare, Lock } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

type ChatMessage = {
  role: 'user' | 'ai';
  content: string;
  fileName?: string;
  fileType?: string;
  filePreview?: string;
};

const COUNTRIES = [
  "Turkey", "Germany", "France", "United Kingdom", "Italy", "Spain", "Netherlands",
  "Switzerland", "Sweden", "Belgium", "Austria", "Poland", "Norway", "Denmark",
  "Finland", "Ireland", "Portugal", "Czech Republic", "Romania", "Greece", "Hungary"
];

type LawItem = {
  id: string;
  category: string;
  time: string;
  headline: string;
  source: string;
};

function extractLegalAnalysis(headline: string) {
  const lower = headline.toLowerCase();

  if (lower.includes("gdpr") || lower.includes("privacy") || lower.includes("data protection") || lower.includes("personal data")) {
    return {
      domain: "Data Protection & GDPR",
      summary: "This regulation falls under the EU General Data Protection Regulation (GDPR) framework. GDPR establishes strict rules on how organizations collect, store, and process personal data of EU residents. Violations can result in fines up to €20 million or 4% of annual global turnover.",
      impact: "HIGH — Affects all businesses processing EU citizen data. Non-compliance penalties are among the steepest in global regulatory history.",
      keyArticles: "GDPR Art. 5 (Data Processing Principles), Art. 17 (Right to Erasure), Art. 83 (Administrative Fines)"
    };
  }

  if (lower.includes("tax") || lower.includes("vat") || lower.includes("fiscal") || lower.includes("tariff")) {
    return {
      domain: "Tax & Fiscal Policy",
      summary: "Tax legislation governs how governments collect revenue from individuals and corporations. Changes in VAT rates, corporate tax brackets, or cross-border tariff structures directly affect business profitability and international trade flows.",
      impact: "HIGH — Direct financial impact on corporate margins and consumer pricing. Cross-border implications for multinational entities.",
      keyArticles: "EU VAT Directive 2006/112/EC, OECD BEPS Framework, Pillar Two Global Minimum Tax (15%)"
    };
  }

  if (lower.includes("labor") || lower.includes("labour") || lower.includes("employment") || lower.includes("worker") || lower.includes("wage")) {
    return {
      domain: "Employment & Labour Law",
      summary: "Employment law regulates the relationship between employers and employees. This includes minimum wage standards, working hour limits, termination protections, and collective bargaining rights. EU directives set baseline protections across member states.",
      impact: "MEDIUM — Impacts workforce management, payroll costs, and HR compliance obligations across jurisdictions.",
      keyArticles: "EU Working Time Directive 2003/88/EC, EU Minimum Wage Directive 2022/2041"
    };
  }

  if (lower.includes("criminal") || lower.includes("court") || lower.includes("judge") || lower.includes("sentence") || lower.includes("trial")) {
    return {
      domain: "Criminal Law & Judiciary",
      summary: "Criminal law defines offenses against the state and prescribes punishments. Court decisions and sentencing guidelines establish precedents that shape future legal interpretations. Judicial independence is a cornerstone of rule-of-law democracies.",
      impact: "MEDIUM — Establishes legal precedents affecting civil liberties, corporate liability, and cross-border extradition treaties.",
      keyArticles: "European Convention on Human Rights (ECHR) Art. 6 (Right to Fair Trial), EU Framework Decision 2002/584/JHA (European Arrest Warrant)"
    };
  }

  if (lower.includes("environment") || lower.includes("climate") || lower.includes("emission") || lower.includes("carbon") || lower.includes("green")) {
    return {
      domain: "Environmental & Climate Law",
      summary: "Environmental legislation addresses pollution control, carbon emissions, and sustainable development mandates. The EU Green Deal and Fit for 55 package commit member states to achieving carbon neutrality by 2050.",
      impact: "HIGH — Requires significant capital investment in green infrastructure. Carbon border taxes affect international trade competitiveness.",
      keyArticles: "EU Green Deal, EU ETS Directive 2003/87/EC, Paris Agreement Art. 4 (NDCs)"
    };
  }

  if (lower.includes("contract") || lower.includes("commercial") || lower.includes("business") || lower.includes("corporate") || lower.includes("merger")) {
    return {
      domain: "Commercial & Contract Law",
      summary: "Commercial law governs business transactions, contract formation, and corporate governance. Merger and acquisition regulations ensure fair competition. Contract disputes are typically resolved through arbitration or civil court proceedings.",
      impact: "HIGH — Directly affects M&A activity, contractual obligations, and corporate restructuring across borders.",
      keyArticles: "EU Merger Regulation (EC) No 139/2004, UNIDROIT Principles of International Commercial Contracts"
    };
  }

  if (lower.includes("regulat") || lower.includes("compliance") || lower.includes("sanction") || lower.includes("banking")) {
    return {
      domain: "Regulatory & Financial Compliance",
      summary: "Financial regulation ensures market stability, consumer protection, and anti-money laundering compliance. Regulatory bodies impose licensing requirements, capital adequacy standards, and transaction monitoring obligations.",
      impact: "HIGH — Banks and fintech companies face operational restrictions. Sanction violations carry severe criminal penalties.",
      keyArticles: "EU MiFID II Directive, EU AMLD6, Basel III Capital Requirements Regulation"
    };
  }

  return {
    domain: "General European Legislation",
    summary: "This legislative development reflects broader regulatory trends across European jurisdictions. The EU and national parliaments continuously evolve legal frameworks to address emerging societal, economic, and technological challenges.",
    impact: "MEDIUM — May signal upcoming regulatory shifts that require monitoring for compliance readiness.",
    keyArticles: "Treaty on European Union (TEU), Treaty on the Functioning of the EU (TFEU)"
  };
}

export default function Page() {
  const [country, setCountry] = useState("Turkey");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup" | "premium" | "privacy" | "terms" | "cookie">("premium");
  const [activeLaw, setActiveLaw] = useState<LawItem | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatFile, setChatFile] = useState<File | null>(null);
  const [chatFilePreview, setChatFilePreview] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const MAX_FREE_QUERIES = 3;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isPremium = false; // Will be connected to Stripe later

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setChatFile(f);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setChatFilePreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setChatFilePreview(null);
    }
  };

  const sendChat = async () => {
    if ((!chatInput.trim() && !chatFile) || isChatLoading) return;
    if (!isPremium && usageCount >= MAX_FREE_QUERIES) {
      setModalMode('premium');
      setIsModalOpen(true);
      return;
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: chatInput,
      fileName: chatFile?.name,
      fileType: chatFile?.type,
      filePreview: chatFilePreview || undefined,
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', chatInput);
      formData.append('country', country);
      if (chatFile) formData.append('file', chatFile);

      const res = await fetch('/api/chat', { method: 'POST', body: formData });
      const data = await res.json();

      setChatMessages(prev => [...prev, { role: 'ai', content: data.analysis || 'Analysis could not be completed.' }]);
      setUsageCount(prev => prev + 1);
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', content: '⚠️ Connection error. Please try again.' }]);
    }

    setChatFile(null);
    setChatFilePreview(null);
    setIsChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const [laws, setLaws] = useState<LawItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLaws([]);

    fetch(`/api/laws?country=${encodeURIComponent(country)}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.laws) setLaws(data.laws);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [country]);

  const uniqueCategories = Array.from(new Set(laws.map(n => n.category)));
  const aiData = activeLaw ? extractLegalAnalysis(activeLaw.headline) : null;

  return (
    <div className="bg-[#0a0a0c] min-h-screen text-[#e5e1e4] font-sans selection:bg-[#d97a53] selection:text-white">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#d97a53]/15 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[800px] h-[800px] bg-[#1a3a5c]/20 blur-[150px] rounded-full"></div>
      </div>

      {/* Modal System */}
      <AnimatePresence>
        {isModalOpen && !activeLaw && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} className="bg-[#0f0f12] border border-white/10 shadow-2xl rounded-2xl p-8 max-w-md w-full relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>

              {modalMode === "premium" && (
                <div className="animate-fade-in-up">
                  <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97a53] to-[#a85530] flex items-center justify-center shadow-lg shadow-[#d97a53]/20">
                      <Scale size={28} className="text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2">Upgrade to <span className="text-[#d97a53]">Pro</span></h2>
                  <p className="text-[#dbc1b8] text-center mb-8 text-sm">Unlock AI contract analysis, unlimited document scans, multi-jurisdiction comparisons, and priority legal alerts.</p>
                  <button className="w-full py-3 bg-[#d97a53] text-[#531900] font-black tracking-widest uppercase rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                    Start 14-Day Free Trial
                  </button>
                </div>
              )}

              {modalMode === "login" && (
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Welcome Back</h2>
                  <p className="text-[#dbc1b8] text-center mb-6 text-sm">Sign in to Pactum AI to continue.</p>
                  <div className="space-y-4 mb-6">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#d97a53] transition-colors" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#d97a53] transition-colors" />
                  </div>
                  <button disabled={isSubmitting} onClick={async () => {
                    setIsSubmitting(true);
                    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                    setIsSubmitting(false);
                    if (error) { alert(error.message); return; }
                    setUser(data.user);
                    setIsModalOpen(false);
                    setEmail(''); setPassword('');
                  }} className="w-full py-3 bg-white text-[#0f0f12] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-gray-200 transition-colors mb-4 disabled:opacity-50">
                    {isSubmitting ? 'Verifying...' : 'Sign In'}
                  </button>
                  <p className="text-center text-xs text-[#a38c84] border-t border-white/10 pt-4">Don't have an account? <span onClick={() => setModalMode("signup")} className="text-[#d97a53] cursor-pointer hover:underline font-bold">Create one</span></p>
                </div>
              )}

              {modalMode === "signup" && (
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Create Account</h2>
                  <p className="text-[#dbc1b8] text-center mb-6 text-sm">Join Pactum AI for AI-powered legal intelligence.</p>
                  <div className="space-y-4 mb-6">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work Email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#d97a53] transition-colors" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create Password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#d97a53] transition-colors" />
                  </div>
                  <button disabled={isSubmitting} onClick={async () => {
                    if (!email || !password) return;
                    setIsSubmitting(true);
                    const { error } = await supabase.auth.signUp({ email, password });
                    setIsSubmitting(false);
                    if (error) { alert(error.message); return; }
                    alert('Success! Check your email for authentication link.');
                    setModalMode('login');
                    setPassword('');
                  }} className="w-full py-3 bg-[#d97a53] text-[#531900] font-black uppercase tracking-widest rounded-lg shadow-lg hover:opacity-90 transition-opacity mb-4 disabled:opacity-50">
                    {isSubmitting ? 'Registering...' : 'Create Account'}
                  </button>
                  <p className="text-center text-xs text-[#a38c84] border-t border-white/10 pt-4">Already a member? <span onClick={() => setModalMode("login")} className="text-[#d97a53] cursor-pointer hover:underline font-bold">Sign In</span></p>
                </div>
              )}

              {modalMode === "privacy" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <h2 className="text-3xl font-extrabold text-white mb-6">Privacy Policy</h2>
                  <div className="space-y-4 text-sm text-[#dbc1b8] leading-relaxed">
                    <p><strong>Last Updated: March 2026</strong></p>
                    <p>At Pactum AI, we are committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information in compliance with GDPR and applicable data protection laws.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">1. Information We Collect</h3>
                    <p>We collect information you provide when creating an account, uploading contracts for analysis, or interacting with our AI legal assistant. Document data is processed in encrypted sandboxes and never stored permanently.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">2. How We Use Information</h3>
                    <p>Your data is strictly utilized to authenticate access, deliver AI-powered legal analysis, and ensure compliance with multi-jurisdictional regulations. We never sell user data.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">3. Data Security</h3>
                    <p>All document processing flows are encrypted via AES-256 and comply with EU GDPR Article 32 security requirements.</p>
                  </div>
                </div>
              )}

              {modalMode === "terms" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <h2 className="text-3xl font-extrabold text-white mb-6">Terms of Service</h2>
                  <div className="space-y-4 text-sm text-[#dbc1b8] leading-relaxed">
                    <p><strong>Effective Date: March 2026</strong></p>
                    <p>By accessing the Pactum AI platform, you agree to be bound by these Terms of Service.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">1. Use of Services</h3>
                    <p>Pactum AI provides AI-assisted legal intelligence for informational purposes. It does not constitute legal advice. Always consult a licensed attorney for legal decisions.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">2. Subscription and Billing</h3>
                    <p>Pro access is billed on a monthly or annual cycle. Free tier includes limited jurisdiction monitoring.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">3. Limitation of Liability</h3>
                    <p>Pactum AI shall not be held liable for any legal outcomes arising from reliance on AI-generated analysis.</p>
                  </div>
                </div>
              )}

              {modalMode === "cookie" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <h2 className="text-3xl font-extrabold text-white mb-6">Cookie Policy</h2>
                  <div className="space-y-4 text-sm text-[#dbc1b8] leading-relaxed">
                    <p><strong>Effective Date: March 2026</strong></p>
                    <p>Pactum AI uses cookies to maintain secure sessions and improve platform performance.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">1. Essential Cookies</h3>
                    <p>Required for authentication and secure document processing sessions.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">2. Analytics</h3>
                    <p>We use anonymized analytics to optimize platform performance across jurisdictions.</p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-3 font-medium">
                  <ShieldCheck size={14} className="text-[#5ed9ce]" /> GDPR Compliant & Encrypted
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Analysis Overlay */}
      <AnimatePresence>
        {activeLaw && aiData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} className="bg-[#0f0f12] border border-white/10 shadow-2xl rounded-2xl p-6 md:p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setActiveLaw(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>

              <div className="flex items-center gap-3 mb-4 mt-2">
                <span className="bg-[#5ed9ce]/20 text-[#5ed9ce] text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">{activeLaw.category}</span>
                <span className="text-[#a38c84] text-xs font-medium tracking-widest">{activeLaw.time}</span>
                <span className="text-[#d97a53] text-[10px] sm:text-xs font-bold uppercase tracking-widest ml-auto mr-6 border border-[#d97a53]/30 px-2 py-1 rounded">Source: {activeLaw.source}</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-6 leading-tight">{activeLaw.headline}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#5ed9ce]"></div>
                  <h3 className="flex items-center gap-2 text-[#5ed9ce] font-bold text-lg mb-3"><Scale size={18}/> Legal Domain</h3>
                  <p className="text-[#d97a53] font-extrabold text-xl mb-2">{aiData.domain}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{aiData.summary}</p>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#d97a53]"></div>
                  <h3 className="flex items-center gap-2 text-[#d97a53] font-bold text-lg mb-3"><Gavel size={18}/> Impact Assessment</h3>
                  <p className="text-white font-extrabold text-xl mb-2">{aiData.impact.split('—')[0]}</p>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{aiData.impact.split('—')[1]}</p>
                  <h4 className="text-[#a38c84] font-bold text-xs uppercase tracking-widest mb-1">Key Legal References</h4>
                  <p className="text-[#5ed9ce] text-xs font-mono">{aiData.keyArticles}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pt-6 pb-4 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/95 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d97a53] to-[#a85530] flex items-center justify-center shadow-lg shadow-[#d97a53]/20">
            <Scale size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-widest text-white uppercase font-sans leading-none">Pactum <span className="text-[#d97a53]">AI</span></span>
            <span className="text-[9px] font-bold tracking-[0.4em] text-[#d97a53] uppercase leading-none mt-1">Contract Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4 px-12">
          {user ? (
            <>
              <span className="text-white text-xs font-bold uppercase tracking-widest hidden sm:inline-block">{user.email?.split('@')[0]}</span>
              <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block"></div>
              <button onClick={async () => { await supabase.auth.signOut(); setUser(null); }} className="text-[#d97a53] text-xs font-bold uppercase tracking-widest hover:text-white transition-all">Sign Out</button>
            </>
          ) : (
            <>
              <button onClick={() => { setModalMode("login"); setIsModalOpen(true); }} className="text-[#a38c84] text-xs font-bold uppercase tracking-widest hover:text-white transition-all">Login</button>
              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
              <button onClick={() => { setModalMode("signup"); setIsModalOpen(true); }} className="text-[#a38c84] text-xs font-bold uppercase tracking-widest hover:text-white transition-all">Sign Up</button>
            </>
          )}
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <button onClick={() => { setModalMode("premium"); setIsModalOpen(true); }} className="bg-[#d97a53] text-[#531900] px-3 py-1 rounded-sm text-[10px] sm:text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform duration-200">Pro</button>
        </div>

        <div className="flex items-center gap-8 md:gap-16 font-sans tracking-widest font-bold text-[11px] md:text-xs uppercase">
          <a className="text-[#ffb599] hover:text-white transition-all duration-300 cursor-pointer">Legislation</a>
          <a className="text-[#a38c84] hover:text-white transition-all duration-300 cursor-pointer">Contracts</a>
          <button onClick={() => { setModalMode("premium"); setIsModalOpen(true); }} className="text-[#a38c84] hover:text-[#d97a53] transition-all duration-300 cursor-pointer">Analyzer</button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-52 pb-8 px-6 max-w-[1600px] mx-auto min-h-screen">
        <section className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a3a5c]/30 border border-[#1a3a5c]/40 mb-8">
            <Gavel size={14} className="text-[#5ed9ce]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5ed9ce]">LIVE LEGAL INTELLIGENCE ENGINE</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col lg:flex-row items-center justify-center gap-4 bg-[#0f0f12] max-w-fit mx-auto p-2 rounded-[32px] border border-white/5 shadow-2xl flex-wrap">
            <div className="relative flex items-center px-4 md:px-6 w-full lg:w-auto h-11 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-[#d97a53]/20 cursor-pointer">
              <Globe size={18} className="text-[#d97a53] mr-2" />
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="bg-transparent text-white font-extrabold text-xs sm:text-sm tracking-widest outline-none cursor-pointer appearance-none pr-8 w-full md:min-w-[200px] hover:text-[#ffb599] transition-colors"
              >
                {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#0f0f12] text-white">{c}</option>)}
              </select>
              <div className="absolute right-4 pointer-events-none text-[#d97a53]">▾</div>
            </div>
          </motion.div>
        </section>

        {/* AI Legal Chat */}
        <section className="mb-12 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-full flex items-center justify-between bg-gradient-to-r from-[#d97a53]/10 to-[#1a3a5c]/10 border border-[#d97a53]/20 hover:border-[#d97a53]/40 rounded-2xl px-6 py-4 mb-4 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d97a53] to-[#a85530] flex items-center justify-center shadow-lg shadow-[#d97a53]/20">
                  <MessageSquare size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-extrabold text-sm tracking-wide">AI Legal Assistant</h3>
                  <p className="text-[#a38c84] text-[10px] tracking-widest uppercase">Upload contracts & ask legal questions — {country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isPremium && (
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded bg-white/5 border border-white/10 text-[#a38c84]">
                    {Math.max(0, MAX_FREE_QUERIES - usageCount)}/{MAX_FREE_QUERIES} Free
                  </span>
                )}
                <span className={`text-[#d97a53] text-xl transition-transform duration-300 ${isChatOpen ? 'rotate-180' : ''}`}>▾</span>
              </div>
            </button>

            <AnimatePresence>
              {isChatOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="bg-[#0f0f12] border border-white/10 rounded-2xl overflow-hidden">
                    {/* Messages Area */}
                    <div className="max-h-[400px] overflow-y-auto p-6 space-y-4 scrollbar-hide">
                      {chatMessages.length === 0 && (
                        <div className="text-center py-12">
                          <Scale size={40} className="mx-auto mb-4 text-[#d97a53]/30" />
                          <p className="text-[#a38c84] font-bold text-sm mb-1">Ask me anything about <span className="text-[#d97a53]">{country}</span> law</p>
                          <p className="text-[#a38c84]/60 text-xs">Upload a contract, photo, or document for AI-powered legal analysis</p>
                        </div>
                      )}

                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-[#d97a53] text-[#531900]' : 'bg-white/5 border border-white/10 text-[#e5e1e4]'}`}>
                            {msg.filePreview && (
                              <img src={msg.filePreview} alt="Upload" className="max-w-[200px] rounded-lg mb-2 border border-white/10" />
                            )}
                            {msg.fileName && !msg.filePreview && (
                              <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2 mb-2 text-xs">
                                <FileText size={14} />
                                <span className="font-bold truncate">{msg.fileName}</span>
                              </div>
                            )}
                            {msg.content && (
                              <div className={`text-sm leading-relaxed whitespace-pre-line ${msg.role === 'ai' ? 'font-mono text-xs' : 'font-bold'}`}>
                                {msg.content.split('\n').map((line, li) => {
                                  if (msg.role === 'ai') {
                                    if (line.startsWith('###')) return <h4 key={li} className="text-[#d97a53] font-extrabold text-sm mt-3 mb-1 font-sans">{line.replace(/###\s?/g, '')}</h4>;
                                    if (line.startsWith('**') && line.endsWith('**')) return <p key={li} className="text-white font-bold text-xs mt-2">{line.replace(/\*\*/g, '')}</p>;
                                    if (line.startsWith('- ')) return <p key={li} className="text-[#5ed9ce] text-xs ml-2">• {line.slice(2)}</p>;
                                    if (line.startsWith('⚠️') || line.startsWith('✅') || line.startsWith('📄') || line.startsWith('⚖️') || line.startsWith('📚') || line.startsWith('💡') || line.startsWith('🔍')) return <p key={li} className="text-sm font-sans mt-2">{line}</p>;
                                    if (line.startsWith('>')) return <p key={li} className="text-[#a38c84] text-[10px] italic mt-3 border-l-2 border-[#d97a53]/30 pl-2">{line.slice(2)}</p>;
                                  }
                                  return <p key={li}>{line}</p>;
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-[#d97a53] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-[#d97a53] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-[#d97a53] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-[#a38c84] text-xs font-bold">Analyzing under {country} law...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Usage Limit Overlay */}
                    {!isPremium && usageCount >= MAX_FREE_QUERIES && (
                      <div className="px-6 py-4 bg-gradient-to-r from-[#d97a53]/10 to-transparent border-t border-[#d97a53]/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Lock size={18} className="text-[#d97a53]" />
                            <div>
                              <p className="text-white font-bold text-sm">Free queries exhausted</p>
                              <p className="text-[#a38c84] text-[10px]">Upgrade to Pro for unlimited AI legal analysis</p>
                            </div>
                          </div>
                          <button onClick={() => { setModalMode('premium'); setIsModalOpen(true); }} className="bg-[#d97a53] text-[#531900] px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                            Upgrade
                          </button>
                        </div>
                      </div>
                    )}

                    {/* File Preview Bar */}
                    {chatFile && (
                      <div className="px-6 py-2 bg-white/5 border-t border-white/5 flex items-center gap-3">
                        {chatFilePreview ? (
                          <img src={chatFilePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#d97a53]/20 flex items-center justify-center"><FileText size={16} className="text-[#d97a53]" /></div>
                        )}
                        <span className="text-white text-xs font-bold truncate flex-1">{chatFile.name}</span>
                        <button onClick={() => { setChatFile(null); setChatFilePreview(null); }} className="text-[#a38c84] hover:text-white"><X size={16} /></button>
                      </div>
                    )}

                    {/* Input Bar */}
                    <div className="flex items-center gap-2 p-4 border-t border-white/5">
                      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp" className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#a38c84] hover:text-[#d97a53] transition-all" title="Upload Document">
                        <Paperclip size={18} />
                      </button>
                      <button onClick={() => { const i = fileInputRef.current; if (i) { i.accept = 'image/*'; i.click(); i.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp'; } }} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#a38c84] hover:text-[#d97a53] transition-all" title="Upload Photo">
                        <Image size={18} />
                      </button>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendChat()}
                        placeholder={`Ask a legal question about  ${country}...`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#d97a53] transition-colors placeholder:text-[#a38c84]/50"
                        disabled={!isPremium && usageCount >= MAX_FREE_QUERIES}
                      />
                      <button onClick={sendChat} disabled={isChatLoading || (!isPremium && usageCount >= MAX_FREE_QUERIES)} className="w-10 h-10 rounded-xl bg-[#d97a53] hover:bg-[#c86a43] flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#d97a53]/20">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Laws Grid */}
        <section>
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-3 text-[#a38c84]">
                <div className="w-5 h-5 border-2 border-[#d97a53] border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold tracking-widest text-sm uppercase">Scanning {country} Legal Database...</span>
              </div>
            </div>
          ) : laws.length === 0 ? (
            <div className="text-center py-20 text-[#a38c84]">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-bold tracking-widest text-sm uppercase">No legal updates found for {country}</p>
            </div>
          ) : (
            <>
              {uniqueCategories.map(cat => {
                const catLaws = laws.filter(l => l.category === cat);
                if (catLaws.length === 0) return null;
                return (
                  <div key={cat} className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm">{cat}</span>
                      <div className="flex-1 h-[1px] bg-white/5"></div>
                      <span className="text-[#a38c84] text-[10px] font-bold tracking-widest">{catLaws.length} updates</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                      {catLaws.map(law => (
                        <motion.div
                          key={law.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          onClick={() => setActiveLaw(law)}
                          className="bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-[#d97a53]/30 rounded-xl p-4 cursor-pointer transition-all duration-300 group"
                        >
                          <span className="text-[#5ed9ce]/60 font-mono text-[10px] border border-[#5ed9ce]/20 px-1.5 py-0.5 rounded mb-2 inline-block">{law.time}</span>
                          <h3 className="text-white font-bold text-sm leading-snug mb-3 group-hover:text-[#ffb599] transition-colors line-clamp-3">{law.headline}</h3>
                          <p className="text-[#a38c84] text-[10px] font-bold uppercase tracking-widest">{law.source}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="border-t border-white/5 py-6 px-6 text-center space-y-3">
        <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <button onClick={() => { setModalMode("privacy"); setIsModalOpen(true); }} className="text-[#a38c84] hover:text-white transition-all">Privacy</button>
          <button onClick={() => { setModalMode("terms"); setIsModalOpen(true); }} className="text-[#a38c84] hover:text-white transition-all">Terms</button>
          <button onClick={() => { setModalMode("cookie"); setIsModalOpen(true); }} className="text-[#a38c84] hover:text-white transition-all">Cookies</button>
        </div>
        <div className="text-[#a38c84]/50 text-[10px]">© 2026 Pactum AI. All rights reserved. Contract Intelligence Platform.</div>
      </motion.footer>
    </div>
  );
}
