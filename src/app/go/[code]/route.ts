import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const link = await prisma.shortLink.findUnique({
    where: { code },
    select: { longUrl: true },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/tools/links/url-shortener?missing=1", _request.url));
  }

  await prisma.shortLink.update({
    where: { code },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });

  return NextResponse.redirect(link.longUrl);
}
