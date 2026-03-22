"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, ArrowRight, Bookmark, Zap, User, Bell, Home, X, ShieldCheck } from "lucide-react";

const TOP_COUNTRIES = [
  "Global Markets", "United States", "China", "Japan", "Germany", "India", "United Kingdom", "France", "Italy", "Canada", "Brazil", 
  "Russia", "South Korea", "Australia", "Mexico", "Spain", "Indonesia", "Netherlands", "Saudi Arabia", "Turkey", "Switzerland", 
  "Poland", "Sweden", "Belgium", "Argentina", "Thailand", "Iran", "Austria", "United Arab Emirates", "Norway", "Israel", 
  "South Africa", "Ireland", "Denmark", "Singapore", "Malaysia", "Nigeria", "Philippines", "Colombia", "Chile", "Finland",
  "Bangladesh", "Egypt", "Vietnam", "Portugal", "Czech Republic", "Romania", "New Zealand", "Peru", "Greece", "Iraq",
  "Algeria", "Qatar", "Kazakhstan", "Hungary", "Kuwait", "Morocco", "Slovakia", "Ecuador", "Kenya", "Angola"
];

export default function Page() {
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Expert">("Intermediate");
  const [country, setCountry] = useState("Global Markets");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic news mapper interpolating the chosen Country parameter
  const newsFeed = {
    Beginner: {
      main: {
        category: "Central Banks",
        time: "4m ago",
        headline: `${country === "Global Markets" ? "World Banks" : country + " Central Bank"}: Why Borrowing Money is About to Get More Expensive`,
        body: `The central bank of ${country} just signaled it might raise interest rates. This acts like a brake pedal for the economy. When rates go up, loans get pricier, people spend less, and inflation cools down. However, localized stock prices usually drop temporarily as investors secure their money in safe bank yields instead.`,
        readTime: "2 min read • AI Summary"
      },
      side: {
        category: "Crypto",
        headline: "Bitcoin Prices Shake as Traders Panic Sell",
        body: `A sudden wave of selling occurred on major platforms within ${country}'s timezone. Our AI detected that a few large accounts started selling rapidly, causing a domino effect of fear.`,
      },
      bottom1: {
        category: "Tech Sector",
        headline: "Computer Chip Shortage Fears Return",
        body: `Shipping routes near Taiwan are facing delays. Since this is where most computer chips are made, factories in ${country} and worldwide might struggle to get the parts they need.`
      },
      bottom2: {
        category: "Energy",
        headline: "Gas Prices Might Jump After Pipeline Fix",
        body: `A sudden pause to fix a major gas pipeline has traders betting that heating and electricity costs in ${country} could spike temporarily due to lower supply.`
      },
      bottom3: {
        category: "Big Tech",
        headline: "Secret Buyer Snapping Up Tech Stocks",
        body: `Some very wealthy investors or corporate funds tracking the ${country} index have been quietly buying millions of dollars worth of tech shares over the last 2 hours.`
      }
    },
    Intermediate: {
      main: {
        category: "Macro Strategy",
        time: "4m ago",
        headline: `${country} Yield Curve Inversion: Next Move Predicted by LLM Clusters`,
        body: `Proprietary analysis indicates a 78% probability of a policy pivot within Q3 for ${country}'s economic zone. AI sentiment across 4,000 central bank documents suggests a cooling hawkishness not yet priced into swap markets or local benchmark rates.`,
        readTime: "8 min read • Technical Analysis"
      },
      side: {
        category: "Crypto",
        headline: "Liquidity Crunch in Altcoin Derivatives",
        body: `AI detected anomalous wallet flows originating from ${country} suggesting a massive deleveraging event on decentralized exchanges.`,
      },
      bottom1: {
        category: "Tech Sector",
        headline: "Semiconductor Supply Chain Resiliency Index Drops",
        body: `Neural networks mapping global shipping routes flag a potential bottleneck affecting ${country}'s primary tech manufacturing hubs.`
      },
      bottom2: {
        category: "Energy",
        headline: "Energy Markets React to Sudden Pipeline Maintenance",
        body: `Natural gas futures showing 12% volatility spike in immediate aftermath of algorithmic news scraping concerning ${country}'s energy reserves.`
      },
      bottom3: {
        category: "Institutional Flow",
        headline: "Dark Pool Activity Spikes in Big Tech",
        body: `Unusual institutional accumulation patterns identified by pattern-recognition models in the last 2 hours crossing ${country} trading desks.`
      }
    },
    Expert: {
      main: {
        category: "Macro Quantitative",
        time: "4m ago",
        headline: `${country} OIS-SOFR Spreads Widen as Terminal Rate Re-pricing Begins`,
        body: `Delta-hedging activity along the curve validates our NLP parsing algorithms indicating a 25bps structural shift in policy projections for ${country}. Volatility surface steepening confirms institutional capitulation on the 'higher-for-longer' narrative within the regional index.`,
        readTime: "12 min read • Institutional Data"
      },
      side: {
        category: "Crypto Liquidity",
        headline: "Perpetual Futures OI Implosion Spreads to CeFi",
        body: `On-chain heuristics detect a cascade of liquidations totaling $400M from nodes in ${country}, triggering an arbitrage disconnect.`,
      },
      bottom1: {
        category: "Semiconductors",
        headline: "Index Volatility Signals TSMC Sub-Tier Constraints",
        body: `AI logistics overlay models calculate a 3.4 standard deviation divergence in precursor material lead times directly impacting ${country}.`
      },
      bottom2: {
        category: "Commodities",
        headline: "Henry Hub Futures Exhibit Algorithmic Squeeze",
        body: `Maintenance alerts parsed by our engines triggered high-frequency volume spikes, breaking consecutive technical resistance lines affecting ${country}'s energy import parity.`
      },
      bottom3: {
        category: "Dark Pools",
        headline: "Volume-Weighted Block Trades Indicate Buy-Side Absorption",
        body: `VWAP deviations in regional benchmark constituents exceed 90th percentile thresholds, suggesting stealth institutional inflows into ${country} equities ahead of options expiration.`
      }
    }
  };

  const activeContent = newsFeed[level];

  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orb-peach"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[800px] h-[800px] bg-orb-violet"></div>
      </div>

      {/* Subscription Pricing Modal with Payment Methods */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
              className="bg-[#131315] border border-white/10 shadow-2xl rounded-2xl p-8 max-w-lg w-full relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <div className="flex justify-center mb-6">
                 <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-md rounded-[10px]">
                  <rect width="40" height="40" rx="10" fill="#1b1b1b" />
                  <path d="M12 28V12L28 28V12" stroke="#d97a53" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="28" cy="12" r="3" fill="#d97a53" />
                </svg>
              </div>

              <h2 className="text-3xl font-extrabold text-white text-center mb-2">Upgrade to <span className="text-[#d97a53]">Terminal</span></h2>
              <p className="text-[#dbc1b8] text-center mb-8 text-sm">Gain access to Level 3 institutional order flow data, unlimited AI summaries, and real-time alerts.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Sparkles size={16} className="text-[#d97a53]" /> <span>Unlimited AI Contextualization</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Zap size={16} className="text-[#d97a53]" /> <span>Sub-second Market Pulse Execution</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Bookmark size={16} className="text-[#d97a53]" /> <span>Advanced Institutional Tracking Features</span>
                </div>
              </div>

              <button className="w-full py-3 bg-[#d97a53] text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                Start 14-Day Free Trial
              </button>
              
              <div className="mt-6 border-t border-white/10 pt-4 text-center">
                 <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-3 font-medium">
                     <ShieldCheck size={14} className="text-[#5ed9ce]" /> Guaranteed Safe & Secure Checkout
                 </div>
                 <div className="flex justify-center items-center gap-2">
                     <div className="bg-white px-2 py-0.5 rounded shadow-sm flex items-center justify-center border border-gray-300 h-6">
                         <span className="text-[#142A7C] font-extrabold text-[11px] tracking-tighter">VISA</span>
                     </div>
                     <div className="bg-[#1A1F36] px-2 py-0.5 rounded shadow-sm flex items-center justify-center border border-gray-600 h-6">
                         <span className="text-[#635BFF] font-bold text-[11px]">stripe</span>
                     </div>
                     <div className="bg-white px-2 py-0.5 rounded shadow-sm flex items-center justify-center border border-gray-300 h-6">
                         <div className="flex"><div className="w-3 h-3 rounded-full bg-red-500/90 mix-blend-multiply relative left-1 z-10"></div><div className="w-3 h-3 rounded-full bg-yellow-500/90 mix-blend-multiply relative right-1"></div></div>
                     </div>
                     <div className="bg-black px-2 py-0.5 rounded shadow-sm flex items-center justify-center border border-gray-700 h-6">
                         <span className="text-white font-bold text-[11px]"> Pay</span>
                     </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header 
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-2 gap-8"
      >
        <nav className="bg-[#131315]/80 backdrop-blur-xl rounded-full mt-4 max-w-fit mx-auto border border-white/5 flex items-center px-4 md:px-6 py-2 gap-4 md:gap-8 shadow-[0_0_40px_rgba(208,188,255,0.05)]">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg className="shadow-md rounded-[10px]" fill="none" height="32" viewBox="0 0 40 40" width="32" xmlns="http://www.w3.org/2000/svg">
              <rect fill="#1b1b1b" height="40" rx="10" width="40"></rect>
              <path d="M12 28V12L28 28V12" stroke="#d97a53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              <circle cx="28" cy="12" fill="#d97a53" r="3"></circle>
            </svg>
            <span className="text-lg md:text-xl font-bold tracking-tighter text-white uppercase font-sans whitespace-nowrap">Nis Finance <span className="text-[#d97a53]">Co.</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-4 font-sans tracking-tight font-medium text-sm">
            <a className="text-[#ffb599] font-bold hover:text-white transition-all duration-300" href="#">Market</a>
            <a className="text-[#a38c84] hover:text-white hover:bg-white/5 px-2 py-1 rounded transition-all duration-300" href="#">Intelligence</a>
            <button onClick={() => setIsModalOpen(true)} className="text-[#a38c84] hover:text-white hover:bg-[#d97a53]/10 px-2 py-1 rounded transition-all duration-300">Terminal</button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-[#a38c84] hover:text-white transition-all">
              <Globe size={18} />
            </button>
            <button onClick={() => setIsModalOpen(true)} className="hidden sm:block text-[#a38c84] text-sm font-medium hover:text-white transition-all">Login</button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#d97a53] text-[#531900] px-3 md:px-4 py-1.5 rounded-sm text-xs md:text-sm font-bold uppercase tracking-wider scale-95 hover:scale-100 transition-transform duration-200"
            >
              Premium
            </button>
          </div>
        </nav>
      </motion.header>

      <main className="pt-32 pb-8 px-6 max-w-7xl mx-auto min-h-screen">
        <section className="text-center mb-16 mt-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#533598]/20 border border-[#533598]/30 mb-6">
            <Sparkles size={14} className="text-[#d0bcff]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d0bcff] font-sans">V3.0 Intelligence Engine Active</span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-sans text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white max-w-4xl mx-auto mb-10 leading-[1.1]">
            <span className="text-[#ffb599]">{country === "Global Markets" ? "Global" : country}</span> Markets, Decoded by AI in Real-Time
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="bg-[#1c1b1d] p-1.5 rounded-full border border-white/5 flex gap-1 shadow-2xl">
              <button onClick={() => setLevel("Beginner")} className={`px-4 sm:px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${level === "Beginner" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Beginner</button>
              <button onClick={() => setLevel("Intermediate")} className={`px-4 sm:px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${level === "Intermediate" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Intermediate</button>
              <button onClick={() => setLevel("Expert")} className={`px-4 sm:px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${level === "Expert" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Expert</button>
            </div>

            {/* Top 60 Countries Dropdown */}
            <div className="bg-[#1c1b1d] p-1.5 rounded-full border border-[#d97a53]/20 relative flex items-center shadow-2xl px-4 hover:border-[#d97a53]/60 transition-colors">
              <Globe size={18} className="text-[#d97a53] mr-2" />
              <select 
                value={country} 
                onChange={e => setCountry(e.target.value)}
                className="bg-transparent text-white font-bold text-xs sm:text-sm tracking-wide outline-none cursor-pointer appearance-none pr-8 py-2 w-full md:w-auto min-w-[140px]"
              >
                {TOP_COUNTRIES.map(c => <option key={c} value={c} className="bg-[#131315] text-white">{c}</option>)}
              </select>
              <div className="absolute right-4 pointer-events-none text-[#d97a53] text-xs">▼</div>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="md:col-span-8 glass-card rounded-lg p-8 group relative overflow-hidden cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <div className="absolute top-0 right-0 p-8">
              <svg className="overflow-visible" height="60" viewBox="0 0 120 60" width="120">
                <path className="drop-shadow-[0_0_8px_rgba(94,217,206,0.6)]" d="M0 50 Q 15 45, 30 30 T 60 40 T 90 10 T 120 20" fill="none" stroke="#5ed9ce" strokeWidth="3"></path>
              </svg>
            </div>
            <div className="flex flex-col h-full relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#0da59b]/20 text-[#5ed9ce] text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">{activeContent.main.category}</span>
                <span className="text-[#a38c84] text-[10px] font-medium tracking-widest uppercase">{activeContent.main.time}</span>
              </div>
              <h2 className="font-sans text-3xl font-bold text-white mb-4 group-hover:text-[#ffb599] transition-colors">{activeContent.main.headline}</h2>
              <p className="text-[#dbc1b8] font-sans leading-relaxed mb-8 max-w-2xl min-h-[80px]">{activeContent.main.body}</p>
              <div className="mt-auto flex items-center gap-4">
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[#ffb599] font-bold text-sm px-4 py-2 rounded-sm transition-all shadow-inner">
                  <Sparkles size={16} /> Read AI Summary
                </button>
                <span className="text-[#a38c84] text-xs hidden sm:block">{activeContent.main.readTime}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-4 glass-card rounded-lg p-6 flex flex-col cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <div className="flex justify-between items-start mb-6">
              <span className="bg-[#93000a]/20 text-[#ffb4ab] text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">{activeContent.side.category}</span>
              <svg className="overflow-visible" height="30" viewBox="0 0 60 30" width="60">
                <path d="M0 5 Q 15 25, 30 20 T 60 28" fill="none" stroke="#ffb4ab" strokeWidth="2"></path>
              </svg>
            </div>
            <h3 className="font-sans text-xl font-bold text-white mb-3 min-h-[56px]">{activeContent.side.headline}</h3>
            <p className="text-[#dbc1b8] text-sm font-sans mb-6 line-clamp-3 min-h-[60px]">{activeContent.side.body}</p>
            <button className="text-[#ffb599] text-xs font-bold uppercase tracking-widest flex items-center gap-1 mt-auto hover:gap-2 transition-all">
              Full Report <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Bottom Row */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="md:col-span-4 glass-card rounded-lg p-6 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <span className="text-[#d0bcff] text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">{activeContent.bottom1.category}</span>
            <h3 className="font-sans text-lg font-bold text-white mb-2 leading-snug min-h-[50px]">{activeContent.bottom1.headline}</h3>
            <p className="text-[#dbc1b8] text-sm font-sans line-clamp-2 mb-4 min-h-[40px]">{activeContent.bottom1.body}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[#5ed9ce] font-mono text-xs">+1.24% AI Accuracy</span>
              <Bookmark size={18} className="text-[#a38c84]" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-4 glass-card rounded-lg p-6 border-l-2 border-l-[#ffb599]/30 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#ffb599] animate-pulse"></div>
              <span className="text-[#ffb599] text-[10px] font-black uppercase tracking-[0.2em]">{activeContent.bottom2.category}</span>
            </div>
            <h3 className="font-sans text-lg font-bold text-white mb-2 leading-snug min-h-[50px]">{activeContent.bottom2.headline}</h3>
            <p className="text-[#dbc1b8] text-sm font-sans line-clamp-2 min-h-[40px]">{activeContent.bottom2.body}</p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
              <Zap size={16} className="text-[#ffb599]" />
              <span className="text-xs text-[#dbc1b8]">Instant AI Summary Available</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="md:col-span-4 glass-card rounded-lg p-6 bg-[#533598]/10 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <span className="text-[#c3abff] text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">{activeContent.bottom3.category}</span>
            <h3 className="font-sans text-lg font-bold text-white mb-2 leading-snug min-h-[50px]">{activeContent.bottom3.headline}</h3>
            <p className="text-[#dbc1b8] text-sm font-sans line-clamp-2 min-h-[40px]">{activeContent.bottom3.body}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex -space-x-2">
                <img alt="User avatar" className="w-6 h-6 rounded-full border border-[#131315]" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=32&h=32" />
                <img alt="User avatar" className="w-6 h-6 rounded-full border border-[#131315]" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=32&h=32" />
              </div>
              <span className="text-[10px] text-[#a38c84]">12 analysts tracking</span>
            </div>
          </motion.div>

        </section>
      </main>

      {/* Data Ingestion Sources (Scrolling Marquee) */}
      <section className="py-12 border-y border-white/5 bg-[#0a0a0c] relative overflow-hidden flex flex-col items-center">
         <span className="text-[#ffb599] text-[10px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
             <ShieldCheck size={14} /> LIVE DATA INGESTION FROM 500+ INSTITUTIONAL SOURCES
         </span>
         <div className="w-[150%] md:w-[120%] flex overflow-hidden">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }} 
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }} 
              className="flex gap-16 items-center flex-nowrap text-white/20 font-sans font-extrabold text-2xl md:text-3xl uppercase tracking-widest whitespace-nowrap"
            >
               <span>Bloomberg Terminal</span><span>•</span>
               <span>Reuters Eikon</span><span>•</span>
               <span>Financial Times</span><span>•</span>
               <span>Dow Jones Newswires</span><span>•</span>
               <span>S&P Global Market Intelligence</span><span>•</span>
               <span>Nikkei 225 Data</span><span>•</span>
               <span>CNBC Pro</span><span>•</span>
               <span>FactSet</span><span>•</span>
               <span>Moody's Analytics</span><span>•</span>
               <span>Fitch Ratings</span><span>•</span>
               {/* Loop Duplicate */}
               <span>Bloomberg Terminal</span><span>•</span>
               <span>Reuters Eikon</span><span>•</span>
               <span>Financial Times</span><span>•</span>
               <span>Dow Jones Newswires</span><span>•</span>
               <span>S&P Global Market Intelligence</span><span>•</span>
               <span>Nikkei 225 Data</span><span>•</span>
               <span>CNBC Pro</span><span>•</span>
               <span>FactSet</span><span>•</span>
               <span>Moody's Analytics</span><span>•</span>
               <span>Fitch Ratings</span><span>•</span>
            </motion.div>
         </div>
         {/* Fade Gradients for marque */}
         <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0c] to-transparent pointer-events-none"></div>
         <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0c] to-transparent pointer-events-none"></div>
      </section>

      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pt-12 pb-24 border-t border-white/5 flex flex-col items-center justify-center gap-8 bg-[#131315]">
        <div className="flex items-center justify-center gap-8 text-xs font-bold text-[#a38c84] tracking-widest uppercase">
          <a href="#" className="hover:text-[#ffb599] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#ffb599] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#ffb599] transition-colors">Cookie Policy</a>
        </div>
        
        {/* Payment Methods displayed in Footer for global visibility */}
        <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center gap-1"><ShieldCheck size={12}/> Global Secure Payments</span>
            <div className="flex justify-center items-center gap-3 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
               <div className="bg-white px-2.5 py-1 rounded shadow-sm text-[#142A7C] font-extrabold text-xs tracking-tighter">VISA</div>
               <div className="bg-white px-2.5 py-1 rounded shadow-sm flex items-center justify-center"><div className="flex"><div className="w-3.5 h-3.5 rounded-full bg-[#EA001B] mix-blend-multiply relative left-1.5 z-10"></div><div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] mix-blend-multiply relative right-1"></div></div></div>
               <div className="bg-[#1A1F36] px-2.5 py-1 rounded shadow-sm border border-gray-600 text-[#635BFF] font-bold text-xs tracking-wide">stripe</div>
               <div className="bg-white px-2.5 py-1 rounded shadow-sm border border-gray-200 text-black font-extrabold text-xs">PayPal</div>
               <div className="text-white font-bold text-xs bg-black px-2.5 py-1 rounded border border-white/20"> Pay</div>
            </div>
        </div>
        
        <div className="text-[#a38c84]/50 text-[10px]">© 2026 Nis Finance Co. All rights reserved.</div>
      </motion.footer>

      {/* Shared Component: BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-[#131315]/80 backdrop-blur-lg border-t border-white/5 font-sans text-[10px] uppercase tracking-widest">
        <a className="flex flex-col items-center justify-center text-[#ffb599] font-black" href="#"><Home size={20} className="mb-1" /><span>Home</span></a>
        <a className="flex flex-col items-center justify-center text-[#a38c84] hover:text-[#d97a53] transition-colors" href="#"><Bell size={20} className="mb-1" /><span>Alerts</span></a>
        <a className="flex flex-col items-center justify-center text-[#a38c84] hover:text-[#d97a53] transition-colors" href="#"><Sparkles size={20} className="mb-1" /><span>AI Pulse</span></a>
        <a onClick={() => setIsModalOpen(true)} className="flex flex-col items-center justify-center text-[#a38c84] hover:text-[#d97a53] transition-colors cursor-pointer"><User size={20} className="mb-1" /><span>Profile</span></a>
      </nav>

      {/* Signature Component: AI Pulse Indicator */}
      <div className="fixed bottom-24 right-8 flex items-center gap-3 bg-[#353437]/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/5 shadow-2xl z-40">
        <div className="relative w-4 h-4"><div className="absolute inset-0 bg-[#ffb599]/40 rounded-full animate-ping"></div><div className="absolute inset-0 bg-[#ffb599] rounded-full shadow-[0_0_10px_rgba(217,122,83,0.8)]"></div></div>
        <div className="flex flex-col"><span className="text-[10px] font-bold text-white uppercase tracking-tighter">AI Pulse Live</span><span className="text-[9px] text-[#ffb599]">Processing 42.1M nodes/sec</span></div>
      </div>
    </>
  );
}
