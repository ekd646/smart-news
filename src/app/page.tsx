"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Globe,
  X,
  BookOpen,
  Calculator,
  ShieldCheck,
  Scale,
  Gavel,
  FileText,
  Send,
  Paperclip,
  Image,
  MessageSquare,
  Lock,
  Building2,
  Languages,
  FileCheck,
  Briefcase,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type ChatMessage = {
  role: "user" | "ai";
  content: string;
  fileName?: string;
  fileType?: string;
  filePreview?: string;
};

const COUNTRIES = [
  "Turkey",
  "Germany",
  "France",
  "United Kingdom",
  "Italy",
  "Spain",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Belgium",
  "Austria",
  "Poland",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  "Portugal",
  "Czech Republic",
  "Romania",
  "Greece",
  "Hungary",
];

export default function Page() {
  const [country, setCountry] = useState("Turkey");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "login" | "signup" | "enterprise" | "privacy" | "terms" | "cookie" | "corporate"
  >("enterprise");
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

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
    if (f.type.startsWith("image/")) {
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
      setModalMode("enterprise");
      setIsModalOpen(true);
      return;
    }

    const userMsg: ChatMessage = {
      role: "user",
      content: chatInput,
      fileName: chatFile?.name,
      fileType: chatFile?.type,
      filePreview: chatFilePreview || undefined,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", chatInput);
      formData.append("country", country);
      if (chatFile) formData.append("file", chatFile);

      const res = await fetch("/api/chat", { method: "POST", body: formData });
      const data = await res.json();

      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.analysis || "Analysis could not be completed.",
        },
      ]);
      setUsageCount((prev) => prev + 1);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Connection error. Please try again." },
      ]);
    }

    setChatFile(null);
    setChatFilePreview(null);
    setIsChatLoading(false);
  };

  return (
    <div className="bg-[#451c20] min-h-screen text-white font-sans selection:bg-[#db2d27] selection:text-white">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden mix-blend-screen opacity-50">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-[#db2d27]/20 blur-[160px] rounded-[100%]"></div>
        <div className="absolute bottom-[-10%] left-[50%] -translate-x-1/2 w-[1200px] h-[800px] bg-[#db2d27]/10 blur-[200px] rounded-[100%]"></div>
      </div>

      {/* In-Theme Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold tracking-wide ${
          toast.ok
            ? "bg-[#1a0a0b] border-[#db2d27]/40 text-white"
            : "bg-[#1a0a0b] border-red-500/50 text-red-400"
        }`}>
          <span className={toast.ok ? "text-[#db2d27]" : "text-red-400"}>{toast.ok ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      {/* Modal System */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#451c20]/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-[#db2d27] border border-[#db2d27]/20 shadow-2xl rounded-2xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {modalMode === "enterprise" && (
                <div className="animate-fade-in-up">
                  <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#db2d27] to-[#451c20] flex items-center justify-center shadow-lg shadow-[#db2d27]/5">
                      <Building2 size={28} className="text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2">
                    Get in <span className="text-[#db2d27]">Touch</span>
                  </h2>
                  <p className="text-[#d4b5b8] text-center mb-6 text-sm">
                    Send us your details and we'll respond via email within 24 hours.
                  </p>
                  <div className="space-y-4 mb-6">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Work Email"
                      className="w-full bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#db2d27] transition-colors"
                    />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company Name"
                      className="w-full bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#db2d27] transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="What do you need? (optional)"
                      className="w-full bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#db2d27] transition-colors"
                    />
                  </div>
                  <button
                    disabled={isSubmitting}
                    onClick={async () => {
                      if (!email) return;
                      setIsSubmitting(true);
                      const { error } = await supabase
                        .from("leads")
                        .insert([{ email, company: companyName, source: "Republia - Enterprise Enquiry" }]);
                      setIsSubmitting(false);
                      if (error) {
                        showToast("Something went wrong. Please try again.", false);
                        console.error(error);
                        return;
                      }
                      showToast("Enquiry submitted! We'll be in touch via email within 24 hours.");
                      setEmail("");
                      setCompanyName("");
                      setIsModalOpen(false);
                    }}
                    className="w-full py-3 bg-[#db2d27] text-[#2D0A10] font-black tracking-widest uppercase rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                  </button>
                </div>
              )}

              {modalMode === "login" && (
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="text-[#d4b5b8] text-center mb-6 text-sm">
                    Sign in to Republia to continue.
                  </p>
                  <div className="space-y-4 mb-6">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#db2d27] transition-colors"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#db2d27] transition-colors"
                    />
                  </div>
                  <button
                    disabled={isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true);
                      const { data, error } =
                        await supabase.auth.signInWithPassword({
                          email,
                          password,
                        });
                      setIsSubmitting(false);
                      if (error) {
                        showToast(error.message, false);
                        return;
                      }
                      setUser(data.user);
                      setIsModalOpen(false);
                      setEmail("");
                      setPassword("");
                    }}
                    className="w-full py-3 bg-white text-[#0f0f12] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-gray-200 transition-colors mb-4 disabled:opacity-50"
                  >
                    {isSubmitting ? "Verifying..." : "Sign In"}
                  </button>
                  <p className="text-center text-xs text-white/90 border-t border-[#db2d27]/20 pt-4">
                    Don't have an account?{" "}
                    <span
                      onClick={() => setModalMode("signup")}
                      className="text-[#db2d27] cursor-pointer hover:underline font-bold"
                    >
                      Create one
                    </span>
                  </p>
                </div>
              )}

              {modalMode === "signup" && (
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
                    Create Account
                  </h2>
                  <p className="text-[#d4b5b8] text-center mb-6 text-sm">
                    Join Republia for AI-powered legal intelligence.
                  </p>
                  <div className="space-y-4 mb-6">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Work Email"
                      className="w-full bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#db2d27] transition-colors"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create Password"
                      className="w-full bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#db2d27] transition-colors"
                    />
                  </div>
                  <button
                    disabled={isSubmitting}
                    onClick={async () => {
                      if (!email || !password) return;
                      setIsSubmitting(true);
                      const { error } = await supabase.auth.signUp({
                        email,
                        password,
                      });
                      setIsSubmitting(false);
                      if (error) {
                        showToast(error.message, false);
                        return;
                      }
                      showToast("Account created! Check your email for the confirmation link.");
                      setModalMode("login");
                      setPassword("");
                    }}
                    className="w-full py-3 bg-[#db2d27] text-[#2D0A10] font-black uppercase tracking-widest rounded-lg shadow-lg hover:opacity-90 transition-opacity mb-4 disabled:opacity-50"
                  >
                    {isSubmitting ? "Registering..." : "Create Account"}
                  </button>
                  <p className="text-center text-xs text-white/90 border-t border-[#db2d27]/20 pt-4">
                    Already a member?{" "}
                    <span
                      onClick={() => setModalMode("login")}
                      className="text-[#db2d27] cursor-pointer hover:underline font-bold"
                    >
                      Sign In
                    </span>
                  </p>
                </div>
              )}

              {modalMode === "privacy" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <h2 className="text-3xl font-extrabold text-white mb-6">
                    Privacy Policy
                  </h2>
                  <div className="space-y-4 text-sm text-[#d4b5b8] leading-relaxed">
                    <p>
                      <strong>Last Updated: March 2026</strong>
                    </p>
                    <p>
                      At Republia, we are committed to protecting your privacy
                      and ensuring the security of your personal data. This
                      Privacy Policy outlines how we collect, use, and safeguard
                      your information in compliance with GDPR and applicable
                      data protection laws.
                    </p>
                    <h3 className="text-lg text-[#db2d27] font-bold mt-6 mb-2">
                      1. Information We Collect
                    </h3>
                    <p>
                      We collect information you provide when creating an
                      account, uploading contracts for analysis, or interacting
                      with our AI legal assistant. Document data is processed in
                      encrypted sandboxes and never stored permanently.
                    </p>
                    <h3 className="text-lg text-[#db2d27] font-bold mt-6 mb-2">
                      2. How We Use Information
                    </h3>
                    <p>
                      Your data is strictly utilized to authenticate access,
                      deliver AI-powered legal analysis, and ensure compliance
                      with multi-jurisdictional regulations. We never sell user
                      data.
                    </p>
                    <h3 className="text-lg text-[#db2d27] font-bold mt-6 mb-2">
                      3. Data Security
                    </h3>
                    <p>
                      All document processing flows are encrypted via AES-256
                      and comply with EU GDPR Article 32 security requirements.
                    </p>
                  </div>
                </div>
              )}

              {modalMode === "terms" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <h2 className="text-3xl font-extrabold text-white mb-6">
                    Terms of Service
                  </h2>
                  <div className="space-y-4 text-sm text-[#d4b5b8] leading-relaxed">
                    <p>
                      <strong>Effective Date: March 2026</strong>
                    </p>
                    <p>
                      By accessing the Republia platform, you agree to be bound
                      by these Terms of Service.
                    </p>
                    <h3 className="text-lg text-[#db2d27] font-bold mt-6 mb-2">
                      1. Use of Services
                    </h3>
                    <p>
                      Republia provides AI-assisted legal intelligence for
                      informational purposes. It does not constitute legal
                      advice. Always consult a licensed attorney for legal
                      decisions.
                    </p>
                    <h3 className="text-lg text-[#db2d27] font-bold mt-6 mb-2">
                      2. Subscription and Billing
                    </h3>
                    <p>
                      Pro access is billed on a monthly or annual cycle. Free
                      tier includes limited jurisdiction monitoring.
                    </p>
                    <h3 className="text-lg text-[#db2d27] font-bold mt-6 mb-2">
                      3. Limitation of Liability
                    </h3>
                    <p>
                      Republia shall not be held liable for any legal outcomes
                      arising from reliance on AI-generated analysis.
                    </p>
                  </div>
                </div>
              )}

              {modalMode === "cookie" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <h2 className="text-3xl font-extrabold text-white mb-6">
                    Cookie Policy
                  </h2>
                  <div className="space-y-4 text-sm text-[#d4b5b8] leading-relaxed">
                    <p>
                      <strong>Effective Date: March 2026</strong>
                    </p>
                    <p>
                      Republia uses cookies to maintain secure sessions and
                      improve platform performance.
                    </p>
                    <h3 className="text-lg text-[#db2d27] font-bold mt-6 mb-2">
                      1. Essential Cookies
                    </h3>
                    <p>
                      Required for authentication and secure document processing
                      sessions.
                    </p>
                    <h3 className="text-lg text-[#db2d27] font-bold mt-6 mb-2">
                      2. Analytics
                    </h3>
                    <p>
                      We use anonymized analytics to optimize platform
                      performance across jurisdictions.
                    </p>
                  </div>
                </div>
              )}

              {modalMode === "corporate" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <div className="flex justify-center text-left w-full mx-auto">
                    <div className="flex flex-col w-full text-white/90 font-mono space-y-4 text-xs tracking-widest leading-relaxed border-l-4 border-[#db2d27] bg-[#451c20]/50 backdrop-blur-sm p-6 rounded-r-lg">
                      <div className="border-b border-[#db2d27]/20 pb-4 mb-2">
                        <span className="text-[#db2d27] font-black tracking-[0.2em] uppercase text-[10px]">LEGAL ENTITY & OWNERSHIP</span>
                        <h3 className="text-2xl font-bold font-serif text-white mt-2 uppercase tracking-[0.3em]">NISDE LTD</h3>
                        <p className="text-[10px] text-[#db2d27] font-sans tracking-widest mt-1 uppercase">Company Number: 14781423</p>
                      </div>
                      <div>
                        <span className="text-white/40 uppercase tracking-[0.15em] text-[10px] font-bold block mb-1">REGISTERED OFFICE</span>
                         <span className="font-sans text-[#f2f2f2]">71-75 Shelton Street<br/>
                         Covent Garden, London<br/>
                         WC2H 9JQ, United Kingdom</span>
                      </div>
                      <div className="pt-2">
                         <span className="text-white/40 uppercase tracking-[0.15em] text-[10px] font-bold block mb-1">MANAGING DIRECTOR</span>
                         <span className="font-sans font-black uppercase text-[#db2d27]">MUSTAFA DENiZ AVCI</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-white/80 mb-3 font-medium">
                  <ShieldCheck size={14} className="text-[#db2d27]" /> GDPR
                  Compliant & Encrypted
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pt-6 pb-4 bg-[#451c20]/90 backdrop-blur-xl border-b border-white/5"
      >
        <div className="flex items-center gap-4 mb-4 select-none group cursor-pointer">
          <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#7f2227] to-[#451c20] border border-[#db2d27]/30 rounded-lg shadow-[0_0_20px_rgba(219,45,39,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_infinite]"></div>
            <span className="text-[#f2f2f2] font-serif text-3xl font-black italic tracking-tighter pr-1">
              R
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#f2f2f2] leading-none mb-1">
              Republia<span className="text-[#db2d27]">.co</span>
            </span>
            <span className="text-[10px] md:text-[11px] font-sans font-bold tracking-[0.35em] text-[#db2d27] uppercase leading-none opacity-90">
              Enterprise Legal Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 border-b border-[#db2d27]/20 pb-4 px-12">
          {user ? (
            <>
              <span className="text-white text-xs font-bold uppercase tracking-widest hidden sm:inline-block">
                {user.email?.split("@")[0]}
              </span>
              <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block"></div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="text-[#db2d27] text-xs font-bold uppercase tracking-widest hover:text-white transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setModalMode("login");
                  setIsModalOpen(true);
                }}
                className="text-white/90 text-xs font-bold uppercase tracking-widest hover:text-white transition-all"
              >
                Client Login
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => {
                  setModalMode("signup");
                  setIsModalOpen(true);
                }}
                className="text-[#db2d27] text-xs font-bold uppercase tracking-widest hover:text-white transition-all"
              >
                Create Account
              </button>
            </>
          )}
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <button
            onClick={() => {
              setModalMode("enterprise");
              setIsModalOpen(true);
            }}
            className="bg-[#db2d27] text-[#2D0A10] px-3 py-1 rounded-sm text-[10px] sm:text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform duration-200"
          >
            Book A Demo
          </button>
        </div>

        <div className="flex items-center gap-8 md:gap-16 font-sans tracking-widest font-bold text-[11px] md:text-xs uppercase">
          <a
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-white hover:text-white transition-all duration-300 cursor-pointer"
          >
            Enterprise Plans
          </a>
          <button
            onClick={() => {
              setModalMode("enterprise");
              setIsModalOpen(true);
            }}
            className="text-white/90 hover:text-[#db2d27] transition-all duration-300 cursor-pointer"
          >
            Request API
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-52 pb-8 px-6 max-w-[1600px] mx-auto min-h-screen">
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#db2d27]/10 border border-[#db2d27]/40 mb-6"
          >
            <Building2 size={14} className="text-[#db2d27]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#db2d27]">
              ENTERPRISE LEGAL SUITE
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            One Platform.
            <br />
            <span className="text-[#db2d27]">Total Legal Intelligence.</span>
          </h1>
          <p className="max-w-xl mx-auto text-white/90 mb-12 text-sm sm:text-base leading-relaxed">
            Automate corporate workflows with military-grade encrypted AI.
            Analyze contracts, enforce compliance, and protect data privacy in
            seconds.
          </p>

          {/* APPS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left mb-16">
            <div
              onClick={() => setActiveTool("contract")}
              className="bg-[#db2d27] border border-[#db2d27]/30 hover:border-[#db2d27] rounded-2xl p-6 cursor-pointer transition-all group shadow-lg hover:shadow-[#db2d27]/10 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#db2d27] to-[#451c20] flex items-center justify-center shadow-lg mb-4 text-white">
                <FileText size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Contract Redliner
              </h3>
              <p className="text-sm text-white/90">
                Upload agreements. AI identifies hidden liabilities, missing
                clauses, and non-compliance flags instantly.
              </p>
              <div className="mt-4 text-[#db2d27] text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                Launch Module <span>→</span>
              </div>
            </div>

            <div
              onClick={() => {
                setModalMode("enterprise");
                setIsModalOpen(true);
              }}
              className="bg-[#db2d27] border border-[#db2d27]/20 hover:border-white/30 rounded-2xl p-6 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#db2d27]/20 flex items-center justify-center mb-4 text-white">
                <BookOpen size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Fast Doc Generator
              </h3>
              <p className="text-sm text-white/90">
                Generate foolproof NDAs, Employment Contracts, and Service
                Agreements in seconds.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Lock size={12} className="text-[#db2d27]" />
                <span className="text-[#db2d27] text-xs font-bold uppercase tracking-widest">
                  Enterprise Only
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                setModalMode("enterprise");
                setIsModalOpen(true);
              }}
              className="bg-[#db2d27] border border-[#db2d27]/20 hover:border-white/30 rounded-2xl p-6 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#db2d27]/20 flex items-center justify-center mb-4 text-white">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                GDPR/KVKK Shield
              </h3>
              <p className="text-sm text-white/90">
                Scan your website terms, e-commerce policies, or apps for
                privacy law violations in real-time.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Lock size={12} className="text-[#db2d27]" />
                <span className="text-[#db2d27] text-xs font-bold uppercase tracking-widest">
                  Enterprise Only
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                setModalMode("enterprise");
                setIsModalOpen(true);
              }}
              className="bg-[#db2d27] border border-[#db2d27]/20 hover:border-white/30 rounded-2xl p-6 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#db2d27]/20 flex items-center justify-center mb-4 text-white">
                <Languages size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Legal Translator
              </h3>
              <p className="text-sm text-white/90">
                Translate official documents with precise legal terminology
                across 20+ EU jurisdictions perfectly.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Lock size={12} className="text-[#db2d27]" />
                <span className="text-[#db2d27] text-xs font-bold uppercase tracking-widest">
                  Enterprise Only
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                setModalMode("enterprise");
                setIsModalOpen(true);
              }}
              className="bg-[#db2d27] border border-[#db2d27]/20 hover:border-white/30 rounded-2xl p-6 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#db2d27]/20 flex items-center justify-center mb-4 text-white">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Internal HR Chat (RAG)
              </h3>
              <p className="text-sm text-white/90">
                Train a private AI assistant purely on your corporate handbook
                to answer employee queries 24/7.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Lock size={12} className="text-[#db2d27]" />
                <span className="text-[#db2d27] text-xs font-bold uppercase tracking-widest">
                  Enterprise Only
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                setModalMode("enterprise");
                setIsModalOpen(true);
              }}
              className="bg-[#db2d27] border border-[#db2d27]/20 hover:border-white/30 rounded-2xl p-6 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#db2d27]/20 flex items-center justify-center mb-4 text-white">
                <FileCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Debt Recovery Bot
              </h3>
              <p className="text-sm text-white/90">
                Automate formal, legally-binding dunning letters and payment
                demands for late invoices.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Lock size={12} className="text-[#db2d27]" />
                <span className="text-[#db2d27] text-xs font-bold uppercase tracking-widest">
                  Enterprise Only
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Legal Chat */}
        <AnimatePresence>
          {activeTool === "contract" && (
            <section className="mb-12 max-w-4xl mx-auto" id="contract-analyzer">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#db2d27] border border-[#db2d27]/30 rounded-2xl overflow-hidden shadow-2xl shadow-[#db2d27]/10"
              >
                <div className="flex items-center justify-between bg-gradient-to-r from-[#db2d27]/10 to-[#db2d27]/10 border-b border-[#db2d27]/20 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#db2d27] to-[#451c20] flex items-center justify-center shadow-lg shadow-[#db2d27]/5">
                      <MessageSquare size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-extrabold text-sm tracking-wide">
                        Contract Redliner
                      </h3>
                      <p className="text-white/90 text-[10px] tracking-widest uppercase">
                        Jurisdiction — {country}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-white/50 hover:text-white transition-colors"
                    onClick={() => setActiveTool(null)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-6 space-y-4 scrollbar-hide">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-12">
                      <Scale
                        size={40}
                        className="mx-auto mb-4 text-[#db2d27]/30"
                      />
                      <p className="text-white/90 font-bold text-sm mb-1">
                        Upload an agreement to analyze under{" "}
                        <span className="text-[#db2d27]">{country}</span> law
                      </p>
                      <p className="text-white/80 text-xs text-balance">
                        The AI will highlight hidden liabilities, map out key
                        dates, and cross-reference with local compliance
                        standards.
                      </p>
                    </div>
                  )}

                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-3 ${msg.role === "user" ? "bg-[#db2d27] text-[#2D0A10]" : "bg-[#db2d27]/20 border border-[#db2d27]/20 text-white"}`}
                      >
                        {msg.filePreview && (
                          <img
                            src={msg.filePreview}
                            alt="Upload"
                            className="max-w-[200px] rounded-lg mb-2 border border-[#db2d27]/20"
                          />
                        )}
                        {msg.fileName && !msg.filePreview && (
                          <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2 mb-2 text-xs">
                            <FileText size={14} />
                            <span className="font-bold truncate">
                              {msg.fileName}
                            </span>
                          </div>
                        )}
                        {msg.content && (
                          <div
                            className={`text-sm leading-relaxed whitespace-pre-line ${msg.role === "ai" ? "font-mono text-xs" : "font-bold"}`}
                          >
                            {msg.content.split("\n").map((line, li) => {
                              if (msg.role === "ai") {
                                if (line.startsWith("###"))
                                  return (
                                    <h4
                                      key={li}
                                      className="text-[#db2d27] font-extrabold text-sm mt-3 mb-1 font-sans"
                                    >
                                      {line.replace(/###\s?/g, "")}
                                    </h4>
                                  );
                                if (
                                  line.startsWith("**") &&
                                  line.endsWith("**")
                                )
                                  return (
                                    <p
                                      key={li}
                                      className="text-white font-bold text-xs mt-2"
                                    >
                                      {line.replace(/\*\*/g, "")}
                                    </p>
                                  );
                                if (line.startsWith("- "))
                                  return (
                                    <p
                                      key={li}
                                      className="text-[#db2d27] text-xs ml-2"
                                    >
                                      • {line.slice(2)}
                                    </p>
                                  );
                                if (
                                  line.startsWith("⚠️") ||
                                  line.startsWith("✅") ||
                                  line.startsWith("📄") ||
                                  line.startsWith("⚖️") ||
                                  line.startsWith("📚") ||
                                  line.startsWith("💡") ||
                                  line.startsWith("🔍")
                                )
                                  return (
                                    <p
                                      key={li}
                                      className="text-sm font-sans mt-2"
                                    >
                                      {line}
                                    </p>
                                  );
                                if (line.startsWith(">"))
                                  return (
                                    <p
                                      key={li}
                                      className="text-white/90 text-[10px] italic mt-3 border-l-2 border-[#db2d27]/30 pl-2"
                                    >
                                      {line.slice(2)}
                                    </p>
                                  );
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
                      <div className="bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-2xl px-5 py-3 flex items-center gap-2">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-[#db2d27] rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-[#db2d27] rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-[#db2d27] rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-white/90 text-xs font-bold">
                          Analyzing under {country} law...
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Usage Limit Overlay */}
                {!isPremium && usageCount >= MAX_FREE_QUERIES && (
                  <div className="px-6 py-4 bg-gradient-to-r from-[#db2d27]/10 to-transparent border-t border-[#db2d27]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock size={18} className="text-[#db2d27]" />
                        <div>
                          <p className="text-white font-bold text-sm">
                            Trial queries exhausted
                          </p>
                          <p className="text-white/90 text-[10px]">
                            Contact sales to unlock your enterprise license
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setModalMode("enterprise");
                          setIsModalOpen(true);
                        }}
                        className="bg-[#db2d27] text-[#2D0A10] px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                      >
                        Book Demo
                      </button>
                    </div>
                  </div>
                )}

                {/* File Preview Bar */}
                {chatFile && (
                  <div className="px-6 py-2 bg-[#db2d27]/20 border-t border-[#db2d27]/10 flex items-center gap-3">
                    {chatFilePreview ? (
                      <img
                        src={chatFilePreview}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-[#db2d27]/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#db2d27]/20 flex items-center justify-center">
                        <FileText size={16} className="text-[#db2d27]" />
                      </div>
                    )}
                    <span className="text-white text-xs font-bold truncate flex-1">
                      {chatFile.name}
                    </span>
                    <button
                      onClick={() => {
                        setChatFile(null);
                        setChatFilePreview(null);
                      }}
                      className="text-white/90 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Input Bar */}
                <div className="flex items-center gap-2 p-4 border-t border-[#db2d27]/10">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-xl bg-[#db2d27]/20 hover:bg-[#db2d27]/40 border border-[#db2d27]/20 flex items-center justify-center text-white/90 hover:text-[#db2d27] transition-all"
                    title="Upload Document"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    onClick={() => {
                      const i = fileInputRef.current;
                      if (i) {
                        i.accept = "image/*";
                        i.click();
                        i.accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp";
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-[#db2d27]/20 hover:bg-[#db2d27]/40 border border-[#db2d27]/20 flex items-center justify-center text-white/90 hover:text-[#db2d27] transition-all"
                    title="Upload Photo"
                  >
                    <Image size={18} />
                  </button>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                    placeholder={`Ask the engine to identify liabilities...`}
                    className="flex-1 bg-[#db2d27]/20 border border-[#db2d27]/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#db2d27] transition-colors placeholder:text-white/50"
                    disabled={!isPremium && usageCount >= MAX_FREE_QUERIES}
                  />
                  <button
                    onClick={sendChat}
                    disabled={
                      isChatLoading ||
                      (!isPremium && usageCount >= MAX_FREE_QUERIES)
                    }
                    className="w-10 h-10 rounded-xl bg-[#db2d27] hover:bg-[#c86a43] flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#db2d27]/5"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </motion.div>
            </section>
          )}
        </AnimatePresence>

        {/* Enterprise AI Pricing Grid */}
        <section
          id="pricing"
          className="mt-20 pt-16 border-t border-[#db2d27]/10"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">
              Enterprise <span className="text-[#db2d27]">AI Packages</span>
            </h2>
            <p className="text-white/90 text-sm tracking-wide max-w-lg mx-auto">
              Scale your compliance engine. Dedicated clusters, custom LLM
              fine-tuning, and SLA guarantees for total corporate security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Standard Tier */}
            <div className="bg-[#db2d27] border border-[#db2d27]/20 rounded-[32px] p-8 hover:border-white/30 transition-all flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">
                Professional
              </h3>
              <p className="text-xs text-white/90 mb-6">
                For boutique law firms and mid-sized legal departments.
              </p>
              <div className="text-4xl font-black text-white mb-8 tracking-tighter">
                €1,500
                <span className="text-sm font-bold text-white/90 tracking-normal">
                  {" "}
                  /mo
                </span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-white">
                  <ShieldCheck size={16} className="text-[#db2d27]" /> 500
                  Contract Scans/mo
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <ShieldCheck size={16} className="text-[#db2d27]" /> EU & UK
                  Jurisdictions
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <ShieldCheck size={16} className="text-[#db2d27]" /> Standard
                  Encrypted Sandbox
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-[#db2d27]/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-[#db2d27]/40 transition-colors">
                Select Plan
              </button>
            </div>

            {/* Scale Tier */}
            <div className="bg-gradient-to-b from-[#db2d27]/20 to-[#0f0f12] border border-[#db2d27]/40 rounded-[32px] p-8 hover:border-[#db2d27] transition-all flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-[#db2d27]/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#db2d27] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-b-xl">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2 mt-2">
                Enterprise Scale
              </h3>
              <p className="text-xs text-white/90 mb-6">
                For multinational corporations requiring multi-language legal
                LLMs.
              </p>
              <div className="text-4xl font-black text-white mb-8 tracking-tighter">
                €4,000
                <span className="text-sm font-bold text-white/90 tracking-normal">
                  {" "}
                  /mo
                </span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-white font-bold">
                  <ShieldCheck size={16} className="text-[#db2d27]" /> Unlimited
                  Contract Scans
                </li>
                <li className="flex items-center gap-3 text-sm text-white font-bold">
                  <ShieldCheck size={16} className="text-[#db2d27]" /> Global
                  Jurisdictions (50+ Countries)
                </li>
                <li className="flex items-center gap-3 text-sm text-white font-bold">
                  <ShieldCheck size={16} className="text-[#db2d27]" /> OCR &
                  Multi-language Translation
                </li>
                <li className="flex items-center gap-3 text-sm text-white font-bold">
                  <ShieldCheck size={16} className="text-[#db2d27]" /> Dedicated
                  Account Manager
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-[#db2d27] text-[#2D0A10] font-black uppercase tracking-widest text-xs shadow-lg hover:brightness-110 transition-all">
                Book Trial
              </button>
            </div>

            {/* Custom Tier */}
            <div className="bg-[#db2d27] border border-[#db2d27]/20 rounded-[32px] p-8 hover:border-white/30 transition-all flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">On-Premise</h3>
              <p className="text-xs text-white/90 mb-6">
                For governments, banks, and institutions with strict data
                mandates.
              </p>
              <div className="text-4xl font-black text-white mb-8 tracking-tighter">
                Custom
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-white">
                  <ShieldCheck size={16} className="text-white/40" /> Private
                  Cloud / Bare Metal Deploy
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <ShieldCheck size={16} className="text-white/40" />{" "}
                  Fine-tuning on Private Handbooks
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <ShieldCheck size={16} className="text-white/40" />{" "}
                  Military-grade Compliance (SOC2)
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <ShieldCheck size={16} className="text-white/40" /> 24/7
                  Priority SLA
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-[#db2d27]/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-[#db2d27]/40 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="border-t border-[#db2d27]/10 py-10 px-6 max-w-5xl mx-auto"
      >
        {/* Legal Compliance */}
        <div className="border-t border-[#db2d27]/10 pt-6 mb-6">
          <h4 className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/90 mb-4">
            International Corporate Legal Compliance
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-white/[0.02] border border-[#db2d27]/10 rounded-xl p-3">
              <p className="text-[#db2d27] font-bold text-[10px] uppercase tracking-widest mb-1">
                EU GDPR
              </p>
              <p className="text-white/80 text-[9px]">
                General Data Protection Regulation 2016/679
              </p>
            </div>
            <div className="bg-white/[0.02] border border-[#db2d27]/10 rounded-xl p-3">
              <p className="text-[#db2d27] font-bold text-[10px] uppercase tracking-widest mb-1">
                PSD2 / SCA
              </p>
              <p className="text-white/80 text-[9px]">
                Strong Customer Authentication for EU Payments
              </p>
            </div>
            <div className="bg-white/[0.02] border border-[#db2d27]/10 rounded-xl p-3">
              <p className="text-[#db2d27] font-bold text-[10px] uppercase tracking-widest mb-1">
                EU Consumer Rights
              </p>
              <p className="text-white/80 text-[9px]">
                Directive 2011/83 — 14-Day Withdrawal Right
              </p>
            </div>
            <div className="bg-white/[0.02] border border-[#db2d27]/10 rounded-xl p-3">
              <p className="text-[#db2d27] font-bold text-[10px] uppercase tracking-widest mb-1">
                DSA / DMA
              </p>
              <p className="text-white/80 text-[9px]">
                Digital Services Act & Digital Markets Act
              </p>
            </div>
            <div className="bg-white/[0.02] border border-[#db2d27]/10 rounded-xl p-3">
              <p className="text-[#db2d27] font-bold text-[10px] uppercase tracking-widest mb-1">
                ePrivacy
              </p>
              <p className="text-white/80 text-[9px]">
                Cookie Consent & Electronic Communications
              </p>
            </div>
            <div className="bg-white/[0.02] border border-[#db2d27]/10 rounded-xl p-3">
              <p className="text-[#db2d27] font-bold text-[10px] uppercase tracking-widest mb-1">
                AML / KYC
              </p>
              <p className="text-white/80 text-[9px]">
                Anti-Money Laundering Directive 6 (AMLD6)
              </p>
            </div>
            <div className="bg-white/[0.02] border border-[#db2d27]/10 rounded-xl p-3">
              <p className="text-[#db2d27] font-bold text-[10px] uppercase tracking-widest mb-1">
                EU VAT
              </p>
              <p className="text-white/80 text-[9px]">
                One Stop Shop (OSS) Cross-Border VAT
              </p>
            </div>
            <div className="bg-white/[0.02] border border-[#db2d27]/10 rounded-xl p-3">
              <p className="text-[#db2d27] font-bold text-[10px] uppercase tracking-widest mb-1">
                KVKK (TR)
              </p>
              <p className="text-white/80 text-[9px]">
                Kişisel Verilerin Korunması Kanunu No. 6698
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest mb-3">
          <button
            onClick={() => {
              setModalMode("privacy");
              setIsModalOpen(true);
            }}
            className="text-white/90 hover:text-white transition-all"
          >
            Privacy
          </button>
          <button
            onClick={() => {
              setModalMode("terms");
              setIsModalOpen(true);
            }}
            className="text-white/90 hover:text-white transition-all"
          >
            Terms
          </button>
          <button
            onClick={() => {
              setModalMode("cookie");
              setIsModalOpen(true);
            }}
            className="text-white/90 hover:text-white transition-all"
          >
            Cookies
          </button>
        </div>
        <div className="text-white/50 text-[10px] text-center">
          © 2026 Republia. All rights reserved. Legal Intelligence Platform.
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => {
                setModalMode("corporate");
                setIsModalOpen(true);
              }}
              className="text-white/40 hover:text-white transition-all uppercase tracking-[0.2em] font-bold border border-[#db2d27]/20 px-3 py-1.5 rounded shadow-sm bg-black/20"
            >
              A NISDE LTD Company
            </button>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
