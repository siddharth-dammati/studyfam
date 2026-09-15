import { NextResponse } from "next/server";
import { getAvailableTests } from "@/lib/examDb";

export async function POST() {
  try {
    const data = getAvailableTests();
    return NextResponse.json({
      success: true,
      fullMocks: data.fullMocks,
      chapterTests: data.chapterTests,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch tests" },
      { status: 500 }
    );
  }
}


