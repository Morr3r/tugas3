import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/neon";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username dan password wajib diisi." },
      { status: 400 },
    );
  }

  const user = await verifyUser(username, password);

  if (!user) {
    return NextResponse.json(
      { error: "Username atau password tidak sesuai." },
      { status: 401 },
    );
  }

  return NextResponse.json({ user });
}
