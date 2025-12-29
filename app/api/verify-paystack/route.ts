import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reference } = await req.json();

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await res.json();

  if (data.status && data.data.status === "success") {
    return NextResponse.json({ success: true, data: data.data });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}
