import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center sticky top-0 z-50">
        {/* Center: Minimalist Logo */}
        <a href="#" className="flex items-center justify-center gap-3 group">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-105 transition-transform shadow-md rounded-[10px]">
                <rect width="40" height="40" rx="10" fill="#1b1b1b" />
                <path d="M12 28V12L28 28V12" stroke="#d97a53" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="28" cy="12" r="3" fill="#d97a53" />
            </svg>
            <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                Nis Finance <span style={{ color: '#d97a53' }}>Co.</span>
            </div>
        </a>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
        <div className="mb-14 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-[#4a2b8e]">
                Dünya Piyasaları, <span style={{ color: '#d97a53' }}>Sizin Dilinizde.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Karmaşık finansal terimleri sizin yatırım bilginize göre saniyeler içinde basitleştiren (veya uzman seviyesine çeken) yapay zeka destekli ilk medya ağı.
            </p>
        </div>

        {/* Literacy Level Selector (The Core SaaS Feature) */}
        <div className="flex justify-center mb-16">
            <div className="inline-flex bg-white rounded-full p-1.5 shadow border border-gray-200">
                <button className="px-6 py-2.5 rounded-full text-sm font-extrabold bg-[#4a2b8e] text-white shadow hover:opacity-90 transition-opacity">
                    Başlangıç (Acemi)
                </button>
                <button className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    Orta Seviye
                </button>
                <button className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    Uzman
                </button>
            </div>
        </div>

        {/* Mock News Feed Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mock Article 1 */}
            <article className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 text-[11px] font-bold bg-orange-100 text-[#d97a53] rounded-full uppercase tracking-wider">
                        FED Faiz Kararı
                    </span>
                    <span className="text-xs font-bold text-gray-400">2 Saat Önce</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#4a2b8e] transition-colors">
                    Amerika Merkez Bankası (FED) faizleri artırdı. Bu benim cüzdanımı nasıl etkiler?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6 font-body">
                    Faiz arttığında, bankadan borç almak (kredi çekmek) zorlaşır. Parası olan insanlar ise riskli yatırımlar yapmak yerine parasını garanti faize yatırır. Bu yüzden borsa veya kripto paralarda genel olarak bir düşüş beklenir...
                </p>
                <div className="flex justify-between items-center text-sm font-extrabold text-[#d97a53]">
                    <span className="bg-[#f7f5f2] px-3 py-1 text-[#4a2b8e] rounded-md">Yapay Zeka Özeti</span>
                    <span className="flex items-center gap-1 group-hover:underline">Detaylı Oku &rarr;</span>
                </div>
            </article>

            {/* Mock Article 2 */}
            <article className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 text-[11px] font-bold bg-purple-100 text-[#4a2b8e] rounded-full uppercase tracking-wider">
                        Kripto Piyasaları
                    </span>
                    <span className="text-xs font-bold text-gray-400">4 Saat Önce</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#4a2b8e] transition-colors">
                    Bitcoin Halving (Yarılanma) yaklaşıyor. Kripto borsası neden çalkantılı?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6 font-body">
                    Halving olayı, Bitcoin üreten madencilerin aldığı ödülün yarı yarıya düşmesidir. Bu da yeni üretilen Bitcoin sayısını azaltır. Altın gibi nadirleşen şeylerin genelde değeri artar ama piyasadaki panik...
                </p>
                <div className="flex justify-between items-center text-sm font-extrabold text-[#d97a53]">
                    <span className="bg-[#f7f5f2] px-3 py-1 text-[#4a2b8e] rounded-md">Yapay Zeka Özeti</span>
                    <span className="flex items-center gap-1 group-hover:underline">Detaylı Oku &rarr;</span>
                </div>
            </article>
        </div>
      </main>
    </div>
  );
}
