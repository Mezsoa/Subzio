import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseService } from "@/lib/supabaseClient";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = supabaseService();
    const { error } = await supabase
      .from("waitlist")
      .upsert(
        { email: parsed.data.email, created_at: new Date().toISOString() },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

