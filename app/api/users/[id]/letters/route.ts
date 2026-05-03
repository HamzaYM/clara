import { getLettersByUserId } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  return Response.json(getLettersByUserId(id));
}
