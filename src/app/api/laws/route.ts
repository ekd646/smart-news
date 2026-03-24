import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'Turkey';

  try {
    const query = `${country} law regulation legal reform legislation`;
    const d = new Date();
    const prevD = new Date(d);
    prevD.setDate(d.getDate() - 7);
    const dateStr = prevD.toISOString().split('T')[0];
    const nextDateStr = new Date(d.getTime() + 86400000 * 2).toISOString().split('T')[0];

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ` after:${dateStr} before:${nextDateStr}`)}&hl=en-US&gl=US&ceid=US:en`;

    const res = await fetch(rssUrl, { cache: 'no-store' });
    const xml = await res.text();

    const items: any[] = [];
    const rawItems = xml.split('<item>').slice(1);

    for (let i = 0; i < rawItems.length; i++) {
      if (i >= 60) break;

      const raw = rawItems[i];
      const titleMatch = raw.match(/<title>(.*?)<\/title>/);
      const dateMatch = raw.match(/<pubDate>(.*?)<\/pubDate>/);

      if (titleMatch) {
        let titleStr = titleMatch[1].replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        titleStr = titleStr.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');

        const sourceSplit = titleStr.lastIndexOf(' - ');
        let source = 'Legal Monitor';
        if (sourceSplit > -1) {
          source = titleStr.substring(sourceSplit + 3);
          titleStr = titleStr.substring(0, sourceSplit);
        }

        let timeStr = 'Today';
        if (dateMatch) {
          try {
            const pubDate = new Date(dateMatch[1]);
            timeStr = pubDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + pubDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } catch (e) {}
        }

        // Categorize
        const lower = titleStr.toLowerCase();
        let category = 'General Legislation';
        if (lower.includes('gdpr') || lower.includes('privacy') || lower.includes('data protection') || lower.includes('personal data')) category = 'Data & Privacy';
        else if (lower.includes('tax') || lower.includes('vat') || lower.includes('fiscal') || lower.includes('tariff') || lower.includes('customs')) category = 'Tax & Fiscal';
        else if (lower.includes('labor') || lower.includes('labour') || lower.includes('employment') || lower.includes('worker') || lower.includes('wage')) category = 'Employment Law';
        else if (lower.includes('criminal') || lower.includes('court') || lower.includes('judge') || lower.includes('sentence') || lower.includes('trial')) category = 'Criminal & Courts';
        else if (lower.includes('environment') || lower.includes('climate') || lower.includes('emission') || lower.includes('carbon') || lower.includes('green')) category = 'Environmental';
        else if (lower.includes('contract') || lower.includes('commercial') || lower.includes('business') || lower.includes('corporate') || lower.includes('merger')) category = 'Commercial & Contract';
        else if (lower.includes('regulat') || lower.includes('compliance') || lower.includes('sanction') || lower.includes('anti-money') || lower.includes('banking')) category = 'Regulatory & Compliance';
        else if (lower.includes('property') || lower.includes('real estate') || lower.includes('rent') || lower.includes('tenant') || lower.includes('landlord')) category = 'Property Law';
        else if (lower.includes('constitution') || lower.includes('parliament') || lower.includes('vote') || lower.includes('election') || lower.includes('reform')) category = 'Constitutional & Reform';

        items.push({
          id: i.toString() + Math.random().toString(),
          headline: titleStr,
          source,
          time: timeStr,
          category,
        });
      }
    }

    return NextResponse.json({ laws: items });
  } catch (error) {
    console.error('Laws fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch legal data' }, { status: 500 });
  }
}
