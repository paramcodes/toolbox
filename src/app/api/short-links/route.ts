import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCode, normalizeUrl, sanitizeCode } from "@/lib/short-links";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

function toResponseLink(link: {
  code: string;
  longUrl: string;
  clicks: number;
  createdAt: Date;
}) {
  return {
    code: link.code,
    longUrl: link.longUrl,
    clicks: link.clicks,
    createdAt: link.createdAt.toISOString(),
  };
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.shortLink.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return Response.json(
    { links: links.map(toResponseLink) },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    longUrl?: string;
    customCode?: string;
  };
  const normalizedUrl = normalizeUrl(body.longUrl ?? "");

  try {
    new URL(normalizedUrl);
  } catch {
    return Response.json({ error: "Enter a valid URL." }, { status: 400 });
  }

  const requestedCode = sanitizeCode(body.customCode ?? "");
  const code = requestedCode || createCode();

  try {
    const link = await prisma.shortLink.create({
      data: {
        code,
        longUrl: normalizedUrl,
        userId,
      },
    });

    return Response.json(
      { link: toResponseLink(link) },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "That short code already exists." },
        { status: 409 },
      );
    }

    throw error;
  }
}
