export interface RiksdagenDocument {
  dok_id: string;
  beteckning: string;
  titel: string;
  notis?: string;
  summary?: string;
  organ?: string;
  datum: string;
  publicerad: string;
  dokument_url_html?: string;
}

interface RiksdagenResponse {
  dokumentlista: {
    "@sidor": string;
    dokument?: RiksdagenDocument[];
  };
}

export interface ParsedLaw {
  riksdagenId: string;
  designation: string;
  title: string;
  summary: string | null;
  category: string | null;
  documentUrl: string | null;
  publishedDate: Date;
}

export async function fetchNewLaws(fromDate: string): Promise<ParsedLaw[]> {
  const allLaws: ParsedLaw[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = `https://data.riksdagen.se/dokumentlista/?doktyp=sfs&from=${fromDate}&utformat=json&a=s&p=${page}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Riksdagen API error: ${response.status}`);
    }

    const data: RiksdagenResponse = await response.json();
    totalPages = parseInt(data.dokumentlista["@sidor"] || "1", 10);

    const docs = data.dokumentlista.dokument;
    if (!docs || docs.length === 0) break;

    for (const doc of docs) {
      allLaws.push({
        riksdagenId: doc.dok_id,
        designation: doc.beteckning,
        title: doc.titel,
        summary: doc.notis || doc.summary || null,
        category: doc.organ || null,
        documentUrl: doc.dokument_url_html || null,
        publishedDate: new Date(doc.datum),
      });
    }

    page++;
  } while (page <= totalPages);

  return allLaws;
}
