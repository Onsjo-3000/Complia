export const INDUSTRIES = [
  { value: "bygg", label: "Bygg & Fastighet" },
  { value: "finans", label: "Finans & Bank" },
  { value: "halsa", label: "Hälso- & Sjukvård" },
  { value: "tech", label: "IT & Teknik" },
  { value: "handel", label: "Handel & E-handel" },
  { value: "transport", label: "Transport & Logistik" },
  { value: "energi", label: "Energi & Miljö" },
  { value: "utbildning", label: "Utbildning" },
  { value: "livsmedel", label: "Livsmedel" },
  { value: "tillverkning", label: "Tillverkning & Industri" },
] as const;

export const LEGAL_AREAS = [
  { value: "arbetsratt", label: "Arbetsrätt" },
  { value: "skatteratt", label: "Skatterätt" },
  { value: "miljoratt", label: "Miljörätt" },
  { value: "bolagsratt", label: "Bolagsrätt" },
  { value: "dataskydd", label: "Dataskydd & GDPR" },
  { value: "konsumentratt", label: "Konsumenträtt" },
  { value: "fastighetsratt", label: "Fastighetsrätt" },
  { value: "straffratt", label: "Straffrätt" },
  { value: "upphandling", label: "Offentlig upphandling" },
  { value: "immaterialratt", label: "Immaterialrätt" },
] as const;

export const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  bygg: [
    "bygglov", "plan- och bygg", "bostadsrätt", "fastighet", "hyresrätt",
    "byggnorm", "entreprenad", "bostadsförmedling", "samhällsplanering",
    "arkitektur", "byggherre", "marklov", "detaljplan", "rivningslov",
  ],
  finans: [
    "bank", "kredit", "penningtvätt", "värdepapper", "försäkring",
    "finansiell", "bokföring", "revision", "kapitalkrav", "betaltjänst",
    "fond", "investering", "kreditinstitut", "finansinspektion",
  ],
  halsa: [
    "hälso- och sjukvård", "patient", "läkemedel", "medicinteknisk",
    "vårdgivare", "tandvård", "apoteksverksamhet", "smittskydd",
    "biobank", "organ", "transplantation", "psykiatrisk",
  ],
  tech: [
    "elektronisk kommunikation", "personuppgift", "dataskydd", "digital",
    "informationssäkerhet", "cybersäkerhet", "artificiell intelligens",
    "programvara", "telekommunikation", "internet", "molntjänst",
  ],
  handel: [
    "konsument", "marknadsföring", "e-handel", "distansavtal",
    "produktsäkerhet", "prisinformation", "handelsbolag", "import",
    "export", "tull", "varumärke", "reklam",
  ],
  transport: [
    "transport", "trafikförordning", "körkort", "fordon", "järnväg",
    "luftfart", "sjöfart", "godstransport", "taxi", "kollektivtrafik",
    "vägtrafik", "farligt gods",
  ],
  energi: [
    "energi", "ellag", "miljöbalk", "utsläpp", "klimat", "avfall",
    "vattenverksamhet", "naturvård", "vindkraft", "solenergi",
    "kärnkraft", "fjärrvärme", "hållbarhet",
  ],
  utbildning: [
    "skollag", "utbildning", "universitet", "högskola", "förskola",
    "grundskola", "gymnasium", "vuxenutbildning", "studiestöd",
    "lärare", "betyg", "elevhälsa",
  ],
  livsmedel: [
    "livsmedel", "hygien", "livsmedelssäkerhet", "tillsats",
    "märkning", "ekologisk", "jordbruk", "fiske", "slakt",
    "restaurang", "allergen", "kontaktmaterial",
  ],
  tillverkning: [
    "arbetsmiljö", "maskinsäkerhet", "kemikalie", "industri",
    "tillstånd", "tillverkning", "produktion", "CE-märkning",
    "standardisering", "kvalitetssäkring", "fabrik",
  ],
};

export const LEGAL_AREA_KEYWORDS: Record<string, string[]> = {
  arbetsratt: [
    "anställning", "uppsägning", "arbetstid", "semester", "diskriminering",
    "arbetsmiljö", "kollektivavtal", "fackförening", "avsked", "lön",
    "sjukfrånvaro", "föräldraledighet", "visstidsanställning",
  ],
  skatteratt: [
    "skatt", "moms", "inkomstskatt", "bolagsskatt", "punktskatt",
    "skatteförfarande", "deklaration", "avdrag", "skatteverket",
    "fastighetsskatt", "arbetsgivaravgift",
  ],
  miljoratt: [
    "miljöbalk", "miljötillstånd", "utsläpp", "förorenad mark",
    "naturvård", "artskydd", "miljökonsekvensbeskrivning",
    "vattenverksamhet", "avfall", "kemikalie",
  ],
  bolagsratt: [
    "aktiebolag", "bolagsordning", "styrelse", "bolagsstämma",
    "fusion", "likvidation", "handelsbolag", "firma", "konkurs",
    "insolvens", "borgenär",
  ],
  dataskydd: [
    "personuppgift", "dataskydd", "GDPR", "integritet",
    "registerförteckning", "dataintrång", "samtycke",
    "personuppgiftsansvarig", "personuppgiftsbiträde",
  ],
  konsumentratt: [
    "konsument", "reklamation", "ångerrätt", "garanti",
    "konsumentköplag", "distansavtal", "vilseledande",
    "konsumentombudsman", "produktansvar",
  ],
  fastighetsratt: [
    "fastighet", "jordabalk", "hyresrätt", "bostadsrätt",
    "servitut", "nyttjanderätt", "arrende", "lagfart",
    "pantbrev", "expropriation", "tomträtt",
  ],
  straffratt: [
    "brott", "straff", "påföljd", "brottsbalk", "fängelse",
    "böter", "förundersökning", "åtal", "narkotika",
    "bedrägeri", "förskingring",
  ],
  upphandling: [
    "upphandling", "offentlig upphandling", "anbud", "LOU",
    "ramavtal", "direktupphandling", "utvärdering",
    "upphandlingsmyndigheten", "överprövning",
  ],
  immaterialratt: [
    "patent", "upphovsrätt", "varumärke", "mönsterskydd",
    "designskydd", "företagshemlighet", "licensavtal",
    "immaterialrätt", "copyright",
  ],
};

export function getIndustryLabel(value: string): string {
  return INDUSTRIES.find((i) => i.value === value)?.label ?? value;
}

export function getLegalAreaLabel(value: string): string {
  return LEGAL_AREAS.find((a) => a.value === value)?.label ?? value;
}
