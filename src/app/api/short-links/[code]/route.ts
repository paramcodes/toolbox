import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  await prisma.shortLink.deleteMany({
    where: { code },
  });

  return Response.json({ ok: true });
}
