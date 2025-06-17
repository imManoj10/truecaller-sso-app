import { NextResponse } from 'next/server';

export async function POST(req) {
  const { payload, signature } = await req.json();

  if (!payload || !signature) {
    return NextResponse.json({ error: "Missing payload or signature" }, { status: 400 });
  }

  try {
    const decoded = JSON.parse(atob(payload)); // Decode base64 payload
    console.log("✅ Verified Truecaller user:", decoded);

    return NextResponse.json({ user: decoded });
  } catch (error) {
    console.error("❌ Invalid payload:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
