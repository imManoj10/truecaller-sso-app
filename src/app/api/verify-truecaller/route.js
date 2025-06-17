import { NextResponse } from 'next/server';

export async function POST(req) {
  const { payload, signature } = await req.json();

  if (!payload || !signature) {
    console.error("❌ Missing payload or signature");
    return NextResponse.json({ error: "Missing payload or signature" }, { status: 400 });
  }

  try {
    const decoded = JSON.parse(atob(payload));

    // ✅ These logs will now appear in Vercel Logs
    console.log("✅ TRUECALLER LOGIN SUCCESS");
    console.log("👤 Name:", decoded.firstName, decoded.lastName);
    console.log("📞 Phone:", decoded.phoneNumber);
    console.log("📧 Email:", decoded.email || "N/A");
    console.log("🆔 ID:", decoded.id);

    return NextResponse.json(decoded);
  } catch (error) {
    console.error("❌ Invalid payload:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
