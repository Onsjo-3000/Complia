import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create demo user
  const passwordHash = await bcrypt.hash("demo123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@advokatbyran.se" },
    update: {},
    create: {
      email: "demo@advokatbyran.se",
      passwordHash,
      firmName: "Demo Advokatbyrå AB",
      phone: "08-123 456",
    },
  });

  console.log("Skapade användare:", user.email);

  // Create demo clients
  const clients = [
    {
      name: "Byggbolaget Stockholm AB",
      organizationNr: "556123-4567",
      industry: "bygg",
      legalAreas: "fastighetsratt,miljoratt,arbetsratt",
      contactPerson: "Anna Svensson",
      contactEmail: "anna@byggbolaget.se",
      notes: "Stor byggentreprenör i Stockholmsregionen",
    },
    {
      name: "TechStart Sverige AB",
      organizationNr: "559876-5432",
      industry: "tech",
      legalAreas: "dataskydd,bolagsratt,immaterialratt",
      contactPerson: "Erik Johansson",
      contactEmail: "erik@techstart.se",
      notes: "AI-startup med fokus på GDPR-compliance",
    },
    {
      name: "Nordisk Finans AB",
      organizationNr: "556789-0123",
      industry: "finans",
      legalAreas: "skatteratt,bolagsratt",
      contactPerson: "Maria Lindström",
      contactEmail: "maria@nordiskfinans.se",
      notes: "Fondförvaltare och investeringsrådgivning",
    },
    {
      name: "Gröna Energi AB",
      organizationNr: "556456-7890",
      industry: "energi",
      legalAreas: "miljoratt,upphandling",
      contactPerson: "Lars Eriksson",
      contactEmail: "lars@gronaenergi.se",
      notes: "Vindkraft och solenergi",
    },
    {
      name: "MatExpressen AB",
      organizationNr: "556321-6789",
      industry: "livsmedel",
      legalAreas: "konsumentratt,arbetsratt",
      contactPerson: "Sara Nilsson",
      contactEmail: "sara@matexpressen.se",
      notes: "E-handel med livsmedel",
    },
  ];

  for (const clientData of clients) {
    await prisma.client.upsert({
      where: {
        id: `seed-${clientData.name.toLowerCase().replace(/\s/g, "-")}`,
      },
      update: {},
      create: {
        id: `seed-${clientData.name.toLowerCase().replace(/\s/g, "-")}`,
        userId: user.id,
        ...clientData,
      },
    });
    console.log("Skapade klient:", clientData.name);
  }

  // Create some sample laws
  const laws = [
    {
      riksdagenId: "demo-sfs-2026-100",
      designation: "SFS 2026:100",
      title: "Lag om ändring i plan- och bygglagen (2010:900)",
      summary: "Ändringar gällande bygglov och detaljplan för hållbart byggande.",
      category: "Socialdepartementet",
      publishedDate: new Date("2026-03-01"),
    },
    {
      riksdagenId: "demo-sfs-2026-101",
      designation: "SFS 2026:101",
      title: "Förordning om ändring i dataskyddsförordningen",
      summary: "Nya krav på personuppgiftsbehandling vid användning av artificiell intelligens.",
      category: "Justitiedepartementet",
      publishedDate: new Date("2026-03-05"),
    },
    {
      riksdagenId: "demo-sfs-2026-102",
      designation: "SFS 2026:102",
      title: "Lag om ändring i miljöbalken gällande vindkraftverk",
      summary: "Uppdaterade krav på miljökonsekvensbeskrivning för vindkraft och solenergi.",
      category: "Klimat- och näringslivsdepartementet",
      publishedDate: new Date("2026-03-10"),
    },
    {
      riksdagenId: "demo-sfs-2026-103",
      designation: "SFS 2026:103",
      title: "Förordning om ändring i skatteförfarandelagen",
      summary: "Nya regler om momsdeklaration och skatteverkets befogenheter vid revision.",
      category: "Finansdepartementet",
      publishedDate: new Date("2026-03-15"),
    },
    {
      riksdagenId: "demo-sfs-2026-104",
      designation: "SFS 2026:104",
      title: "Lag om ändring i livsmedelslagen",
      summary: "Skärpta krav på livsmedelssäkerhet och märkning av allergen i e-handel.",
      category: "Landsbygds- och infrastrukturdepartementet",
      publishedDate: new Date("2026-03-20"),
    },
  ];

  for (const lawData of laws) {
    await prisma.law.upsert({
      where: { riksdagenId: lawData.riksdagenId },
      update: {},
      create: lawData,
    });
    console.log("Skapade lag:", lawData.designation);
  }

  // Run matching for demo data
  const { matchLawToClients } = await import("../src/lib/matcher");
  const allLaws = await prisma.law.findMany();
  const allClients = await prisma.client.findMany({ where: { userId: user.id } });

  let matchCount = 0;
  for (const law of allLaws) {
    const matches = matchLawToClients(
      { title: law.title, summary: law.summary, category: law.category },
      allClients.map((c) => ({ id: c.id, industry: c.industry, legalAreas: c.legalAreas }))
    );

    for (const match of matches) {
      const existing = await prisma.lawMatch.findFirst({
        where: { lawId: law.id, clientId: match.clientId },
      });
      if (existing) continue;

      await prisma.lawMatch.create({
        data: {
          lawId: law.id,
          clientId: match.clientId,
          relevanceScore: match.relevanceScore,
          matchReason: match.matchReason,
          recommendation: match.recommendation,
        },
      });
      matchCount++;
    }
  }
  console.log(`Skapade ${matchCount} matchningar`);

  // Create notifications
  for (const law of allLaws) {
    const matchesForLaw = await prisma.lawMatch.count({
      where: { lawId: law.id, client: { userId: user.id } },
    });
    if (matchesForLaw > 0) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `Ny lag: ${law.designation}`,
          message: `${matchesForLaw} av dina kunder kan påverkas av ${law.title}.`,
          type: "match",
          linkUrl: `/lagar/${law.id}`,
        },
      });
    }
  }
  console.log("Skapade notiser");

  console.log("\n--- Seed klar! ---");
  console.log("Logga in med: demo@advokatbyran.se / demo123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
