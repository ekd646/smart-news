"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, X, BookOpen, Calculator, ShieldCheck, Home, Bell, User, Calendar } from "lucide-react";

// Top 60 Countries List
const TOP_COUNTRIES = [
  "Global Markets", "United States", "China", "Japan", "Germany", "India", "United Kingdom", "France", "Italy", "Canada", "Brazil", 
  "Russia", "South Korea", "Australia", "Mexico", "Spain", "Indonesia", "Netherlands", "Saudi Arabia", "Turkey", "Switzerland", 
  "Poland", "Sweden", "Belgium", "Argentina", "Thailand", "Iran", "Austria", "United Arab Emirates", "Norway", "Israel", 
  "South Africa", "Ireland", "Denmark", "Singapore", "Malaysia", "Nigeria", "Philippines", "Colombia", "Chile", "Finland",
  "Bangladesh", "Egypt", "Vietnam", "Portugal", "Czech Republic", "Romania", "New Zealand", "Peru", "Greece", "Iraq",
  "Algeria", "Qatar", "Kazakhstan", "Hungary", "Kuwait", "Morocco", "Slovakia", "Ecuador", "Kenya", "Angola"
];

const BASE_TEMPLATES = [
  {
    category: "Macro Economics",
    headlineTemplate: "{country} Treasury Yields {dir_word} on Policy Shift",
    shortTemplate: "Sovereign bond markets in {country} are reacting to unexpected regional data.",
    jargon: "Yield Curve & Monetary Policy",
    jargonDef: {
      Beginner: "The central bank (which controls money) is changing rules to handle prices. This affects how much interest governments pay when they borrow money.",
      Intermediate: "A shift in monetary policy signals tighter or looser conditions ahead. Consequently, the sovereign debt market reprices these expectations into new yields.",
      Expert: "OIS liquidity matrices are fully pricing in structural adjustments at the next meeting, driving intense volatility across the {country} sovereign yield curve."
    },
    mathCalc: "Bond Math: A 10-year bond with a modified duration of 8.5 will suffer an 8.5% price drop if yields rise by {rand_rate}%."
  },
  {
    category: "Tech & AI",
    headlineTemplate: "{country} Tech Sector Secures ${rand_val}B in Series B",
    shortTemplate: "Venture capital in {country} floods the generative AI infrastructure sector.",
    jargon: "Series B & Valuation",
    jargonDef: {
      Beginner: "A 'Series B' is a big round of funding a startup gets after proving their product works. Rich investors buy a piece of the company.",
      Intermediate: "Series B funding typically occurs when a company has established product-market fit and needs immense capital to scale global operations.",
      Expert: "Post-money valuations expand significantly during Series B as institutional LPs deploy dry powder into high-conviction momentum plays."
    },
    mathCalc: "Equity Dilution: If founders own 60% and sell 20% of the new post-money valuation to VCs for ${rand_val}M, their ownership drops to 48% (60% * 0.8)."
  },
  {
    category: "Energy & Commodities",
    headlineTemplate: "Strategic Reserves Tapped: {rand_val}M Barrels in {country}",
    shortTemplate: "Government intervention aims to stabilize energy commodity prices.",
    jargon: "Strategic Reserves & Crude Spot",
    jargonDef: {
      Beginner: "The government in {country} is releasing its emergency oil savings to flood the market and bring gas prices down for regular citizens.",
      Intermediate: "Releasing barrels from the SPR increases immediate spot market supply, attempting to suppress front-month futures prices.",
      Expert: "SPR drawdowns increase physical liquidity but can steepen the contango curve if market makers expect future inventory restocking to bid up deferred contracts."
    },
    mathCalc: "Commodity Math: Injecting {rand_val} million barrels into a market consuming 20M barrels increases supply. If price elasticity of demand is -0.1, prices theoretically adjust downward proportionately."
  },
  {
    category: "Crypto & Web3",
    headlineTemplate: "Institution Inflows Surge: {rand_val} BTC bought in {country}",
    shortTemplate: "Algorithmic accumulation of decentralized assets accelerates.",
    jargon: "Institutional Accumulation",
    jargonDef: {
      Beginner: "Big banks and rich companies are quietly buying up a lot of Bitcoin because they think the price will go up long-term.",
      Intermediate: "Institutional accumulation refers to sustained, large-volume buying by corporate treasurys or hedge funds, usually outside of retail spot markets.",
      Expert: "On-chain heuristics show massive outflows from centralized exchange hot wallets to multi-sig cold storage, signaling high-timeframe institutional holding."
    },
    mathCalc: "Liquidity Math: If exchanges hold 2M BTC and institutions buy {rand_val}k BTC, available trading supply drops severely, increasing the price impact of every new marginal buyer."
  },
  {
    category: "Equities & Bonds",
    headlineTemplate: "{country} Blue-Chips {dir_word} on Q{rand_q} Earnings",
    shortTemplate: "Major tech and legacy firms navigate consensus revenue estimates.",
    jargon: "Earnings Beat/Miss & Consensus",
    jargonDef: {
      Beginner: "Big companies announced how much money they made. If it's more than experts guessed, people buy the stock; if less, they sell it.",
      Intermediate: "When Q-over-Q EPS deviates from Wall Street consensus, it triggers algorithmic momentum buying or selling and forces portfolio rebalancing.",
      Expert: "The EPS delta triggered aggressive options activity, forcing market makers to delta-hedge by buying/selling the underlying asset, fueling a systemic gamma squeeze."
    },
    mathCalc: "P/E Expansion: A company earning $5 per share at a P/E ratio of 20 trades at $100. If earnings jump and excitement pushes the P/E to {rand_rate}, the stock price adjusts drastically."
  },
  {
    category: "Macro Economics",
    headlineTemplate: "{country} Employment Figures Spark Market {dir_noun}",
    shortTemplate: "Unemployment figures deviated from baseline expectations in {country}.",
    jargon: "Non-Farm Payrolls (NFP)",
    jargonDef: {
      Beginner: "Employment reports show how many people have jobs. A strong job market means the local economy in {country} is doing really well right now.",
      Intermediate: "Tight labor markets typically lead to wage inflation, forcing the central bank to maintain restrictive rates longer.",
      Expert: "Unexpected labor market tightness flattens the Phillips Curve, leading to stagflationary concerns if productivity metrics fail to outpace sequential wage growth."
    },
    mathCalc: "Wage Inflation: If workers demand a {rand_rate}% raise, but productivity only increases 1%, companies face increased unit labor costs, forcing retail price hikes to maintain margins."
  },
  {
    category: "Banking & Finance",
    headlineTemplate: "{country} Regional Banks Audit Reveals ${rand_val}B Exposure",
    shortTemplate: "Commercial deposits face volatility amid stress tests.",
    jargon: "Held-to-Maturity & Liquidity",
    jargonDef: {
      Beginner: "People are watching banks closely in {country} to make sure they have enough cash on hand if everyone wants their money back at once.",
      Intermediate: "When a bank's Held-To-Maturity (HTM) losses threaten its equity capital, uninsured depositors withdraw funds, risking a liquidity crunch.",
      Expert: "Duration mismatch between long-term deeply underwater holdings and short-term retail deposits forces fire sales, realizing paper losses and wiping out Tier 1 Capital."
    },
    mathCalc: "Leverage Ratio: A bank has $10B in deposits and $1B in equity (10x leverage). They buy $10B in bonds. If rates change and bond value drops {rand_rate}%, the loss can wipe out massive equity instantly."
  },
  {
    category: "Tech & AI",
    headlineTemplate: "Hardware Export Quota Adjusted to {rand_val}M units in {country}",
    shortTemplate: "Geopolitical tariffs throttle advanced computer chip supply chains.",
    jargon: "Export Controls & Foundries",
    jargonDef: {
      Beginner: "Countries are fighting over who gets the fastest computer chips. {country} is managing who can buy their best technology.",
      Intermediate: "Export quotas on cutting-edge lithography machines prevent rival economic zones from training advanced LLM architectures.",
      Expert: "Entity List updates structurally sever the global semiconductor supply chain, reshoring fab capacities but causing hyper-inflation in GPU cloud clusters."
    },
    mathCalc: "CapEx Math: Building a new local semiconductor fab costs $20 Billion. Amortized over 5 years, that's $4B per year in depreciation alone before building {rand_val} chips."
  },
  {
    category: "Real Estate",
    headlineTemplate: "CRE Defaults Approach ${rand_val}B Benchmark in {country}",
    shortTemplate: "Commercial office mortgages mature in a restrictive rate environment.",
    jargon: "CMBS & Net Asset Value",
    jargonDef: {
      Beginner: "Owners of giant office buildings in {country} borrowed money when it was cheap. Now their loans are due, and borrowing is too expensive.",
      Intermediate: "Commercial Mortgage-Backed Securities (CMBS) are failing to refinance as office vacancy rates surge and capitalization (cap) rates expand.",
      Expert: "A systemic maturity wall approaches for non-recourse CRE loans. Expanding cap rates mechanically crush Net Asset Value (NAV), pushing LTV ratios above 100%."
    },
    mathCalc: "Valuation Crash: An office building generates $5M a year in rent. At a 5% Cap Rate, it's worth $100M. If interest rates rise and the Cap Rate hits {rand_rate}%, its value crashes severely."
  },
  {
    category: "Crypto & Web3",
    headlineTemplate: "{country} Finalizes Smart Contract Audits for Phase {rand_q}",
    shortTemplate: "Legislative clarity accelerates the tokenization of real world assets.",
    jargon: "Tokenization & Settlement",
    jargonDef: {
      Beginner: "The government in {country} made rules for digital money, making it safe and legal for big companies to start using it.",
      Intermediate: "Clear regulatory frameworks allow legacy financial institutions to tokenize Real World Assets (RWAs) like real estate onto blockchain ledgers.",
      Expert: "Bridging traditional TradFi plumbing with decentralized protocols enables atomic settlement of tokenized securities, slashing counterparty delivery risk."
    },
    mathCalc: "Capital Efficiency: Traditional settlement takes 48 hours, locking up $100M in margin capital. Blockchain settlement takes {rand_val} seconds. This frees capital to generate yield elsewhere."
  }
];

// Helper functions for seeded randomness
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number) => {
  const m = 2 ** 35 - 31;
  let s = seed % m;
  return function () {
    return (s = (s * 185852) % m) / m;
  };
};

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
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // Current Date State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  // 100-Node Programmable Generation utilizing Date + Country seed
  const generatedNews = useMemo(() => {
    const items: NewsItem[] = [];
    const seedString = `${date}-${country}`;
    const rand = seededRandom(hashString(seedString));
    
    let idAcc = 1;
    for (let loop = 0; loop < 10; loop++) {
      BASE_TEMPLATES.forEach((template, idx) => {
        // Deterministic Pseudo-random variables based on the Date seed
        const rv = rand(); // 0 to 1
        const randFloat = (rv * 15 + 1).toFixed(1); // 1.0 to 16.0
        const randInt = Math.floor(rv * 800) + 12; // 12 to 812
        const drWord = rv > 0.5 ? "Surge" : "Plummet";
        const drNoun = rv > 0.5 ? "Euphoria" : "Panic";
        const qNum = Math.floor(rv * 4) + 1;

        let headline = template.headlineTemplate
            .replace("{country}", country === "Global Markets" ? "Global" : country)
            .replace("{rand_val}", randInt.toString())
            .replace("{rand_rate}", randFloat)
            .replace("{dir_word}", drWord)
            .replace("{dir_noun}", drNoun)
            .replace("{rand_q}", qNum.toString());

        let shortText = template.shortTemplate
            .replace("{country}", country === "Global Markets" ? "Global" : country);
            
        let mathBody = template.mathCalc
            .replace("{rand_val}", randInt.toString())
            .replace("{rand_rate}", randFloat);

        items.push({
          id: idAcc++,
          category: template.category,
          time: `${Math.floor(rv * 55) + 1}m ago`,
          headline: headline,
          short: shortText,
          jargon: template.jargon,
          jargonDef: template.jargonDef[level],
          mathCalc: mathBody
        });
      });
    }

    // Shuffle the 100 array so the layout order changes entirely based on the Date!
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
  }, [country, level, date]);

  // Derive unique categories from generation
  const uniqueCategories = Array.from(new Set(generatedNews.map(n => n.category)));

  return (
    <div className="bg-[#131315] min-h-screen text-[#e5e1e4] font-sans selection:bg-[#d97a53] selection:text-white">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden mix-blend-screen opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#d97a53]/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[800px] h-[800px] bg-[#533598]/20 blur-[150px] rounded-full"></div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
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

      <AnimatePresence>
        {activeArticle && (
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
                <span className="text-[#d97a53] text-xs font-bold uppercase tracking-widest ml-auto mr-6 border border-[#d97a53]/30 px-2 py-1 rounded">Date: {date}</span>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight">{activeArticle.headline}</h2>
              <p className="text-white/60 text-lg mb-8">{activeArticle.short}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#5ed9ce]"></div>
                  <h3 className="flex items-center gap-2 text-[#5ed9ce] font-bold text-lg mb-3"><BookOpen size={18}/> AI Dictionary ({level})</h3>
                  <p className="text-[#a38c84] text-xs uppercase tracking-widest mb-2 font-bold opacity-50">Explaining: {activeArticle.jargon}</p>
                  <p className="text-[#dbc1b8] text-sm leading-relaxed font-medium">{activeArticle.jargonDef}</p>
                </div>
                
                <div className="bg-gradient-to-bl from-[#d97a53]/20 to-transparent border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#d97a53]"></div>
                  <h3 className="flex items-center gap-2 text-[#d97a53] font-bold text-lg mb-3"><Calculator size={18}/> Quant & Math Breakdown</h3>
                  <p className="text-[#a38c84] text-xs uppercase tracking-widest mb-2 font-bold opacity-50">Calculation Engine Direct Output</p>
                  <p className="text-[#dbc1b8] text-sm leading-relaxed font-mono tracking-tight">{activeArticle.mathCalc}</p>
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
        <div className="flex items-center gap-2 cursor-pointer mb-5" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg className="shadow-lg rounded-[10px]" fill="none" height="36" viewBox="0 0 40 40" width="36" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#1b1b1b" height="40" rx="10" width="40"></rect>
            <path d="M12 28V12L28 28V12" stroke="#d97a53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
            <circle cx="28" cy="12" fill="#d97a53" r="3"></circle>
          </svg>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase font-sans whitespace-nowrap">Nis Finance <span className="text-[#d97a53]">Co.</span></span>
        </div>

        <div className="flex items-center gap-4 mb-5 border-b border-white/10 pb-4 px-12">
          <button onClick={() => setIsModalOpen(true)} className="text-[#a38c84] text-xs font-bold uppercase tracking-widest hover:text-white transition-all">Login</button>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#d97a53] text-[#531900] px-3 py-1 rounded-sm text-[10px] sm:text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform duration-200">Premium</button>
        </div>

        <div className="flex items-center gap-8 md:gap-16 font-sans tracking-widest font-bold text-[11px] md:text-xs uppercase">
          <a className="text-[#ffb599] hover:text-white transition-all duration-300 cursor-pointer">Market</a>
          <a className="text-[#a38c84] hover:text-white transition-all duration-300 cursor-pointer">Intelligence</a>
          <button onClick={() => setIsModalOpen(true)} className="text-[#a38c84] hover:text-[#d97a53] transition-all duration-300 cursor-pointer">Terminal</button>
        </div>
      </motion.header>

      <main className="pt-56 pb-8 px-6 max-w-[1600px] mx-auto min-h-screen">
        <section className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#533598]/20 border border-[#533598]/30 mb-8">
             <Sparkles size={14} className="text-[#d0bcff]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0bcff]">100 Connected Nodes Active</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col lg:flex-row items-center justify-center gap-4 bg-[#18181a] max-w-fit mx-auto p-2 rounded-[32px] border border-white/5 shadow-2xl flex-wrap">
            
            {/* Calendar Seed Rotation */}
            <div className="relative flex items-center px-4 md:px-6 w-full lg:w-auto h-11 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
              <Calendar size={16} className="text-[#d97a53] mr-2" />
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                title="Select Calendar Date to Rotate News Feeds"
                className="bg-transparent text-white font-bold text-xs sm:text-sm tracking-widest outline-none cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer w-full" 
              />
              <div className="absolute right-4 pointer-events-none text-[#d97a53] text-[10px]">SELECT</div>
            </div>

            <div className="w-[1px] h-6 bg-white/10 hidden lg:block"></div>

            {/* Literacy Matrix */}
            <div className="flex items-center gap-1 bg-black/40 rounded-[24px] p-1 h-11">
              <button onClick={() => setLevel("Beginner")} className={`px-4 sm:px-6 h-full rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Beginner" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Beginner</button>
              <button onClick={() => setLevel("Intermediate")} className={`px-4 sm:px-6 h-full rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Intermediate" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Intermediate</button>
              <button onClick={() => setLevel("Expert")} className={`px-4 sm:px-6 h-full rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${level === "Expert" ? "bg-[#d97a53] text-[#531900] shadow-lg shadow-[#d97a53]/20" : "text-[#a38c84] hover:text-white"}`}>Expert</button>
            </div>

            <div className="w-[1px] h-6 bg-white/10 hidden lg:block"></div>

            {/* Country Matrix */}
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

        <div className="space-y-16 mt-16">
          {uniqueCategories.map((categoryName) => {
            const categoryItems = generatedNews.filter(n => n.category === categoryName);
            if (categoryItems.length === 0) return null;

            return (
              <section key={categoryName} className="relative z-10 w-full">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-sm border border-white/10 px-4 py-1.5 rounded-full bg-white/5 font-bold text-white tracking-widest uppercase">{categoryName}</h2>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
                  <span className="text-[10px] font-mono text-[#a38c84]">{categoryItems.length} active nodes</span>
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
                      <p className="text-[10px] mt-auto pt-3 text-[#dbc1b8] opacity-60 line-clamp-2 leading-relaxed">{item.short}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
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
          <a href="#" className="hover:text-[#ffb599] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#ffb599] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#ffb599] transition-colors">Cookie Policy</a>
        </div>
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
