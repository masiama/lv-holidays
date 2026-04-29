import { NextRequest } from "next/server";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

import checkDateHoliday from "@/checkDateHoliday";

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/[date]">) {
  const { date } = await ctx.params;
  const validDate = z.iso.date().safeParse(date);
  if (!validDate.success) {
    return Response.json({ success: false, error: "Invalid date format" }, { status: 400 });
  }
  const holidayResponse = await checkDateHoliday(Temporal.PlainDate.from(validDate.data));
  return Response.json(holidayResponse, { status: holidayResponse.success ? 200 : 400 });
}
