import { getLetterById } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const letter = getLetterById(id);
  if (!letter) {
    return Response.json({ error: "not found" }, { status: 404 });
  }
  return Response.json(letter);
}
