import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchNewLaws } from "@/lib/riksdagen";
import { matchLawToClients } from "@/lib/matcher";
import { createMatchNotifications } from "@/lib/notifications";
import { sendMatchDigest } from "@/lib/email";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Ogiltig hemlighet" }, { status: 401 });
  }

  try {
    // Determine from date
    const lastFetch = await prisma.fetchLog.findFirst({
      where: { status: "success" },
      orderBy: { fetchedAt: "desc" },
    });

    const fromDate = lastFetch
      ? lastFetch.fetchedAt.toISOString().split("T")[0]
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

    // Fetch new laws
    const newLaws = await fetchNewLaws(fromDate);

    let lawsInserted = 0;
    let totalMatches = 0;

    // Get all active clients
    const clients = await prisma.client.findMany({
      where: { active: true },
      include: { user: true },
    });

    for (const lawData of newLaws) {
      // Skip if already exists
      const existing = await prisma.law.findUnique({
        where: { riksdagenId: lawData.riksdagenId },
      });
      if (existing) continue;

      // Insert law
      const law = await prisma.law.create({
        data: {
          riksdagenId: lawData.riksdagenId,
          designation: lawData.designation,
          title: lawData.title,
          summary: lawData.summary,
          category: lawData.category,
          documentUrl: lawData.documentUrl,
          publishedDate: lawData.publishedDate,
        },
      });
      lawsInserted++;

      // Run matching
      const matchResults = matchLawToClients(
        { title: law.title, summary: law.summary, category: law.category },
        clients.map((c) => ({
          id: c.id,
          industry: c.industry,
          legalAreas: c.legalAreas,
        }))
      );

      // Create matches
      for (const match of matchResults) {
        await prisma.lawMatch.create({
          data: {
            lawId: law.id,
            clientId: match.clientId,
            relevanceScore: match.relevanceScore,
            matchReason: match.matchReason,
            recommendation: match.recommendation,
          },
        });
        totalMatches++;
      }

      // Create notifications per user
      const userMatchCounts = new Map<string, number>();
      for (const match of matchResults) {
        const client = clients.find((c) => c.id === match.clientId);
        if (client) {
          userMatchCounts.set(
            client.userId,
            (userMatchCounts.get(client.userId) || 0) + 1
          );
        }
      }

      for (const [userId, count] of userMatchCounts) {
        await createMatchNotifications(userId, law.title, count, law.id);
      }
    }

    // Send email digests per user
    const userEmailData = new Map<
      string,
      { email: string; firmName: string; matches: Array<{
        lawTitle: string;
        lawDesignation: string;
        clientName: string;
        recommendation: string;
        matchReason: string;
      }> }
    >();

    if (totalMatches > 0) {
      const recentMatches = await prisma.lawMatch.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
        },
        include: { law: true, client: { include: { user: true } } },
      });

      for (const match of recentMatches) {
        const userId = match.client.userId;
        if (!userEmailData.has(userId)) {
          userEmailData.set(userId, {
            email: match.client.user.email,
            firmName: match.client.user.firmName,
            matches: [],
          });
        }
        userEmailData.get(userId)!.matches.push({
          lawTitle: match.law.title,
          lawDesignation: match.law.designation,
          clientName: match.client.name,
          recommendation: match.recommendation,
          matchReason: match.matchReason,
        });
      }

      for (const [, data] of userEmailData) {
        await sendMatchDigest(data.email, data.firmName, data.matches);
      }
    }

    // Log the fetch
    await prisma.fetchLog.create({
      data: {
        lawsFound: lawsInserted,
        matchesCreated: totalMatches,
        status: "success",
      },
    });

    return NextResponse.json({
      success: true,
      lawsFound: lawsInserted,
      matchesCreated: totalMatches,
      emailsSent: userEmailData.size,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Okänt fel";

    await prisma.fetchLog.create({
      data: {
        lawsFound: 0,
        matchesCreated: 0,
        status: "error",
        errorMessage: message,
      },
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
