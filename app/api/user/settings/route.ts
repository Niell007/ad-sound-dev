import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Set the runtime to edge for better performance
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    // Get cookie store and await it
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    });

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user settings
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No settings found, return defaults
        return NextResponse.json({
          phone: "",
          website: "",
          role: "user",
        });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get cookie store and await it
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    });

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: session.user.id,
        ...body,
      });

    if (error) throw error;

    return new NextResponse("OK");
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
