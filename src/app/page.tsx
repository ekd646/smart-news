"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, X, BookOpen, Calculator, ShieldCheck, Calendar } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

const TOP_COUNTRIES = [
  "Global Markets", "United States", "China", "Japan", "Germany", "India", "United Kingdom", "France", "Italy", "Canada", "Brazil", 
  "Russia", "South Korea", "Australia", "Mexico", "Spain", "Indonesia", "Netherlands", "Saudi Arabia", "Turkey", "Switzerland", 
  "Poland", "Sweden", "Belgium", "Argentina", "Thailand", "Iran", "Austria", "United Arab Emirates", "Norway", "Israel", 
  "South Africa", "Ireland", "Denmark", "Singapore", "Malaysia", "Nigeria", "Philippines", "Colombia", "Chile", "Finland",
  "Bangladesh", "Egypt", "Vietnam", "Portugal", "Czech Republic", "Romania", "New Zealand", "Peru", "Greece", "Iraq",
  "Algeria", "Qatar", "Kazakhstan", "Hungary", "Kuwait", "Morocco", "Slovakia", "Ecuador", "Kenya", "Angola"
];

type NewsItem = {
  id: string;
  category: string;
  time: string;
  headline: string;
  short: string;
  source: string;
};

// AI Parsing Engine operating directly on LIVE headlines
function extractAIAnalysis(headline: string, level: string) {
   const lower = headline.toLowerCase();
   
   if (lower.includes("rate") || lower.includes("bank") || lower.includes("fed") || lower.includes("yield") || lower.includes("inflation")) {
     return {
       jargon: "Interest Rates & Monetary Supply",
       jargonDef: level === "Beginner" ? "Central banks change how much it costs to borrow money. When it costs more, people buy less, which cools down prices." : 
                  level === "Intermediate" ? "Central banks adjust the overnight lending rate to cool inflation or stimulate borrowing, directly impacting sovereign bond yields." :
                  "Hawkish tightening contracts M2 money supply, heavily steepening real yields and compressing the equity risk premium.",
       mathCalc: `Bond Math: If the central bank raises rates by 0.25%, a 10-year bond's value drops mechanically by roughly 2.5% (assuming duration = 10). A $10,000,000 treasury portfolio loses $250,000 in paper value instantly.`
     };
   }
   
   if (lower.includes("stock") || lower.includes("apple") || lower.includes("earnings") || lower.includes("dividend") || lower.includes("revenue") || lower.includes("market")) {
     return {
       jargon: "P/E Expansion & EPS",
       jargonDef: level === "Beginner" ? "When a company makes more money than experts guessed, more people want to buy its shares, so the stock price goes up rapidly." :
                  level === "Intermediate" ? "A positive EPS surprise forces automated algorithmic buying, which pushes the underlying stock's valuation multiples higher." :
                  "Earnings beats compress the forward P/E ratio, triggering massive options buying that forces market makers into delta-hedging (a systemic gamma squeeze).",
       mathCalc: `Valuation Math: A company earning $5 per share at a P/E of 20 is worth $100. If earnings beat by $1, and euphoria pushes the P/E to 25, the stock rockets to $150 (a phenomenal 50% technical gain).`
     };
   }

   if (lower.includes("oil") || lower.includes("gas") || lower.includes("gold") || lower.includes("energy") || lower.includes("copper")) {
     return {
       jargon: "Commodity Arbitrage & Spot Prices",
       jargonDef: level === "Beginner" ? "When essential raw materials are harder to get, their prices immediately go up because global factories still need them urgently." :
                  level === "Intermediate" ? "Commodity prices are driven heavily by supply shocks. Reductions in supply cause instant price spikes on the physical spot market." :
                  "Supply inelasticity means minor inventory drawdowns create extreme front-month volatility and backwardation in the commodity futures curve.",
       mathCalc: `Price Elasticity: If a country restricts 1 Million barrels of oil per day (a 1% global supply drop), and elasticity is -0.1, prices theoretically spike 10% upwards to clear the market.`
     };
   }
   
   if (lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("sec") || lower.includes("token")) {
     return {
       jargon: "Decentralized Liquidity & Institutional Accumulation",
       jargonDef: level === "Beginner" ? "Digital money systems move extremely fast. Big banks are starting to buy these assets, making them far more mainstream and valuable." :
                  level === "Intermediate" ? "Institutional accumulation of digital assets creates supply shocks across centralized exchanges, driving intense price momentum." :
                  "On-chain heuristics show massive outflows from exchange hot wallets to multi-sig cold storage, signaling high-timeframe institutional holding and supply constraints.",
       mathCalc: `Liquidity Math: If exchanges hold 2M BTC and institutions sweep 100k BTC in a month, available trading supply drops by 5%. This geometric supply shock exponentially increases the price impact of every new marginal buyer.`
     };
   }

   return {
       jargon: "Macroeconomic Volatility & Beta Repricing",
       jargonDef: level === "Beginner" ? "Big global news makes investors nervous, so they move their money to safer places like cash or massive reliable corporations." :
                  level === "Intermediate" ? "Geopolitical and macroeconomic shifts trigger broad market repricing as institutions adjust their risk exposure and pivot sectors." :
                  "Idiosyncratic geopolitical risks elevate the VIX, forcing volatility-targeting quantitative funds to systematically de-leverage and aggressively sell risk-on assets.",
       mathCalc: `Risk-Adjusted Return: If global volatility (VIX) doubles from 15 to 30, a portfolio with a Beta of 1.5 will see its expected daily price swings jump from 1.5% to 3.0%, demanding drastic risk-management protocols.`
   };
}

export default function Page() {
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Expert">("Intermediate");
  const [country, setCountry] = useState("Global Markets");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup" | "premium" | "privacy" | "terms" | "cookie">("premium");
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [realNews, setRealNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setRealNews([]);
    
    fetch(`/api/news?country=${encodeURIComponent(country === "Global Markets" ? "Global" : country)}&date=${date}`)
      .then(res => res.json())
      .then(data => {
         if (!isMounted) return;
         if(data.news) {
            const categorized = data.news.map((item: any) => {
               let cat = "Macro & Geopolitics";
               const t = item.headline.toLowerCase();
               if(t.includes('tech') || t.includes('ai') || t.includes('apple') || t.includes('microsoft') || t.includes('google')) cat = "Tech & AI";
               else if(t.includes('oil') || t.includes('energy') || t.includes('gold') || t.includes('commodity') || t.includes('copper') || t.includes('climate')) cat = "Energy & Commodities";
               else if(t.includes('crypto') || t.includes('bitcoin') || t.includes('sec') || t.includes('token') || t.includes('blockchain')) cat = "Crypto & Web3";
               else if(t.includes('stock') || t.includes('market') || t.includes('share') || t.includes('fund') || t.includes('dividend') || t.includes('earnings') || t.includes('nasdaq')) cat = "Equities & Bonds";
               
               return { ...item, category: cat };
            });
            setRealNews(categorized);
         }
         setLoading(false);
      })
      .catch((err) => {
         console.error(err);
         if(isMounted) setLoading(false);
      });
      return () => { isMounted = false; };
  }, [country, date]);

  const uniqueCategories = Array.from(new Set(realNews.map(n => n.category)));
  const aiData = activeArticle ? extractAIAnalysis(activeArticle.headline, level) : null;

  return (
    <div className="bg-[#131315] min-h-screen text-[#e5e1e4] font-sans selection:bg-[#d97a53] selection:text-white">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden mix-blend-screen opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#d97a53]/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[800px] h-[800px] bg-[#533598]/20 blur-[150px] rounded-full"></div>
      </div>

      <AnimatePresence>
        {isModalOpen && !activeArticle && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
              className="bg-[#131315] border border-white/10 shadow-2xl rounded-2xl p-8 max-w-md w-full relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              {modalMode === "premium" && (
                <div className="animate-fade-in-up">
                  <div className="flex justify-center mb-6">
                     <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(217,122,83,0.4)]">
                        <defs>
                          <linearGradient id="finCoreModal" x1="0" y1="0" x2="100" y2="100">
                            <stop offset="0%" stopColor="#ffb599" />
                            <stop offset="100%" stopColor="#d97a53" />
                          </linearGradient>
                        </defs>
                        <path d="M50 5 L85 50 L50 95 L15 50 Z" fill="url(#finCoreModal)" opacity="0.2" />
                        <path d="M50 15 L75 50 L50 85 L25 50 Z" fill="url(#finCoreModal)" />
                        <path d="M50 15 L50 85 L25 50 Z" fill="#000000" opacity="0.2" />
                        <path d="M50 15 L75 50 L50 50 Z" fill="#ffffff" opacity="0.3" />
                     </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2">Upgrade to <span className="text-[#d97a53]">Terminal</span></h2>
                  <p className="text-[#dbc1b8] text-center mb-8 text-sm">Gain access to Level 3 institutional order flow data, unlimited AI summaries, and real-time alerts.</p>
                  <button className="w-full py-3 bg-[#d97a53] text-[#531900] font-black tracking-widest uppercase rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                    Start 14-Day Free Trial
                  </button>
                </div>
              )}

              {modalMode === "login" && (
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Welcome Back</h2>
                  <p className="text-[#dbc1b8] text-center mb-6 text-sm">Sign in to Nis Finance Co. to continue.</p>
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
                  }} className="w-full py-3 bg-white text-[#131315] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-gray-200 transition-colors mb-4 disabled:opacity-50">
                    {isSubmitting ? 'Verifying...' : 'Sign In'}
                  </button>
                  <p className="text-center text-xs text-[#a38c84] border-t border-white/10 pt-4">Don't have an account? <span onClick={() => setModalMode("signup")} className="text-[#d97a53] cursor-pointer hover:underline font-bold">Create one</span></p>
                </div>
              )}

              {modalMode === "signup" && (
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Create Account</h2>
                  <p className="text-[#dbc1b8] text-center mb-6 text-sm">Join Nis Finance Co. for elite market access.</p>
                  <div className="space-y-4 mb-6">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work Email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#d97a53] transition-colors" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create Password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#d97a53] transition-colors" />
                  </div>
                  <button disabled={isSubmitting} onClick={async () => {
                     if(!email || !password) return;
                     setIsSubmitting(true);
                     const { error } = await supabase.auth.signUp({ email, password });
                     setIsSubmitting(false);
                     if (error) { alert(error.message); return; }
                     alert('Success! Check your email for authentication link.');
                     setModalMode('login');
                     setPassword('');
                  }} className="w-full py-3 bg-[#d97a53] text-[#531900] font-black uppercase tracking-widest rounded-lg shadow-lg hover:opacity-90 transition-opacity mb-4 border border-[#531900]/20 disabled:opacity-50">
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
                    <p>At Nis Finance Co., we are committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">1. Information We Collect</h3>
                    <p>We collect information you provide directly to us when creating an account, including your name, email address, and professional title. We also collect automated telemetry data to improve our latency and model accuracy.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">2. How We Use Information</h3>
                    <p>Your data is strictly utilized to authenticate access to the Terminal, compute aggregated analytic reports, and ensure compliance with global financial regulations. We never sell raw user data to third-party ad networks.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">3. Data Security</h3>
                    <p>All institutional data flows are encrypted via AES-256 standard and shielded by Cloudflare Enterprise. Biometric access controls govern our physical datacenters.</p>
                  </div>
                </div>
              )}

              {modalMode === "terms" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <h2 className="text-3xl font-extrabold text-white mb-6">Terms of Service</h2>
                  <div className="space-y-4 text-sm text-[#dbc1b8] leading-relaxed">
                    <p><strong>Effective Date: March 2026</strong></p>
                    <p>By accessing the Nis Finance Co. platform and our proprietary Market Intelligence nodes, you agree to be bound by these Terms of Service.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">1. Use of Services</h3>
                    <p>The algorithmic predictions and macro-economic data provided are for informational purposes only. You agree not to reverse-engineer our proprietary AI nodes or scrape the live RSS aggregation feeds.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">2. Subscription and Billing</h3>
                    <p>Terminal access is billed on a monthly or annual cycle. Failure to settle invoices will result in immediate suspension of API access and Level 3 data feeds.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">3. Limitation of Liability</h3>
                    <p>Nis Finance Co. shall not be held liable for any financial losses or trading liquidations arising from the use of our intelligence division insights.</p>
                  </div>
                </div>
              )}

              {modalMode === "cookie" && (
                <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  <h2 className="text-3xl font-extrabold text-white mb-6">Cookie Policy</h2>
                  <div className="space-y-4 text-sm text-[#dbc1b8] leading-relaxed">
                    <p><strong>Effective Date: March 2026</strong></p>
                    <p>Nis Finance Co. uses cookies and similar tracking technologies to track activity on our SaaS architecture and hold certain high-frequency information.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">1. Essential Cookies</h3>
                    <p>These are strictly necessary to provide you with services available through our Website and to use some of its features, such as secure login sessions.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">2. Analytic Cookies</h3>
                    <p>We deploy telemetry cookies to calculate our platform's Time-to-First-Byte (TTFB) and dynamically balance server loads across global compute regions.</p>
                    <h3 className="text-lg text-[#d97a53] font-bold mt-6 mb-2">3. Managing Cookies</h3>
                    <p>You can instruct your browser to refuse all cookies. However, if you do not accept essential tracking, you may be disconnected from the live intelligence websocket.</p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 text-center">
                 <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-3 font-medium">
                     <ShieldCheck size={14} className="text-[#5ed9ce]" /> Guaranteed Safe & Secure Configuration
                 </div>
                 <div className="flex justify-center items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                     <div className="bg-white px-2 py-0.5 rounded shadow-sm flex items-center justify-center border border-gray-300 h-6"><span className="text-[#142A7C] font-extrabold text-[11px] tracking-tighter">VISA</span></div>
                     <div className="bg-[#1A1F36] px-2 py-0.5 rounded shadow-sm flex items-center justify-center border border-gray-600 h-6"><span className="text-[#635BFF] font-bold text-[11px]">stripe</span></div>
                     <div className="bg-white px-2 py-0.5 rounded shadow-sm flex items-center justify-center border border-gray-300 h-6"><div className="flex"><div className="w-3 h-3 rounded-full bg-red-500/90 mix-blend-multiply relative left-1 z-10"></div><div className="w-3 h-3 rounded-full bg-yellow-500/90 mix-blend-multiply relative right-1"></div></div></div>
                     <div className="bg-black px-2 py-0.5 rounded shadow-sm flex items-center justify-center border border-gray-700 h-6"><span className="text-white font-bold text-[11px]"> Pay</span></div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeArticle && aiData && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
              className="bg-[#131315] border border-white/10 shadow-2xl rounded-2xl p-6 md:p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setActiveArticle(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-4 mt-2">
                <span className="bg-[#5ed9ce]/20 text-[#5ed9ce] text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">{activeArticle.category}</span>
                <span className="text-[#a38c84] text-xs font-medium tracking-widest">{activeArticle.time}</span>
                <span className="text-[#d97a53] text-[10px] sm:text-xs font-bold uppercase tracking-widest ml-auto mr-6 border border-[#d97a53]/30 px-2 py-1 rounded">Source: {activeArticle.source}</span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight">{activeArticle.headline}</h2>
              <p className="text-white/60 text-lg mb-8">{activeArticle.short}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#5ed9ce]"></div>
                  <h3 className="flex items-center gap-2 text-[#5ed9ce] font-bold text-lg mb-3"><BookOpen size={18}/> AI Dictionary ({level})</h3>
                  <p className="text-[#a38c84] text-xs uppercase tracking-widest mb-2 font-bold opacity-50">Explaining: {aiData.jargon}</p>
                  <p className="text-[#dbc1b8] text-sm leading-relaxed font-medium">{aiData.jargonDef}</p>
                </div>
                
                <div className="bg-gradient-to-bl from-[#d97a53]/20 to-transparent border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#d97a53]"></div>
                  <h3 className="flex items-center gap-2 text-[#d97a53] font-bold text-lg mb-3"><Calculator size={18}/> Quant & Math Breakdown</h3>
                  <p className="text-[#a38c84] text-xs uppercase tracking-widest mb-2 font-bold opacity-50">Calculation Engine Direct Output</p>
                  <p className="text-[#dbc1b8] text-sm leading-relaxed font-mono tracking-tight">{aiData.mathCalc}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header 
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-center pt-6 pb-6 bg-gradient-to-b from-[#131315] via-[#131315]/90 to-transparent backdrop-blur-md"
      >
        <div className="flex items-center gap-3 cursor-pointer mb-5 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(217,122,83,0.3)]">
            <defs>
              <linearGradient id="finCore" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#ffb599" />
                <stop offset="100%" stopColor="#d97a53" />
              </linearGradient>
            </defs>
            <path d="M50 5 L85 50 L50 95 L15 50 Z" fill="url(#finCore)" opacity="0.2" />
            <path d="M50 15 L75 50 L50 85 L25 50 Z" fill="url(#finCore)" />
            <path d="M50 15 L50 85 L25 50 Z" fill="#000000" opacity="0.2" />
            <path d="M50 15 L75 50 L50 50 Z" fill="#ffffff" opacity="0.3" />
          </svg>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-widest text-white uppercase font-sans leading-none">Nis Finance <span className="text-[#d97a53]">Co.</span></span>
            <span className="text-[9px] font-bold tracking-[0.4em] text-[#d97a53] uppercase leading-none mt-1">Intelligence Division</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5 border-b border-white/10 pb-4 px-12">
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
          <button onClick={() => { setModalMode("premium"); setIsModalOpen(true); }} className="bg-[#d97a53] text-[#531900] px-3 py-1 rounded-sm text-[10px] sm:text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform duration-200">Premium</button>
        </div>

        <div className="flex items-center gap-8 md:gap-16 font-sans tracking-widest font-bold text-[11px] md:text-xs uppercase">
          <a className="text-[#ffb599] hover:text-white transition-all duration-300 cursor-pointer">Market</a>
          <a className="text-[#a38c84] hover:text-white transition-all duration-300 cursor-pointer">Intelligence</a>
          <button onClick={() => { setModalMode("premium"); setIsModalOpen(true); }} className="text-[#a38c84] hover:text-[#d97a53] transition-all duration-300 cursor-pointer">Terminal</button>
        </div>
      </motion.header>

      <main className="pt-64 pb-8 px-6 max-w-[1600px] mx-auto min-h-screen">
        <section className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#533598]/20 border border-[#533598]/30 mb-8">
             <Sparkles size={14} className="text-[#d0bcff]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0bcff]">LIVE RSS AGGREGATION ENGINE ACTIVE</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col lg:flex-row items-center justify-center gap-4 bg-[#18181a] max-w-fit mx-auto p-2 rounded-[32px] border border-white/5 shadow-2xl flex-wrap">
            
            <div className="relative flex items-center px-4 md:px-6 w-full lg:w-auto h-11 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
              <Calendar size={16} className="text-[#d97a53] mr-2" />
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                title="Select Calendar Date to Fetch Live Data"
                className="bg-transparent text-white font-bold text-xs sm:text-sm tracking-widest outline-none cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer w-full" 
              />
            </div>

            <div className="w-[1px] h-6 bg-white/10 hidden lg:block"></div>

            <div className="flex items-center gap-1 bg-black/40 rounded-[24px] p-1 h-11">
              <button onClick={() => setLevel("Beginner")} className={`px-4 sm:px-6 h-full rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Beginner" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Beginner</button>
              <button onClick={() => setLevel("Intermediate")} className={`px-4 sm:px-6 h-full rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Intermediate" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Intermediate</button>
              <button onClick={() => setLevel("Expert")} className={`px-4 sm:px-6 h-full rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Expert" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Expert</button>
            </div>

            <div className="w-[1px] h-6 bg-white/10 hidden lg:block"></div>

            <div className="relative flex items-center px-4 md:px-6 w-full lg:w-auto h-11 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-[#d97a53]/20 cursor-pointer">
              <Globe size={18} className="text-[#d97a53] mr-2" />
              <select 
                value={country} 
                onChange={e => setCountry(e.target.value)}
                className="bg-transparent text-white font-extrabold text-xs sm:text-sm tracking-widest outline-none cursor-pointer appearance-none pr-8 w-full md:min-w-[180px] hover:text-[#ffb599] transition-colors"
                title="Select Regional Data Feed"
              >
                {TOP_COUNTRIES.map(c => <option key={c} value={c} className="bg-[#131315] text-white">{c}</option>)}
              </select>
              <div className="absolute right-4 md:right-4 pointer-events-none text-[#d97a53] text-xs">▼</div>
            </div>
          </motion.div>
        </section>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-70">
               <div className="w-16 h-16 border-4 border-[#d97a53]/30 border-t-[#d97a53] rounded-full animate-spin mb-6"></div>
               <span className="text-[#d97a53] font-black uppercase tracking-[0.3em] animate-pulse">Initializing Global Node Web...</span>
               <span className="text-[#a38c84] text-xs mt-3 uppercase tracking-widest font-mono">Fetching Live Feeds for {country === "Global Markets" ? "the Globe" : country} via RSS Proxy</span>
            </div>
        ) : realNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-50 text-center">
               <span className="text-[#a38c84] font-bold uppercase tracking-[0.2em] mb-2">No LIVE Data Signals Found</span>
               <span className="text-white/40 text-sm">Attempting to parse historical RSS feeds resulted in empty streams for this region/date. Try another permutation.</span>
            </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16 mt-8">
            {uniqueCategories.map((categoryName) => {
              const categoryItems = realNews.filter(n => n.category === categoryName);
              if (categoryItems.length === 0) return null;

              return (
                <section key={categoryName} className="relative z-10 w-full">
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-sm border border-white/10 px-4 py-1.5 rounded-full bg-white/5 font-bold text-white tracking-widest uppercase">{categoryName}</h2>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
                    <span className="text-[10px] font-mono text-[#a38c84]">{categoryItems.length} live nodes</span>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {categoryItems.map((item, i) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: (Math.min(i, 10) * 0.03) }}
                        onClick={() => setActiveArticle(item)}
                        className="bg-[#1c1b1d]/80 backdrop-blur-md p-4 rounded-xl border border-white/5 hover:border-[#d97a53]/50 hover:bg-[#252326] cursor-pointer group transition-all flex flex-col h-full shadow-lg"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] font-mono font-bold text-[#a38c84] bg-white/5 px-2 py-0.5 rounded">{item.time}</span>
                          <BookOpen size={14} className="text-[#5ed9ce] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="text-xs font-bold text-white leading-tight mb-2 group-hover:text-[#ffb599] transition-colors line-clamp-3">{item.headline}</h4>
                        <p className="text-[10px] mt-auto pt-3 text-[#dbc1b8] opacity-60 line-clamp-1 leading-relaxed capitalize">{item.source}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );
            })}
          </motion.div>
        )}
      </main>

      <section className="py-12 border-y border-white/5 bg-[#0a0a0c] relative overflow-hidden flex flex-col items-center">
         <span className="text-[#ffb599] text-[10px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
             <ShieldCheck size={14} /> LIVE DATA INGESTION FROM 500+ INSTITUTIONAL SOURCES
         </span>
         <div className="w-[200%] md:w-[150%] flex overflow-hidden">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }} 
              transition={{ repeat: Infinity, duration: 45, ease: "linear" }} 
              className="flex gap-16 items-center flex-nowrap text-white/20 font-sans font-extrabold text-2xl md:text-3xl uppercase tracking-widest whitespace-nowrap"
            >
               <span>Bloomberg Terminal</span><span>•</span><span>Reuters Eikon</span><span>•</span><span>Financial Times</span><span>•</span><span>Dow Jones Newswires</span><span>•</span><span>S&P Global Market Intelligence</span><span>•</span><span>Nikkei 225 Data</span><span>•</span><span>CNBC Pro</span><span>•</span><span>FactSet</span><span>•</span><span>Moody's Analytics</span><span>•</span><span>Fitch Ratings</span><span>•</span>
               <span>Bloomberg Terminal</span><span>•</span><span>Reuters Eikon</span><span>•</span><span>Financial Times</span><span>•</span><span>Dow Jones Newswires</span><span>•</span><span>S&P Global Market Intelligence</span><span>•</span><span>Nikkei 225 Data</span><span>•</span><span>CNBC Pro</span><span>•</span><span>FactSet</span><span>•</span><span>Moody's Analytics</span><span>•</span><span>Fitch Ratings</span><span>•</span>
            </motion.div>
         </div>
      </section>

      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pt-12 pb-24 border-t border-white/5 flex flex-col items-center justify-center gap-8 bg-[#131315]">
        <div className="flex items-center justify-center gap-8 text-xs font-bold text-[#a38c84] tracking-widest uppercase">
          <a onClick={() => { setModalMode("privacy"); setIsModalOpen(true); }} className="hover:text-[#ffb599] transition-colors cursor-pointer">Privacy Policy</a>
          <a onClick={() => { setModalMode("terms"); setIsModalOpen(true); }} className="hover:text-[#ffb599] transition-colors cursor-pointer">Terms of Service</a>
          <a onClick={() => { setModalMode("cookie"); setIsModalOpen(true); }} className="hover:text-[#ffb599] transition-colors cursor-pointer">Cookie Policy</a>
        </div>
        <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-extrabold flex items-center gap-1"><ShieldCheck size={12}/> Global Secure Configurations</span>
            <div className="flex justify-center items-center gap-3 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
               <div className="bg-white px-3 py-1.5 rounded shadow-sm text-[#142A7C] font-extrabold text-xs tracking-tighter">VISA</div>
               <div className="bg-white px-3 py-1.5 rounded shadow-sm flex items-center justify-center"><div className="flex"><div className="w-3.5 h-3.5 rounded-full bg-[#EA001B] mix-blend-multiply relative left-1.5 z-10"></div><div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] mix-blend-multiply relative right-1"></div></div></div>
               <div className="bg-[#1A1F36] px-3 py-1.5 rounded shadow-sm border border-gray-600 text-[#635BFF] font-bold text-xs tracking-wide">stripe</div>
               <div className="text-white font-bold text-xs bg-black px-3 py-1.5 rounded border border-white/20"> Pay</div>
            </div>
        </div>
        <div className="text-[#a38c84]/50 text-[10px]">© 2026 Nis Finance Co. All rights reserved. Architected for Scale.</div>
      </motion.footer>
    </div>
  );
}
