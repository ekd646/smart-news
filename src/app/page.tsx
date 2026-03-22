import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Background Orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orb-peach"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[800px] h-[800px] bg-orb-violet"></div>
      </div>

      {/* Shared Component: TopNavBar (Centered Layout) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 py-2 gap-8">
        <nav className="bg-[#131315]/40 backdrop-blur-xl rounded-full mt-4 max-w-fit mx-auto border border-white/10 flex items-center px-6 py-2 gap-8 shadow-[0_0_40px_rgba(208,188,255,0.08)]">
          {/* Brand Identity */}
          <div className="flex items-center gap-2">
            <svg className="shadow-md rounded-[10px]" fill="none" height="32" viewBox="0 0 40 40" width="32" xmlns="http://www.w3.org/2000/svg">
              <rect fill="#1b1b1b" height="40" rx="10" width="40"></rect>
              <path d="M12 28V12L28 28V12" stroke="#d97a53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              <circle cx="28" cy="12" fill="#d97a53" r="3"></circle>
            </svg>
            <span className="text-xl font-bold tracking-tighter text-white uppercase font-headline">Nis Finance <span className="text-[#d97a53]">Co.</span></span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 font-manrope tracking-tight font-medium text-sm">
            <a className="text-[#ffb599] font-bold hover:text-white transition-all duration-300" href="#">Market</a>
            <a className="text-[#a38c84] hover:text-white hover:bg-white/5 px-2 py-1 rounded transition-all duration-300" href="#">Intelligence</a>
            <a className="text-[#a38c84] hover:text-white hover:bg-white/5 px-2 py-1 rounded transition-all duration-300" href="#">Terminal</a>
          </div>

          {/* Trailing Actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-[#a38c84] hover:text-white transition-all">
              <span className="material-symbols-outlined text-[18px]">language</span>
            </button>
            <button className="text-[#a38c84] text-sm font-medium hover:text-white transition-all">Login</button>
            <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-sm text-sm font-bold uppercase tracking-wider scale-95 hover:scale-100 transition-transform duration-200">
              Premium
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 border border-secondary-container/30 mb-6">
            <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim font-label">V3.0 Intelligence Engine Active</span>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-white max-w-4xl mx-auto mb-8 leading-[1.1]">
            Global Markets, Decoded by <span className="text-primary">AI</span> in Real-Time
          </h1>

          {/* Literacy Level Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-surface-container-low p-1.5 rounded-full border border-outline-variant/20 flex gap-1">
              <button className="px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-outline hover:text-on-surface transition-all">Beginner</button>
              <button className="px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20 transition-all">Intermediate</button>
              <button className="px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-outline hover:text-on-surface transition-all">Expert</button>
            </div>
          </div>
        </section>

        {/* AI News Feed (Bento Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main News Card (Large) */}
          <div className="md:col-span-8 glass-card rounded-lg p-8 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <svg className="overflow-visible" height="60" viewBox="0 0 120 60" width="120">
                <path className="drop-shadow-[0_0_8px_rgba(94,217,206,0.6)]" d="M0 50 Q 15 45, 30 30 T 60 40 T 90 10 T 120 20" fill="none" stroke="#5ed9ce" strokeWidth="3"></path>
              </svg>
            </div>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-tertiary-container/20 text-tertiary text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">Macro Strategy</span>
                <span className="text-outline text-[10px] font-medium tracking-widest uppercase">4m ago</span>
              </div>
              <h2 className="font-headline text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">Yield Curve Inversion: Fed's Next Move Predicted by LLM Clusters</h2>
              <p className="text-on-surface-variant font-body leading-relaxed mb-8 max-w-2xl">
                Proprietary analysis indicates a 78% probability of a policy pivot within Q3. AI sentiment across 4,000 central bank documents suggests a cooling hawkishness not yet priced into swap markets.
              </p>
              <div className="mt-auto flex items-center gap-4">
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-primary font-bold text-sm px-4 py-2 rounded-sm transition-all">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  Read AI Summary
                </button>
                <span className="text-outline text-xs">8 min read • Technical Analysis</span>
              </div>
            </div>
          </div>

          {/* Side Card 1 */}
          <div className="md:col-span-4 glass-card rounded-lg p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-error-container/20 text-error text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">Crypto</span>
              <svg className="overflow-visible" height="30" viewBox="0 0 60 30" width="60">
                <path d="M0 5 Q 15 25, 30 20 T 60 28" fill="none" stroke="#ffb4ab" strokeWidth="2"></path>
              </svg>
            </div>
            <h3 className="font-headline text-xl font-bold text-white mb-3">Liquidity Crunch in Altcoin Derivatives</h3>
            <p className="text-on-surface-variant text-sm font-body mb-6 line-clamp-2">AI detected anomalous wallet flows suggesting a massive deleveraging event on decentralized exchanges.</p>
            <button className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1 mt-auto hover:gap-2 transition-all">
              Full Report <span className="material-symbols-outlined translate-y-[2px] text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Bottom Row: Three Cards */}
          <div className="md:col-span-4 glass-card rounded-lg p-6">
            <span className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Tech Sector</span>
            <h3 className="font-headline text-lg font-bold text-white mb-2 leading-snug">Semiconductor Supply Chain Resiliency Index Drops</h3>
            <p className="text-on-surface-variant text-sm font-body line-clamp-2 mb-4">Neural networks mapping global shipping routes flag a potential bottleneck in Taiwan strait logistics.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-tertiary font-mono text-xs">+1.24% AI Accuracy</span>
              <span className="material-symbols-outlined text-outline translate-y-[2px] text-[18px]">bookmark</span>
            </div>
          </div>

          <div className="md:col-span-4 glass-card rounded-lg p-6 border-l-2 border-l-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Live Pulse</span>
            </div>
            <h3 className="font-headline text-lg font-bold text-white mb-2 leading-snug">Energy Markets React to Sudden Pipeline Maintenance</h3>
            <p className="text-on-surface-variant text-sm font-body line-clamp-2">Natural gas futures showing 12% volatility spike in immediate aftermath of algorithmic news scraping.</p>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
              <span className="material-symbols-outlined translate-y-[2px] text-primary text-[18px]">bolt</span>
              <span className="text-xs text-on-surface-variant">Instant AI Summary Available</span>
            </div>
          </div>

          <div className="md:col-span-4 glass-card rounded-lg p-6 bg-secondary-container/10">
            <span className="text-on-secondary-container text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Institutional Flow</span>
            <h3 className="font-headline text-lg font-bold text-white mb-2 leading-snug">Dark Pool Activity Spikes in Big Tech</h3>
            <p className="text-on-surface-variant text-sm font-body line-clamp-2">Unusual institutional accumulation patterns identified by pattern-recognition models in the last 2 hours.</p>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex -space-x-2">
                <img alt="User avatar" className="w-6 h-6 rounded-full border border-surface" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=32&h=32" />
                <img alt="User avatar" className="w-6 h-6 rounded-full border border-surface" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=32&h=32" />
              </div>
              <span className="text-[10px] text-outline">12 analysts tracking</span>
            </div>
          </div>

        </section>

        {/* Signature Component: AI Pulse Indicator (Floating) */}
        <div className="fixed bottom-24 right-8 flex items-center gap-3 bg-surface-container-highest/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/5 shadow-2xl">
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-primary rounded-full shadow-[0_0_10px_rgba(217,122,83,0.8)]"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">AI Pulse Live</span>
            <span className="text-[9px] text-primary-fixed-dim">Processing 42.1M nodes/sec</span>
          </div>
        </div>
      </main>

      {/* Shared Component: BottomNavBar (Mobile Responsive) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-[#131315]/80 backdrop-blur-lg border-t border-white/5 font-manrope text-[10px] uppercase tracking-widest">
        <a className="flex flex-col items-center justify-center text-[#ffb599] font-black" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span>Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#55433c] hover:text-[#d97a53] transition-transform" href="#">
          <span className="material-symbols-outlined">notifications</span>
          <span>Alerts</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#55433c] hover:text-[#d97a53] transition-transform" href="#">
          <span className="material-symbols-outlined">auto_awesome</span>
          <span>AI Pulse</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#55433c] hover:text-[#d97a53] transition-transform" href="#">
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </a>
      </nav>

      {/* SVG Gradients for Sparklines */}
      <svg height="0" width="0">
        <defs>
          <linearGradient id="gradient-up" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#5ed9ce" stopOpacity="0.3"></stop>
            <stop offset="100%" stopColor="#5ed9ce" stopOpacity="0"></stop>
          </linearGradient>
          <linearGradient id="gradient-down" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.3"></stop>
            <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
