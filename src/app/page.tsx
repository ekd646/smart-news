"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, X, BookOpen, Calculator, ShieldCheck, Home, Bell, User } from "lucide-react";

// Top 60 Countries List
const TOP_COUNTRIES = [
  "Global Markets", "United States", "China", "Japan", "Germany", "India", "United Kingdom", "France", "Italy", "Canada", "Brazil", 
  "Russia", "South Korea", "Australia", "Mexico", "Spain", "Indonesia", "Netherlands", "Saudi Arabia", "Turkey", "Switzerland", 
  "Poland", "Sweden", "Belgium", "Argentina", "Thailand", "Iran", "Austria", "United Arab Emirates", "Norway", "Israel", 
  "South Africa", "Ireland", "Denmark", "Singapore", "Malaysia", "Nigeria", "Philippines", "Colombia", "Chile", "Finland",
  "Bangladesh", "Egypt", "Vietnam", "Portugal", "Czech Republic", "Romania", "New Zealand", "Peru", "Greece", "Iraq",
  "Algeria", "Qatar", "Kazakhstan", "Hungary", "Kuwait", "Morocco", "Slovakia", "Ecuador", "Kenya", "Angola"
];

// 10 Detailed Templates encompassing Dictionary & Math components
const BASE_TEMPLATES = [
  {
    category: "Macro Economics",
    headlineTemplate: "{country} Treasury Yields Spike on Hawkish Pivot",
    shortTemplate: "Sovereign bond markets in {country} are reacting to unexpected regional inflation data.",
    jargon: "Hawkish Pivot & Yields",
    jargonDef: {
      Beginner: "The central bank is raising interest rates to fight rising prices. This makes new bonds pay more, so older bonds drop in value.",
      Intermediate: "A hawkish pivot signals tighter monetary policy ahead. Consequently, the sell-off in sovereign debt drives yields higher.",
      Expert: "OIS markets are fully pricing in a 50bps hike at the next meeting, driving a brutal bear-flattening of the {country} sovereign yield curve."
    },
    mathCalc: "Bond Math: A 10-year bond with a modified duration of 8.5 will suffer an 8.5% price drop if yields rise by 1.00% (100 basis points). Investors holding $100,000 in these bonds instantly lose $8,500 in paper value."
  },
  {
    category: "Tech & AI",
    headlineTemplate: "{country} AI Startups Secure Record Series B",
    shortTemplate: "Venture capital in {country} floods the generative AI infrastructure sector.",
    jargon: "Series B & Valuation",
    jargonDef: {
      Beginner: "A 'Series B' is the second big round of funding a startup gets after proving their product works. Investors buy a piece of the company.",
      Intermediate: "Series B funding typically occurs when a company has established product-market fit and needs immense capital to scale global operations.",
      Expert: "Post-money valuations expand significantly during Series B as institutional LPs deploy dry powder into high-conviction momentum plays."
    },
    mathCalc: "Equity Dilution: If founders own 60% and sell 20% of the new post-money valuation to VCs for $50M, their ownership drops to 48% (60% * 0.8). However, the nominal value of their stake jumps to $120M."
  },
  {
    category: "Energy & Commodities",
    headlineTemplate: "Strategic Oil Reserves Tapped in {country}",
    shortTemplate: "Government intervention aims to stabilize crude prices.",
    jargon: "Strategic Reserves & Crude Spot",
    jargonDef: {
      Beginner: "The government in {country} is releasing its emergency oil savings to flood the market and bring gas prices down for regular citizens.",
      Intermediate: "Releasing barrels from the SPR increases immediate spot market supply, attempting to suppress front-month futures prices.",
      Expert: "SPR drawdowns increase physical liquidity but can steepen the contango curve if market makers expect future inventory restocking to bid up deferred contracts."
    },
    mathCalc: "Commodity Math: Injecting 1 million barrels per day into a market consuming 20M barrels increases supply by 5%. If price elasticity of demand is -0.1, prices theoretically drop by 50% in a vacuum (though actual drops average 3-5% due to global arbitrage)."
  },
  {
    category: "Crypto & Web3",
    headlineTemplate: "Bitcoin Inflows Surge Across {country} Exchanges",
    shortTemplate: "Institutional accumulation accelerates.",
    jargon: "Institutional Accumulation",
    jargonDef: {
      Beginner: "Big banks and rich companies are quietly buying up a lot of Bitcoin because they think the price will go up long-term.",
      Intermediate: "Institutional accumulation refers to sustained, large-volume buying by corporate treasurys or hedge funds, usually outside of retail spot markets.",
      Expert: "On-chain heuristics show massive outflows from centralized exchange hot wallets to multi-sig cold storage, signaling high-timeframe institutional holding."
    },
    mathCalc: "Liquidity Math: If exchanges hold 2M BTC and institutions buy 100k BTC in a month, available trading supply drops by 5%. This supply shock geometrically increases the price impact of every new marginal buyer."
  },
  {
    category: "Equities & Bonds",
    headlineTemplate: "{country} Blue-Chips Rally on Earnings Beat",
    shortTemplate: "Major tech firms exceed consensus revenue estimates.",
    jargon: "Earnings Beat & Consensus",
    jargonDef: {
      Beginner: "Big companies announced they made more money than analysts guessed they would, so people are buying their stock and the price is going up.",
      Intermediate: "When Q-over-Q EPS exceeds Wall Street consensus, it triggers algorithmic momentum buying and forces short-sellers to cover.",
      Expert: "The EPS surprise triggered aggressive options buying (calls), forcing market makers to delta-hedge by buying the underlying asset, fueling a systemic gamma squeeze."
    },
    mathCalc: "P/E Expansion: A company earning $5 per share at a Price-to-Earnings ratio of 20 trades at $100. If earnings jump to $6 and the excitement pushes the P/E to 25, the stock price skyrockets to $150 (a 50% gain!)."
  },
  {
    category: "Macro Economics",
    headlineTemplate: "{country} Employment Data Shocks Markets",
    shortTemplate: "Unemployment figures came in massively below expectations in {country}.",
    jargon: "Non-Farm Payrolls (NFP)",
    jargonDef: {
      Beginner: "More people have jobs than expected! A strong job market means the local economy in {country} is doing really well right now.",
      Intermediate: "Tight labor markets typically lead to wage inflation, forcing the central bank to maintain restrictive rates longer.",
      Expert: "Unexpected labor market tightness flattens the Phillips Curve, leading to stagflationary concerns if productivity metrics fail to outpace sequential wage growth."
    },
    mathCalc: "Wage Inflation: If workers demand a 5% raise, but productivity only increases 1%, companies face a 4% unit labor cost increase. To maintain historical 20% profit margins, they must raise retail prices by exactly 4%."
  },
  {
    category: "Banking & Finance",
    headlineTemplate: "{country} Regional Banks Face Contagion Risk",
    shortTemplate: "Deposit flight accelerates as uninsured depositors flee.",
    jargon: "Contagion & Bank Run",
    jargonDef: {
      Beginner: "People are scared a bank might fail in {country}, so everyone is rushing to take their money out all at once.",
      Intermediate: "When a bank's Held-To-Maturity (HTM) losses exceed its equity capital, uninsured depositors withdraw funds rapidly, triggering a liquidity crisis.",
      Expert: "Duration mismatch between long-term deeply underwater Treasury holdings and short-term retail deposits forces fire sales, realizing the HTM paper losses and wiping out Tier 1 Capital."
    },
    mathCalc: "Leverage Ratio: A bank has $10B in deposits and $1B in equity (10x leverage). They buy $10B in 2% bonds. If rates go to 5%, bond value drops 20% (to $8B). The $2B loss entirely wipes out the $1B equity, leaving the bank technically insolvent."
  },
  {
    category: "Tech & AI",
    headlineTemplate: "Semiconductor Restrictions Hit {country}",
    shortTemplate: "Geopolitical tensions throttle advanced CPU exports.",
    jargon: "Export Controls & Foundries",
    jargonDef: {
      Beginner: "Countries are fighting over who gets the fastest computer chips. {country} is blocking others from buying their best technology.",
      Intermediate: "Export quotas on cutting-edge lithography machines prevent rival economic zones from training advanced LLM architectures.",
      Expert: "CFIUS interventions and Entity List updates structurally sever the global semiconductor supply chain, reshoring fab capacities but causing hyper-inflation in GPU cloud clusters."
    },
    mathCalc: "CapEx Math: Building a new local semiconductor fab costs $20 Billion. Amortized over 5 years, that's $4B per year in depreciation. If the fab produces 10 million chips per year, the baseline infrastructure cost is $400 per chip."
  },
  {
    category: "Real Estate",
    headlineTemplate: "Commercial Real Estate Defaults in {country}",
    shortTemplate: "Office building mortgages mature in a high-rate environment.",
    jargon: "CMBS & Refinancing Risk",
    jargonDef: {
      Beginner: "Owners of giant office buildings in {country} borrowed money when it was cheap. Now their loans are due, and borrowing is too expensive, so they might lose the buildings.",
      Intermediate: "Commercial Mortgage-Backed Securities (CMBS) are failing to refinance as office vacancy rates surge and capitalization (cap) rates expand.",
      Expert: "A systemic maturity wall approaches for non-recourse CRE loans. Expanding cap rates mechanically crush Net Asset Value (NAV), pushing Loan-to-Value (LTV) ratios above 100%, triggering strategic defaults."
    },
    mathCalc: "Cap Rate Valuation: An office building generates $5M a year in rent. At a 5% Cap Rate, it's worth $100M ($5M / 0.05). If interest rates rise and the Cap Rate goes to 8%, the building's value crashes to $62.5M ($5M / 0.08) overnight."
  },
  {
    category: "Crypto & Web3",
    headlineTemplate: "{country} Regulators Approve Smart Contract Framework",
    shortTemplate: "Legislative clarity paves the way for tokenization.",
    jargon: "Tokenization & Regulatory Clarity",
    jargonDef: {
      Beginner: "The government in {country} just made rules for digital money, making it safe and legal for big companies to start using it.",
      Intermediate: "Clear regulatory frameworks allow legacy financial institutions to tokenize Real World Assets (RWAs) like real estate or bonds onto blockchain ledgers without compliance fears.",
      Expert: "The passing of digital asset legislation bridges traditional TradFi plumbing with decentralized protocols, enabling atomic settlement of tokenized securities and reducing counterparty settlement risk."
    },
    mathCalc: "Settlement Efficiency: A traditional stock trade takes T+2 days (48 hours) to settle, locking up $100M in margin capital. Blockchain atomic settlement takes 10 seconds. Slashing lockup time frees up capital, increasing capital efficiency margins by nearly 30% for prime brokers."
  }
];

// Reusable Type
type NewsItem = {
  id: number;
  category: string;
  time: string;
  headline: string;
  short: string;
  jargon: string;
  jargonDef: string;
  mathCalc: string;
};

export default function Page() {
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Expert">("Intermediate");
  const [country, setCountry] = useState("Global Markets");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  // Programmatically generate exactly 100 News Nodes
  const generatedNews = useMemo(() => {
    const items: NewsItem[] = [];
    let idAcc = 1;
    for (let loop = 0; loop < 10; loop++) {
      BASE_TEMPLATES.forEach((template, idx) => {
        let modifierVal = ((loop * 1.5) + (idx * 0.2)).toFixed(1);
        let headline = template.headlineTemplate.replace("{country}", country === "Global Markets" ? "Global" : country);
        let shortText = template.shortTemplate.replace("{country}", country === "Global Markets" ? "Global" : country);
        
        items.push({
          id: idAcc++,
          category: template.category,
          time: `${loop * 5 + idx + 1}m ago`,
          headline: headline,
          short: shortText,
          jargon: template.jargon,
          jargonDef: template.jargonDef[level], // Reactive explicitly to literacy level
          mathCalc: template.mathCalc
        });
      });
    }
    return items;
  }, [country, level]);

  // Derive unique categories from generation
  const uniqueCategories = Array.from(new Set(generatedNews.map(n => n.category)));

  return (
    <div className="bg-[#131315] min-h-screen text-[#e5e1e4] font-sans selection:bg-[#d97a53] selection:text-white">
      {/* Absolute Dark Mode Orb Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden mix-blend-screen opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orb-peach blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[800px] h-[800px] bg-orb-violet blur-3xl"></div>
      </div>

      {/* Subscription Pricing Modal */}
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
              <button className="w-full py-3 bg-[#d97a53] text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                Start 14-Day Free Trial
              </button>
              <div className="mt-6 border-t border-white/10 pt-4 text-center">
                 <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-3 font-medium">
                     <ShieldCheck size={14} className="text-[#5ed9ce]" /> Guaranteed Safe & Secure Checkout
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

      {/* AI Analysis Article Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
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
              </div>
              
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight">{activeArticle.headline}</h2>
              <p className="text-white/60 text-lg mb-8">{activeArticle.short}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Dictionary */}
                <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#5ed9ce]"></div>
                  <h3 className="flex items-center gap-2 text-[#5ed9ce] font-bold text-lg mb-3">
                    <BookOpen size={18}/> AI Dictionary ({level})
                  </h3>
                  <p className="text-[#a38c84] text-xs uppercase tracking-widest mb-2 font-bold opacity-50">Explaining: {activeArticle.jargon}</p>
                  <p className="text-[#dbc1b8] text-sm leading-relaxed font-medium">{activeArticle.jargonDef}</p>
                </div>
                
                {/* AI Math Breakdown */}
                <div className="bg-gradient-to-bl from-[#d97a53]/20 to-transparent border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#d97a53]"></div>
                  <h3 className="flex items-center gap-2 text-[#d97a53] font-bold text-lg mb-3">
                    <Calculator size={18}/> Quant & Math Breakdown
                  </h3>
                  <p className="text-[#a38c84] text-xs uppercase tracking-widest mb-2 font-bold opacity-50">Calculation Engine Direct Output</p>
                  <p className="text-[#dbc1b8] text-sm leading-relaxed font-mono tracking-tight">{activeArticle.mathCalc}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layered Pyramid Navbar */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-center pt-6 pb-6 bg-gradient-to-b from-[#0a0a0c] via-[#131315]/90 to-transparent backdrop-blur-md"
      >
        {/* Layer 1: Brand Top */}
        <div className="flex items-center gap-2 cursor-pointer mb-5" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg className="shadow-lg rounded-[10px]" fill="none" height="36" viewBox="0 0 40 40" width="36" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#1b1b1b" height="40" rx="10" width="40"></rect>
            <path d="M12 28V12L28 28V12" stroke="#d97a53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
            <circle cx="28" cy="12" fill="#d97a53" r="3"></circle>
          </svg>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase font-sans whitespace-nowrap">Nis Finance <span className="text-[#d97a53]">Co.</span></span>
        </div>

        {/* Layer 2: Middle Utility */}
        <div className="flex items-center gap-4 mb-5 border-b border-white/10 pb-4 px-12">
          <button onClick={() => setIsModalOpen(true)} className="text-[#a38c84] text-xs font-bold uppercase tracking-widest hover:text-white transition-all">Login</button>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#d97a53] text-[#531900] px-3 py-1 rounded-sm text-[10px] sm:text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform duration-200">Premium</button>
        </div>

        {/* Layer 3: Bottom Base */}
        <div className="flex items-center gap-8 md:gap-16 font-sans tracking-widest font-bold text-[11px] md:text-xs uppercase">
          <a className="text-[#ffb599] hover:text-white transition-all duration-300 cursor-pointer">Market</a>
          <a className="text-[#a38c84] hover:text-white transition-all duration-300 cursor-pointer">Intelligence</a>
          <button onClick={() => setIsModalOpen(true)} className="text-[#a38c84] hover:text-[#d97a53] transition-all duration-300 cursor-pointer">Terminal</button>
        </div>
      </motion.header>

      <main className="pt-56 pb-8 px-6 max-w-[1600px] mx-auto min-h-screen">
        <section className="text-center mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#533598]/20 border border-[#533598]/30 mb-6">
            <Sparkles size={14} className="text-[#d0bcff]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0bcff]">100 Connected Nodes Active</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 bg-[#18181a] max-w-fit mx-auto p-2 rounded-[32px] border border-white/5 shadow-2xl">
            {/* Literacy Matrix */}
            <div className="flex items-center gap-1 bg-black/40 rounded-[24px] p-1">
              <button onClick={() => setLevel("Beginner")} className={`px-4 sm:px-6 py-2.5 rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Beginner" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Beginner</button>
              <button onClick={() => setLevel("Intermediate")} className={`px-4 sm:px-6 py-2.5 rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Intermediate" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Intermediate</button>
              <button onClick={() => setLevel("Expert")} className={`px-4 sm:px-6 py-2.5 rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Expert" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Expert</button>
            </div>

            <div className="w-[1px] h-8 bg-white/10 hidden md:block"></div>

            {/* Country Matrix */}
            <div className="relative flex items-center px-4 md:pr-4 md:pl-0 w-full md:w-auto">
              <Globe size={18} className="text-[#d97a53] mr-2" />
              <select 
                value={country} 
                onChange={e => setCountry(e.target.value)}
                className="bg-transparent text-white font-extrabold text-sm tracking-widest outline-none cursor-pointer appearance-none pr-8 py-2 w-full min-w-[180px] hover:text-[#ffb599] transition-colors"
                title="Select Regional Data Feed"
              >
                {TOP_COUNTRIES.map(c => <option key={c} value={c} className="bg-[#131315] text-white">{c}</option>)}
              </select>
              <div className="absolute right-4 md:right-0 pointer-events-none text-[#d97a53] text-xs">▼</div>
            </div>
          </motion.div>
        </section>

        {/* Generative Categorical News Grids (100 Items Total) */}
        <div className="space-y-16 mt-16">
          {uniqueCategories.map((categoryName) => {
            const categoryItems = generatedNews.filter(n => n.category === categoryName);
            if (categoryItems.length === 0) return null;

            return (
              <section key={categoryName} className="relative z-10 w-full">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl font-bold text-white tracking-widest uppercase">{categoryName}</h2>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent"></div>
                  <span className="text-[10px] font-mono text-[#a38c84]">{categoryItems.length} active nodes</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryItems.map((item, i) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (Math.min(i, 8) * 0.05) }}
                      onClick={() => setActiveArticle(item)}
                      className="bg-[#1c1b1d]/80 backdrop-blur-md p-5 rounded-xl border border-white/5 hover:border-[#d97a53]/50 hover:bg-[#252326] cursor-pointer group transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-mono text-[#a38c84] bg-white/5 px-2 py-0.5 rounded">{item.time}</span>
                        <BookOpen size={14} className="text-[#5ed9ce] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-[#ffb599] transition-colors">{item.headline}</h4>
                      <p className="text-xs text-[#dbc1b8] font-medium opacity-70 line-clamp-2 leading-relaxed">{item.short}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Deep Institutional Footer & Data Marquee */}
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
      </section>

      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pt-12 pb-24 border-t border-white/5 flex flex-col items-center justify-center gap-8 bg-[#131315]">
        <div className="flex items-center justify-center gap-8 text-xs font-bold text-[#a38c84] tracking-widest uppercase">
          <a href="#" className="hover:text-[#ffb599] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#ffb599] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#ffb599] transition-colors">Cookie Policy</a>
        </div>
        
        {/* Payment Methods Footer */}
        <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-extrabold flex items-center gap-1"><ShieldCheck size={12}/> Global Secure Payments</span>
            <div className="flex justify-center items-center gap-3 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
               <div className="bg-white px-3 py-1.5 rounded shadow-sm text-[#142A7C] font-extrabold text-xs tracking-tighter">VISA</div>
               <div className="bg-white px-3 py-1.5 rounded shadow-sm flex items-center justify-center"><div className="flex"><div className="w-3.5 h-3.5 rounded-full bg-[#EA001B] mix-blend-multiply relative left-1.5 z-10"></div><div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] mix-blend-multiply relative right-1"></div></div></div>
               <div className="bg-[#1A1F36] px-3 py-1.5 rounded shadow-sm border border-gray-600 text-[#635BFF] font-bold text-xs tracking-wide">stripe</div>
               <div className="text-white font-bold text-xs bg-black px-3 py-1.5 rounded border border-white/20"> Pay</div>
            </div>
        </div>
        <div className="text-[#a38c84]/50 text-[10px]">© 2026 Nis Finance Co. All rights reserved.</div>
      </motion.footer>
    </div>
  );
}
