import { createUser } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const user = createUser({
    name: body.name,
    preferred_language: body.preferred_language,
    caregiver_email: body.caregiver_email,
  });
  return Response.json({ user_id: user.id });
}
