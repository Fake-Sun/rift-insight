import { NextResponse } from "next/server";
import { isRiotConfigured } from "@/lib/riot";

export async function GET() {
  return NextResponse.json({
    ok: true,
    riotApiConfigured: isRiotConfigured(),
    timestamp: new Date().toISOString()
  });
}
