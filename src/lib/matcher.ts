import { INDUSTRY_KEYWORDS, LEGAL_AREA_KEYWORDS } from "./constants";

interface ClientProfile {
  id: string;
  industry: string;
  legalAreas: string;
}

interface LawData {
  title: string;
  summary: string | null;
  category: string | null;
}

export interface MatchResult {
  clientId: string;
  relevanceScore: number;
  matchReason: string;
  recommendation: "kontakta" | "bevaka" | "informera";
}

export function matchLawToClients(
  law: LawData,
  clients: ClientProfile[]
): MatchResult[] {
  const results: MatchResult[] = [];
  const lawText = `${law.title} ${law.summary || ""} ${law.category || ""}`.toLowerCase();

  for (const client of clients) {
    const reasons: string[] = [];
    let score = 0;

    // Match industry keywords
    const industryKeywords = INDUSTRY_KEYWORDS[client.industry] || [];
    const matchedIndustryKeywords: string[] = [];
    for (const keyword of industryKeywords) {
      if (lawText.includes(keyword.toLowerCase())) {
        matchedIndustryKeywords.push(keyword);
        score += 15;
      }
    }
    if (matchedIndustryKeywords.length > 0) {
      reasons.push(
        `Branschmatchning (${matchedIndustryKeywords.join(", ")})`
      );
    }

    // Match legal area keywords
    const clientAreas = client.legalAreas.split(",").map((a) => a.trim());
    for (const area of clientAreas) {
      const areaKeywords = LEGAL_AREA_KEYWORDS[area] || [];
      const matchedAreaKeywords: string[] = [];
      for (const keyword of areaKeywords) {
        if (lawText.includes(keyword.toLowerCase())) {
          matchedAreaKeywords.push(keyword);
          score += 10;
        }
      }
      if (matchedAreaKeywords.length > 0) {
        reasons.push(
          `Rättsområde: ${area} (${matchedAreaKeywords.join(", ")})`
        );
      }
    }

    // Cap score at 100
    score = Math.min(score, 100);

    if (score >= 10) {
      let recommendation: "kontakta" | "bevaka" | "informera";
      if (score >= 70) {
        recommendation = "kontakta";
      } else if (score >= 40) {
        recommendation = "bevaka";
      } else {
        recommendation = "informera";
      }

      results.push({
        clientId: client.id,
        relevanceScore: score,
        matchReason: reasons.join(". "),
        recommendation,
      });
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
