import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const message = formData.get('message') as string || '';
    const country = formData.get('country') as string || 'Turkey';
    const file = formData.get('file') as File | null;

    let fileContext = '';
    if (file) {
      // Read text content from uploaded files
      try {
        const text = await file.text();
        fileContext = text.substring(0, 3000); // Limit to 3000 chars for analysis
      } catch {
        fileContext = `[Uploaded file: ${file.name}, type: ${file.type}, size: ${(file.size / 1024).toFixed(1)}KB]`;
      }
    }

    // Legal knowledge base per country
    const legalDB: Record<string, { system: string; laws: string[] }> = {
      "Turkey": {
        system: "Turkish legal system based on Civil Law tradition (Continental European). Key codes: Turkish Civil Code (TMK), Turkish Commercial Code (TTK), Turkish Penal Code (TCK), Labour Law No. 4857, KVKK (Personal Data Protection Law No. 6698).",
        laws: ["KVKK Art. 5-6 (Data Processing Conditions)", "TTK Art. 18 (Commercial Enterprise)", "TCK Art. 157 (Fraud)", "İş Kanunu Art. 17 (Termination Notice)", "TBK Art. 19 (Contract Formation)"]
      },
      "Germany": {
        system: "German legal system based on Civil Law (BGB - Bürgerliches Gesetzbuch). Key legislations: BGB, HGB (Commercial Code), StGB (Criminal Code), BDSG (Federal Data Protection Act), ArbGG (Labour Courts Act).",
        laws: ["BGB §241 (Obligations)", "BGB §433 (Purchase Contract)", "BDSG §26 (Employee Data)", "HGB §1 (Merchant Definition)", "StGB §263 (Fraud)"]
      },
      "France": {
        system: "French legal system based on Civil Law tradition (Code Napoléon). Key codes: Code Civil, Code de Commerce, Code du Travail, Code Pénal, RGPD (French GDPR implementation).",
        laws: ["Code Civil Art. 1101 (Contract Definition)", "Code du Travail L1232-1 (Dismissal Procedure)", "Code Pénal Art. 313-1 (Fraud)", "Loi Informatique et Libertés", "Code de Commerce L121-1"]
      },
      "United Kingdom": {
        system: "UK operates under Common Law system with statutory law. Key acts: Consumer Rights Act 2015, Employment Rights Act 1996, Companies Act 2006, Data Protection Act 2018 (UK GDPR), Fraud Act 2006.",
        laws: ["Employment Rights Act 1996 s.86 (Notice Periods)", "Consumer Rights Act 2015 s.9 (Satisfactory Quality)", "Companies Act 2006 s.172 (Director Duties)", "Data Protection Act 2018 s.3", "Fraud Act 2006 s.2"]
      },
      "Italy": {
        system: "Italian Civil Law system based on Codice Civile. Key codes: Codice Civile, Codice Penale, Statuto dei Lavoratori (Workers' Statute), D.Lgs. 196/2003 (Privacy Code), Codice del Consumo.",
        laws: ["Codice Civile Art. 1321 (Contract)", "Statuto dei Lavoratori Art. 18 (Unfair Dismissal)", "D.Lgs 81/2015 (Employment Reform)", "Codice Penale Art. 640 (Fraud)", "D.Lgs 206/2005 (Consumer Code)"]
      },
      "Spain": {
        system: "Spanish Civil Law system. Key codes: Código Civil, Estatuto de los Trabajadores, Ley Orgánica de Protección de Datos (LOPDGDD), Código Penal, Ley de Sociedades de Capital.",
        laws: ["Código Civil Art. 1254 (Contract Formation)", "ET Art. 49 (Contract Termination)", "LOPDGDD Art. 5 (Data Principles)", "Código Penal Art. 248 (Fraud)", "LSC Art. 225 (Director Liability)"]
      },
      "Netherlands": {
        system: "Dutch Civil Law system based on Burgerlijk Wetboek (BW). Influenced by French and German law. Key: BW, Wetboek van Strafrecht, Wet bescherming persoonsgegevens, Arbeidsrecht.",
        laws: ["BW 6:162 (Tort Liability)", "BW 7:610 (Employment Contract)", "BW 3:40 (Nullity of Contracts)", "AVG/GDPR Implementation Act", "Wetboek van Strafrecht Art. 326 (Fraud)"]
      },
    };

    const countryData = legalDB[country] || {
      system: `${country} operates under European legal frameworks with EU regulation compliance. The country follows EU directives including GDPR, Consumer Protection Directives, and Employment Framework Directives.`,
      laws: ["EU GDPR (Regulation 2016/679)", "EU Consumer Rights Directive 2011/83", "EU Working Time Directive 2003/88/EC", "EU Anti-Money Laundering Directive", "EU Services Directive 2006/123/EC"]
    };

    // Build analysis
    let analysis = '';
    const query = (message + ' ' + fileContext).toLowerCase();

    if (fileContext) {
      analysis += `📄 **Document Analysis for ${country} Jurisdiction**\n\n`;
      analysis += `**Legal System:** ${countryData.system}\n\n`;

      // Check for common contract issues
      const issues: string[] = [];
      const suggestions: string[] = [];

      if (query.includes('contract') || query.includes('agreement') || query.includes('sözleşme') || fileContext.length > 100) {
        if (!query.includes('termination') && !query.includes('fesih') && !query.includes('cancellation')) {
          issues.push("⚠️ **Missing Termination Clause:** The document does not appear to contain clear termination conditions. Under " + country + " law, contracts should specify termination rights, notice periods, and consequences.");
          suggestions.push("✅ Add a termination clause specifying notice period (recommended: 30-90 days) and grounds for early termination.");
        }
        if (!query.includes('gdpr') && !query.includes('data') && !query.includes('kvkk') && !query.includes('privacy')) {
          issues.push("⚠️ **No Data Protection Reference:** Under GDPR / local data protection laws, contracts involving personal data processing MUST include data protection clauses (Art. 28 GDPR for processors).");
          suggestions.push("✅ Include a Data Processing Agreement (DPA) appendix compliant with " + country + " implementation of GDPR.");
        }
        if (!query.includes('dispute') && !query.includes('arbitration') && !query.includes('jurisdiction') && !query.includes('uyuşmazlık')) {
          issues.push("⚠️ **Missing Dispute Resolution:** No arbitration or jurisdiction clause detected. This can lead to costly jurisdictional conflicts.");
          suggestions.push("✅ Add a dispute resolution clause specifying applicable law (" + country + " law recommended) and preferred arbitration body.");
        }
        if (!query.includes('liability') && !query.includes('sorumluluk') && !query.includes('indemnif')) {
          issues.push("⚠️ **Liability Clause Absent:** No limitation of liability found. Both parties should have clear liability caps.");
          suggestions.push("✅ Define maximum liability (common: 100% of total contract value) and exclude consequential damages.");
        }
        if (!query.includes('force majeure') && !query.includes('mücbir sebep')) {
          suggestions.push("✅ Consider adding a Force Majeure clause covering unforeseeable events (pandemics, natural disasters, government actions).");
        }
      }

      if (query.includes('employ') || query.includes('iş sözleşmesi') || query.includes('çalışan') || query.includes('worker') || query.includes('salary') || query.includes('maaş')) {
        issues.push("⚠️ **Employment Law Compliance:** Employment contracts in " + country + " must comply with minimum wage regulations, maximum working hours, and mandatory social security contributions.");
        suggestions.push("✅ Verify compliance with " + country + "'s minimum notice period for termination and mandatory severance calculations.");
        suggestions.push("✅ Include probation period clause (typically 2-6 months in " + country + ") with clear performance criteria.");
      }

      if (issues.length > 0) {
        analysis += `### 🔍 Issues Detected\n${issues.join('\n\n')}\n\n`;
      } else {
        analysis += "### ✅ No Critical Issues Detected\nThe document appears to cover basic legal requirements. However, a detailed review by a licensed attorney in " + country + " is always recommended.\n\n";
      }

      if (suggestions.length > 0) {
        analysis += `### 💡 Recommendations\n${suggestions.join('\n\n')}\n\n`;
      }

      analysis += `### 📚 Applicable Legal References (${country})\n`;
      countryData.laws.forEach(law => {
        analysis += `- ${law}\n`;
      });

    } else if (message) {
      // Text-only query
      analysis += `⚖️ **Legal Analysis — ${country} Jurisdiction**\n\n`;
      analysis += `**Legal System:** ${countryData.system}\n\n`;

      if (query.includes('gdpr') || query.includes('veri') || query.includes('data') || query.includes('privacy') || query.includes('kvkk')) {
        analysis += `### Data Protection Analysis\nUnder ${country}'s data protection framework, organizations must:\n- Obtain explicit consent before processing personal data\n- Appoint a Data Protection Officer (DPO) if processing sensitive data at scale\n- Report data breaches within 72 hours to the supervisory authority\n- Provide data subjects with access, rectification, and erasure rights\n\n**Maximum Penalty:** €20 million or 4% of global annual turnover (whichever is higher)\n\n`;
      } else if (query.includes('tax') || query.includes('vergi') || query.includes('vat') || query.includes('kdv')) {
        analysis += `### Tax & Fiscal Analysis\n${country}'s tax framework requires compliance with:\n- Corporate income tax obligations\n- VAT/KDV registration and reporting\n- Transfer pricing documentation for related-party transactions\n- Digital services tax where applicable\n\n`;
      } else if (query.includes('employment') || query.includes('iş') || query.includes('çalışan') || query.includes('labor') || query.includes('işten çıkarma')) {
        analysis += `### Employment Law Analysis\nKey employment regulations in ${country}:\n- Mandatory written employment contracts\n- Maximum weekly working hours (typically 45-48 hours)\n- Minimum notice periods before termination\n- Severance pay calculations based on tenure\n- Protection against unfair dismissal\n\n`;
      } else {
        analysis += `### General Legal Guidance\nBased on your query regarding "${message.substring(0, 100)}", here is the analysis under ${country} law:\n\nThe legal framework in ${country} addresses this matter through several legislative instruments. Key considerations include:\n- Compliance with EU-harmonized regulations\n- National implementation specifics\n- Recent legislative amendments and court precedents\n\n`;
      }

      analysis += `### 📚 Relevant Legal References (${country})\n`;
      countryData.laws.forEach(law => {
        analysis += `- ${law}\n`;
      });

      analysis += `\n> ⚠️ **Disclaimer:** This AI-generated analysis is for informational purposes only and does not constitute legal advice. Always consult a licensed attorney in ${country} for specific legal matters.`;
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
