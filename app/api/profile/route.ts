import { NextRequest, NextResponse } from "next/server";
import { getLiveProfile } from "@/lib/riot";

export async function GET(request: NextRequest) {
  try {
    const gameName = request.nextUrl.searchParams.get("gameName")?.trim();
    const tagLine = request.nextUrl.searchParams.get("tagLine")?.trim();
    const region = request.nextUrl.searchParams.get("region")?.trim().toUpperCase();
    const refresh = request.nextUrl.searchParams.get("refresh") === "1";

    if (!gameName || !tagLine || !region) {
      return NextResponse.json(
        { error: "gameName, tagLine, and region are required." },
        { status: 400 }
      );
    }

    const profile = await getLiveProfile(gameName, tagLine, region, {
      forceRefresh: refresh
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile route error:", error);
    const status =
      typeof error === "object" && error && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode) || 500
        : 500;
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: string }).message || "Unexpected server error.")
        : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status });
  }
}
