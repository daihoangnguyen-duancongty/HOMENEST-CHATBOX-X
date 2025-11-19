// ADMIN API Server

import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const ADMIN_SYNC_TOKEN = process.env.ADMIN_SYNC_TOKEN;

export async function GET() {
  if (!ADMIN_SYNC_TOKEN) {
    return NextResponse.json(
      { error: "ADMIN_SYNC_TOKEN not set" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(`${BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${ADMIN_SYNC_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
