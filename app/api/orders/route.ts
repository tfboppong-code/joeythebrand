import { NextResponse } from "next/server";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const db = getFirestore();
    const body = await req.json();

    await addDoc(collection(db, "orders"), {
      ...body,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
