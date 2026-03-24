import { NextResponse } from 'next/server';

const LANG: Record<string, { code: string; name: string }> = {
  "Turkey": { code: "tr", name: "Türkçe" },
  "Germany": { code: "de", name: "Deutsch" },
  "France": { code: "fr", name: "Français" },
  "United Kingdom": { code: "en", name: "English" },
  "Italy": { code: "it", name: "Italiano" },
  "Spain": { code: "es", name: "Español" },
  "Netherlands": { code: "nl", name: "Nederlands" },
  "Switzerland": { code: "de", name: "Deutsch" },
  "Sweden": { code: "sv", name: "Svenska" },
  "Belgium": { code: "fr", name: "Français" },
  "Austria": { code: "de", name: "Deutsch" },
  "Poland": { code: "pl", name: "Polski" },
  "Norway": { code: "no", name: "Norsk" },
  "Denmark": { code: "da", name: "Dansk" },
  "Finland": { code: "fi", name: "Suomi" },
  "Ireland": { code: "en", name: "English" },
  "Portugal": { code: "pt", name: "Português" },
  "Czech Republic": { code: "cs", name: "Čeština" },
  "Romania": { code: "ro", name: "Română" },
  "Greece": { code: "el", name: "Ελληνικά" },
  "Hungary": { code: "hu", name: "Magyar" },
};

// Localized UI strings
const L: Record<string, Record<string, string>> = {
  tr: {
    docAnalysis: "Belge Analizi",
    jurisdiction: "Yargı Alanı",
    legalSystem: "Hukuk Sistemi",
    issuesDetected: "Tespit Edilen Sorunlar",
    noIssues: "Kritik Sorun Tespit Edilmedi",
    noIssuesDesc: "Belge, temel yasal gereksinimleri karşılıyor görünüyor. Ancak, detaylı bir değerlendirme için mutlaka lisanslı bir avukata danışmanız önerilir.",
    recommendations: "Öneriler",
    legalRefs: "Uygulanabilir Yasal Referanslar",
    legalAnalysis: "Hukuki Analiz",
    missingTermination: "Eksik Fesih Maddesi: Belgede net fesih koşulları bulunmuyor. Türk hukukuna göre sözleşmelerde fesih hakları, bildirim süreleri ve sonuçları belirtilmelidir.",
    addTermination: "30-90 gün bildirim süresi ve erken fesih gerekçelerini belirten bir fesih maddesi ekleyin.",
    missingData: "Veri Koruma Referansı Yok: KVKK/GDPR kapsamında, kişisel veri işleyen sözleşmelerde veri koruma maddeleri ZORUNLUDUR.",
    addData: "KVKK uyumlu bir Veri İşleme Sözleşmesi (VİS) eki ekleyin.",
    missingDispute: "Eksik Uyuşmazlık Çözümü: Tahkim veya yargı yetkisi maddesi tespit edilemedi. Bu durum maliyetli yargı çatışmalarına yol açabilir.",
    addDispute: "Uygulanacak hukuku (Türk hukuku önerilir) ve tercih edilen tahkim merciini belirten bir uyuşmazlık çözüm maddesi ekleyin.",
    missingLiability: "Sorumluluk Maddesi Eksik: Sorumluluk sınırlaması bulunamadı. Her iki tarafın da net sorumluluk üst sınırları olmalıdır.",
    addLiability: "Maksimum sorumluluk tutarını (genel uygulama: toplam sözleşme bedelinin %100'ü) tanımlayın ve dolaylı zararları kapsam dışı bırakın.",
    addForceMajeure: "Öngörülemeyen olayları (salgın, doğal afet, hükümet kararları) kapsayan Mücbir Sebep maddesi eklemeyi düşünün.",
    employmentWarning: "İş Hukuku Uyumu: Türkiye'deki iş sözleşmeleri asgari ücret düzenlemeleri, azami çalışma saatleri ve zorunlu sosyal güvenlik katkılarına uygun olmalıdır.",
    employmentNotice: "Fesih için asgari bildirim süresine ve zorunlu kıdem tazminatı hesaplamalarına uyumu doğrulayın.",
    employmentProbation: "Net performans kriterleri ile deneme süresi maddesi (genellikle 2-6 ay) ekleyin.",
    dataTitle: "Veri Koruma Analizi",
    dataBody: "veri koruma çerçevesi kapsamında kuruluşlar şunları yapmalıdır:\n- Kişisel verileri işlemeden önce açık rıza almalıdır\n- Büyük ölçekte hassas veri işleniyorsa bir Veri Koruma Görevlisi (VKG) atamalıdır\n- Veri ihlallerini 72 saat içinde denetim otoritesine bildirmelidir\n- Veri sahiplerine erişim, düzeltme ve silme hakları sağlamalıdır",
    dataMax: "Azami Ceza: 20 milyon € veya yıllık küresel cironun %4'ü (hangisi yüksekse)",
    taxTitle: "Vergi ve Mali Analiz",
    taxBody: "vergi çerçevesi şunlara uyumu gerektirir:\n- Kurumlar vergisi yükümlülükleri\n- KDV kaydı ve raporlaması\n- İlişkili taraf işlemleri için transfer fiyatlandırması\n- Dijital hizmet vergisi (varsa)",
    employmentTitle: "İş Hukuku Analizi",
    employmentBody: "temel iş hukuku düzenlemeleri:\n- Zorunlu yazılı iş sözleşmeleri\n- Haftalık azami çalışma saatleri (genellikle 45 saat)\n- Fesihten önce asgari bildirim süreleri\n- Kıdeme dayalı tazminat hesaplamaları\n- Haksız feshe karşı koruma",
    generalTitle: "Genel Hukuki Rehberlik",
    generalBody: "hukuku kapsamındaki analiz:\n\nHukuki çerçeve bu konuyu çeşitli mevzuat araçlarıyla ele almaktadır. Temel değerlendirmeler:\n- AB uyumlu düzenlemelere uyum\n- Ulusal uygulama özellikleri\n- Güncel mevzuat değişiklikleri ve içtihatlar",
    disclaimer: "Bu yapay zeka tarafından oluşturulan analiz yalnızca bilgilendirme amaçlıdır ve hukuki tavsiye niteliği taşımaz. Belirli hukuki konular için mutlaka lisanslı bir avukata danışın."
  },
  de: {
    docAnalysis: "Dokumentenanalyse",
    jurisdiction: "Rechtsgebiet",
    legalSystem: "Rechtssystem",
    issuesDetected: "Festgestellte Probleme",
    noIssues: "Keine kritischen Probleme festgestellt",
    noIssuesDesc: "Das Dokument scheint die grundlegenden rechtlichen Anforderungen zu erfüllen. Eine detaillierte Prüfung durch einen zugelassenen Anwalt wird jedoch empfohlen.",
    recommendations: "Empfehlungen",
    legalRefs: "Anwendbare Rechtsgrundlagen",
    legalAnalysis: "Rechtsanalyse",
    missingTermination: "Fehlende Kündigungsklausel: Das Dokument enthält keine klaren Kündigungsbedingungen. Nach deutschem Recht sollten Verträge Kündigungsrechte, Fristen und Folgen festlegen.",
    addTermination: "Fügen Sie eine Kündigungsklausel mit Kündigungsfrist (empfohlen: 30-90 Tage) und Gründen für eine vorzeitige Kündigung hinzu.",
    missingData: "Kein Datenschutzverweis: Nach DSGVO/BDSG müssen Verträge mit Verarbeitung personenbezogener Daten Datenschutzklauseln enthalten (Art. 28 DSGVO).",
    addData: "Fügen Sie einen DSGVO-konformen Auftragsverarbeitungsvertrag (AVV) als Anlage bei.",
    missingDispute: "Fehlende Streitbeilegung: Keine Schlichtungs- oder Gerichtsstandsklausel erkannt. Dies kann zu kostspieligen Zuständigkeitskonflikten führen.",
    addDispute: "Fügen Sie eine Streitbeilegungsklausel hinzu, die das anwendbare Recht (deutsches Recht empfohlen) und die bevorzugte Schiedsstelle festlegt.",
    missingLiability: "Haftungsklausel fehlt: Keine Haftungsbegrenzung gefunden. Beide Parteien sollten klare Haftungsobergrenzen haben.",
    addLiability: "Definieren Sie die maximale Haftung (üblich: 100% des Gesamtvertragswerts) und schließen Sie Folgeschäden aus.",
    addForceMajeure: "Erwägen Sie eine Klausel über höhere Gewalt für unvorhersehbare Ereignisse (Pandemien, Naturkatastrophen, staatliche Maßnahmen).",
    employmentWarning: "Arbeitsrechtskonformität: Arbeitsverträge müssen den Mindestlohnregelungen, Arbeitszeitgrenzen und Sozialversicherungspflichten entsprechen.",
    employmentNotice: "Überprüfen Sie die Einhaltung der Mindestkündigungsfristen und gesetzlichen Abfindungsberechnungen.",
    employmentProbation: "Fügen Sie eine Probezeit-Klausel (typisch 2-6 Monate) mit klaren Leistungskriterien hinzu.",
    dataTitle: "Datenschutzanalyse",
    dataBody: "Datenschutzrahmen müssen Organisationen:\n- Ausdrückliche Einwilligung vor der Verarbeitung personenbezogener Daten einholen\n- Einen Datenschutzbeauftragten (DSB) ernennen bei umfangreicher Verarbeitung\n- Datenschutzverletzungen innerhalb von 72 Stunden der Aufsichtsbehörde melden\n- Betroffenen Zugang, Berichtigung und Löschung gewähren",
    dataMax: "Höchststrafe: 20 Millionen € oder 4% des weltweiten Jahresumsatzes",
    taxTitle: "Steuer- und Fiskalanalyse",
    taxBody: "Steuerrahmen erfordert die Einhaltung von:\n- Körperschaftssteuerpflichten\n- Umsatzsteuerregistrierung und -meldung\n- Verrechnungspreisdokumentation\n- Digitalsteuer (falls zutreffend)",
    employmentTitle: "Arbeitsrechtsanalyse",
    employmentBody: "wichtige arbeitsrechtliche Regelungen:\n- Pflicht zum schriftlichen Arbeitsvertrag\n- Wöchentliche Höchstarbeitszeit (typisch 40-48 Stunden)\n- Mindestkündigungsfristen\n- Abfindungsberechnung nach Betriebszugehörigkeit\n- Kündigungsschutz",
    generalTitle: "Allgemeine Rechtsberatung",
    generalBody: "Recht:\n\nDer Rechtsrahmen befasst sich mit dieser Angelegenheit durch verschiedene Gesetzgebungsinstrumente. Wichtige Überlegungen:\n- Einhaltung EU-harmonisierter Vorschriften\n- Nationale Umsetzungsbesonderheiten\n- Aktuelle Gesetzesänderungen und Rechtsprechung",
    disclaimer: "Diese KI-generierte Analyse dient nur zu Informationszwecken und stellt keine Rechtsberatung dar. Konsultieren Sie immer einen zugelassenen Anwalt."
  },
  fr: {
    docAnalysis: "Analyse du Document",
    jurisdiction: "Juridiction",
    legalSystem: "Système Juridique",
    issuesDetected: "Problèmes Détectés",
    noIssues: "Aucun problème critique détecté",
    noIssuesDesc: "Le document semble couvrir les exigences légales de base. Cependant, un examen détaillé par un avocat agréé est recommandé.",
    recommendations: "Recommandations",
    legalRefs: "Références Juridiques Applicables",
    legalAnalysis: "Analyse Juridique",
    missingTermination: "Clause de résiliation manquante: Aucune condition de résiliation claire n'a été trouvée. Les contrats doivent préciser les droits de résiliation, les délais de préavis et les conséquences.",
    addTermination: "Ajoutez une clause de résiliation avec un préavis (recommandé: 30-90 jours) et les motifs de résiliation anticipée.",
    missingData: "Aucune référence à la protection des données: Conformément au RGPD, les contrats impliquant le traitement de données personnelles DOIVENT inclure des clauses de protection des données.",
    addData: "Incluez un accord de traitement des données (DPA) conforme au RGPD.",
    missingDispute: "Résolution des litiges manquante: Aucune clause d'arbitrage ni de juridiction détectée.",
    addDispute: "Ajoutez une clause de résolution des litiges précisant le droit applicable (droit français recommandé) et l'organisme d'arbitrage.",
    missingLiability: "Clause de responsabilité absente: Aucune limitation de responsabilité trouvée.",
    addLiability: "Définissez la responsabilité maximale et excluez les dommages indirects.",
    addForceMajeure: "Envisagez une clause de force majeure couvrant les événements imprévisibles.",
    employmentWarning: "Conformité au droit du travail: Les contrats de travail doivent respecter le SMIC, les heures de travail maximales et les cotisations sociales obligatoires.",
    employmentNotice: "Vérifiez la conformité avec les délais de préavis minimaux et les calculs d'indemnités de licenciement.",
    employmentProbation: "Incluez une clause de période d'essai (2-6 mois) avec des critères de performance clairs.",
    dataTitle: "Analyse de la Protection des Données",
    dataBody: "cadre de protection des données, les organisations doivent:\n- Obtenir un consentement explicite avant le traitement\n- Désigner un DPO pour le traitement à grande échelle\n- Signaler les violations dans les 72 heures\n- Fournir les droits d'accès, de rectification et d'effacement",
    dataMax: "Sanction maximale: 20 millions € ou 4% du chiffre d'affaires annuel mondial",
    taxTitle: "Analyse Fiscale",
    taxBody: "cadre fiscal exige:\n- Obligations d'impôt sur les sociétés\n- Enregistrement et déclaration de TVA\n- Documentation des prix de transfert\n- Taxe sur les services numériques (le cas échéant)",
    employmentTitle: "Analyse du Droit du Travail",
    employmentBody: "réglementations clés du travail:\n- Contrats de travail écrits obligatoires\n- Heures de travail hebdomadaires maximales (35-48 heures)\n- Délais de préavis minimaux avant licenciement\n- Calculs d'indemnités basés sur l'ancienneté\n- Protection contre le licenciement abusif",
    generalTitle: "Orientation Juridique Générale",
    generalBody: "droit:\n\nLe cadre juridique traite cette question à travers plusieurs instruments législatifs. Considérations clés:\n- Conformité aux réglementations harmonisées UE\n- Spécificités de mise en œuvre nationale\n- Amendements législatifs et jurisprudence récents",
    disclaimer: "Cette analyse générée par IA est à titre informatif uniquement et ne constitue pas un avis juridique. Consultez toujours un avocat agréé."
  },
  en: {
    docAnalysis: "Document Analysis",
    jurisdiction: "Jurisdiction",
    legalSystem: "Legal System",
    issuesDetected: "Issues Detected",
    noIssues: "No Critical Issues Detected",
    noIssuesDesc: "The document appears to cover basic legal requirements. However, a detailed review by a licensed attorney is recommended.",
    recommendations: "Recommendations",
    legalRefs: "Applicable Legal References",
    legalAnalysis: "Legal Analysis",
    missingTermination: "Missing Termination Clause: No clear termination conditions found. Contracts should specify termination rights, notice periods, and consequences.",
    addTermination: "Add a termination clause specifying notice period (recommended: 30-90 days) and grounds for early termination.",
    missingData: "No Data Protection Reference: Under GDPR/local data laws, contracts involving personal data processing MUST include data protection clauses.",
    addData: "Include a Data Processing Agreement (DPA) appendix compliant with GDPR.",
    missingDispute: "Missing Dispute Resolution: No arbitration or jurisdiction clause detected.",
    addDispute: "Add a dispute resolution clause specifying applicable law and preferred arbitration body.",
    missingLiability: "Liability Clause Absent: No limitation of liability found. Both parties should have clear liability caps.",
    addLiability: "Define maximum liability (common: 100% of total contract value) and exclude consequential damages.",
    addForceMajeure: "Consider adding a Force Majeure clause covering unforeseeable events (pandemics, natural disasters, government actions).",
    employmentWarning: "Employment Law Compliance: Employment contracts must comply with minimum wage regulations, maximum working hours, and mandatory social security contributions.",
    employmentNotice: "Verify compliance with minimum notice period for termination and mandatory severance calculations.",
    employmentProbation: "Include probation period clause (typically 2-6 months) with clear performance criteria.",
    dataTitle: "Data Protection Analysis",
    dataBody: "data protection framework, organizations must:\n- Obtain explicit consent before processing personal data\n- Appoint a Data Protection Officer (DPO) if processing at scale\n- Report data breaches within 72 hours\n- Provide data subjects with access, rectification, and erasure rights",
    dataMax: "Maximum Penalty: €20 million or 4% of global annual turnover (whichever is higher)",
    taxTitle: "Tax & Fiscal Analysis",
    taxBody: "tax framework requires compliance with:\n- Corporate income tax obligations\n- VAT registration and reporting\n- Transfer pricing documentation\n- Digital services tax where applicable",
    employmentTitle: "Employment Law Analysis",
    employmentBody: "key employment regulations:\n- Mandatory written employment contracts\n- Maximum weekly working hours (typically 40-48 hours)\n- Minimum notice periods before termination\n- Severance pay calculations based on tenure\n- Protection against unfair dismissal",
    generalTitle: "General Legal Guidance",
    generalBody: "law:\n\nThe legal framework addresses this matter through several legislative instruments. Key considerations include:\n- Compliance with EU-harmonized regulations\n- National implementation specifics\n- Recent legislative amendments and court precedents",
    disclaimer: "This AI-generated analysis is for informational purposes only and does not constitute legal advice. Always consult a licensed attorney for specific legal matters."
  }
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const message = formData.get('message') as string || '';
    const country = formData.get('country') as string || 'Turkey';
    const file = formData.get('file') as File | null;

    const langInfo = LANG[country] || { code: "en", name: "English" };
    const t = L[langInfo.code] || L["en"];

    let fileContext = '';
    if (file) {
      try {
        const text = await file.text();
        fileContext = text.substring(0, 3000);
      } catch {
        fileContext = `[Uploaded file: ${file.name}, type: ${file.type}, size: ${(file.size / 1024).toFixed(1)}KB]`;
      }
    }

    const legalDB: Record<string, { system: string; laws: string[] }> = {
      "Turkey": {
        system: "Türk hukuk sistemi, Kıta Avrupası Medeni Hukuk geleneğine dayanmaktadır. Temel kanunlar: Türk Medeni Kanunu (TMK), Türk Ticaret Kanunu (TTK), Türk Ceza Kanunu (TCK), 4857 sayılı İş Kanunu, 6698 sayılı KVKK.",
        laws: ["KVKK Md. 5-6 (Veri İşleme Şartları)", "TTK Md. 18 (Ticari İşletme)", "TCK Md. 157 (Dolandırıcılık)", "İş Kanunu Md. 17 (Fesih Bildirimi)", "TBK Md. 19 (Sözleşme Kurulması)"]
      },
      "Germany": {
        system: "Das deutsche Rechtssystem basiert auf dem Bürgerlichen Gesetzbuch (BGB). Weitere wichtige Gesetze: HGB, StGB, BDSG, ArbGG.",
        laws: ["BGB §241 (Schuldverhältnisse)", "BGB §433 (Kaufvertrag)", "BDSG §26 (Beschäftigtendaten)", "HGB §1 (Kaufmannsbegriff)", "StGB §263 (Betrug)"]
      },
      "France": {
        system: "Le système juridique français repose sur la tradition civiliste (Code Napoléon). Codes clés: Code Civil, Code de Commerce, Code du Travail, Code Pénal, RGPD.",
        laws: ["Code Civil Art. 1101 (Définition du contrat)", "Code du Travail L1232-1 (Procédure de licenciement)", "Code Pénal Art. 313-1 (Escroquerie)", "Loi Informatique et Libertés", "Code de Commerce L121-1"]
      },
      "United Kingdom": {
        system: "The UK operates under a Common Law system with statutory law. Key acts: Consumer Rights Act 2015, Employment Rights Act 1996, Companies Act 2006, Data Protection Act 2018.",
        laws: ["Employment Rights Act 1996 s.86", "Consumer Rights Act 2015 s.9", "Companies Act 2006 s.172", "Data Protection Act 2018 s.3", "Fraud Act 2006 s.2"]
      },
      "Italy": {
        system: "Il sistema giuridico italiano si basa sul Codice Civile. Codici chiave: Codice Civile, Codice Penale, Statuto dei Lavoratori, D.Lgs. 196/2003, Codice del Consumo.",
        laws: ["Codice Civile Art. 1321", "Statuto dei Lavoratori Art. 18", "D.Lgs 81/2015", "Codice Penale Art. 640", "D.Lgs 206/2005"]
      },
      "Spain": {
        system: "El sistema jurídico español es de Derecho Civil. Códigos clave: Código Civil, Estatuto de los Trabajadores, LOPDGDD, Código Penal, Ley de Sociedades de Capital.",
        laws: ["Código Civil Art. 1254", "ET Art. 49", "LOPDGDD Art. 5", "Código Penal Art. 248", "LSC Art. 225"]
      },
      "Netherlands": {
        system: "Het Nederlandse rechtssysteem is gebaseerd op het Burgerlijk Wetboek (BW). Belangrijke wetten: BW, Wetboek van Strafrecht, AVG, Arbeidsrecht.",
        laws: ["BW 6:162 (Onrechtmatige daad)", "BW 7:610 (Arbeidsovereenkomst)", "BW 3:40 (Nietigheid)", "AVG/GDPR Uitvoeringswet", "WvSr Art. 326"]
      },
    };

    const countryData = legalDB[country] || {
      system: `${country} operates under European legal frameworks with EU regulation compliance.`,
      laws: ["EU GDPR (Regulation 2016/679)", "EU Consumer Rights Directive 2011/83", "EU Working Time Directive 2003/88/EC"]
    };

    let analysis = '';
    const query = (message + ' ' + fileContext).toLowerCase();

    if (fileContext) {
      analysis += `📄 **${t.docAnalysis} — ${country} ${t.jurisdiction}**\n\n`;
      analysis += `**${t.legalSystem}:** ${countryData.system}\n\n`;

      const issues: string[] = [];
      const suggestions: string[] = [];

      if (query.includes('contract') || query.includes('agreement') || query.includes('sözleşme') || query.includes('vertrag') || query.includes('contrat') || query.includes('contratto') || fileContext.length > 100) {
        if (!query.includes('termination') && !query.includes('fesih') && !query.includes('kündigung') && !query.includes('résiliation')) {
          issues.push(`⚠️ **${t.missingTermination}**`);
          suggestions.push(`✅ ${t.addTermination}`);
        }
        if (!query.includes('gdpr') && !query.includes('data') && !query.includes('kvkk') && !query.includes('dsgvo') && !query.includes('rgpd') && !query.includes('veri')) {
          issues.push(`⚠️ **${t.missingData}**`);
          suggestions.push(`✅ ${t.addData}`);
        }
        if (!query.includes('dispute') && !query.includes('arbitration') && !query.includes('uyuşmazlık') && !query.includes('streit') && !query.includes('litige')) {
          issues.push(`⚠️ **${t.missingDispute}**`);
          suggestions.push(`✅ ${t.addDispute}`);
        }
        if (!query.includes('liability') && !query.includes('sorumluluk') && !query.includes('haftung') && !query.includes('responsabilité')) {
          issues.push(`⚠️ **${t.missingLiability}**`);
          suggestions.push(`✅ ${t.addLiability}`);
        }
        if (!query.includes('force majeure') && !query.includes('mücbir sebep') && !query.includes('höhere gewalt')) {
          suggestions.push(`✅ ${t.addForceMajeure}`);
        }
      }

      if (query.includes('employ') || query.includes('iş sözleşmesi') || query.includes('çalışan') || query.includes('worker') || query.includes('arbeit') || query.includes('travail') || query.includes('maaş') || query.includes('salary') || query.includes('gehalt')) {
        issues.push(`⚠️ **${t.employmentWarning}**`);
        suggestions.push(`✅ ${t.employmentNotice}`);
        suggestions.push(`✅ ${t.employmentProbation}`);
      }

      if (issues.length > 0) {
        analysis += `### 🔍 ${t.issuesDetected}\n${issues.join('\n\n')}\n\n`;
      } else {
        analysis += `### ✅ ${t.noIssues}\n${t.noIssuesDesc}\n\n`;
      }

      if (suggestions.length > 0) {
        analysis += `### 💡 ${t.recommendations}\n${suggestions.join('\n\n')}\n\n`;
      }

      analysis += `### 📚 ${t.legalRefs} (${country})\n`;
      countryData.laws.forEach(law => { analysis += `- ${law}\n`; });

    } else if (message) {
      analysis += `⚖️ **${t.legalAnalysis} — ${country} ${t.jurisdiction}**\n\n`;
      analysis += `**${t.legalSystem}:** ${countryData.system}\n\n`;

      if (query.includes('gdpr') || query.includes('veri') || query.includes('data') || query.includes('privacy') || query.includes('kvkk') || query.includes('dsgvo') || query.includes('rgpd') || query.includes('datenschutz')) {
        analysis += `### ${t.dataTitle}\n${country} ${t.dataBody}\n\n**${t.dataMax}**\n\n`;
      } else if (query.includes('tax') || query.includes('vergi') || query.includes('vat') || query.includes('kdv') || query.includes('steuer') || query.includes('impôt') || query.includes('tva')) {
        analysis += `### ${t.taxTitle}\n${country} ${t.taxBody}\n\n`;
      } else if (query.includes('employment') || query.includes('iş') || query.includes('çalışan') || query.includes('labor') || query.includes('işten') || query.includes('arbeit') || query.includes('travail') || query.includes('lavoro')) {
        analysis += `### ${t.employmentTitle}\n${country} ${t.employmentBody}\n\n`;
      } else {
        analysis += `### ${t.generalTitle}\n${country} ${t.generalBody}\n\n`;
      }

      analysis += `### 📚 ${t.legalRefs} (${country})\n`;
      countryData.laws.forEach(law => { analysis += `- ${law}\n`; });

      analysis += `\n> ⚠️ **${t.disclaimer}**`;
    }

    return NextResponse.json({ analysis, language: langInfo.name });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
