import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'United States';
  let date = searchParams.get('date'); 
  
  if (!date) {
    date = new Date().toISOString().split('T')[0];
  }
  
  try {
    // Explicit query ensuring financial & localized tracking
    let query = `${country} economy OR business OR finance`;
    
    // Establishing strict parameterization via Google News advanced search syntax
    const d = new Date(date);
    const nextD = new Date(d);
    nextD.setDate(d.getDate() + 2); 
    const nextDateStr = nextD.toISOString().split('T')[0];
    
    query += ` after:${date} before:${nextDateStr}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    
    // Disable caching to enforce absolute live aggregation
    const res = await fetch(rssUrl, { cache: 'no-store' });
    const xml = await res.text();
    
    const items = [];
    const rawItems = xml.split('<item>').slice(1);
    
    for (let i = 0; i < rawItems.length; i++) {
        // Enforce 100 limits as requested
        if (i >= 100) break;
      
        const raw = rawItems[i];
        const titleMatch = raw.match(/<title>(.*?)<\/title>/);
        const dateMatch = raw.match(/<pubDate>(.*?)<\/pubDate>/);
        const descMatch = raw.match(/<description>(.*?)<\/description>/);
      
        if (titleMatch) {
            let titleStr = titleMatch[1].replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
            titleStr = titleStr.replace(/<\!\[CDATA\[(.*?)\]\]>/g, '$1');
            
            const sourceSplit = titleStr.lastIndexOf(' - ');
            let source = 'Global News';
            if (sourceSplit > -1) {
                source = titleStr.substring(sourceSplit + 3);
                titleStr = titleStr.substring(0, sourceSplit);
            }
            
            let desc = "Detailed financial briefing unavailable. Proceed to AI analysis for generated extrapolation.";
            if (descMatch) {
                let cleanDesc = descMatch[1].replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ");
                cleanDesc = cleanDesc.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
                cleanDesc = cleanDesc.replace(/<\!\[CDATA\[(.*?)\]\]>/g, '$1');
                if (cleanDesc.length > 20) {
                    desc = cleanDesc.substring(0, 160) + "...";
                }
            }
            
            let timeStr = 'Today';
            if (dateMatch) {
               try {
                 const pubDate = new Date(dateMatch[1]);
                 timeStr = pubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
               } catch(e) {}
            }
            
            items.push({
                id: i.toString() + Math.random().toString(),
                headline: titleStr,
                source: source,
                time: timeStr,
                short: desc
            });
        }
    }
    
    return NextResponse.json({ news: items });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch real-time news" }, { status: 500 });
  }
}
