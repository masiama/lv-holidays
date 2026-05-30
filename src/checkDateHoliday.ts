import { Temporal } from "temporal-polyfill";
import { z } from "zod";

const TIMEZONE = "Europe/Riga";
const WEEKEND_DAYS = new Set([6, 7]);

const HolidaySchema = z.object({
  name: z.string(),
  kind: z.enum(["holiday", "warning", "event"]),
  date: z.string(), // "2026-01-01"
  dow: z.string(),
});
type Holiday = z.infer<typeof HolidaySchema>;

const ResponseSchema = z.object({
  success: z.boolean(),
  code: z.number(),
  result: z.array(HolidaySchema),
});

type HolidayReason = "holiday" | "weekend" | null;
type HolidayResponse =
  | { success: true; date: string; isHoliday: boolean; reason: HolidayReason }
  | { success: false; error: string };

const cache = new Map<number, z.infer<typeof ResponseSchema>>();

export default async function checkDateHoliday(
  dateStr?: Temporal.PlainDate,
): Promise<HolidayResponse> {
  const date = dateStr ?? Temporal.Now.zonedDateTimeISO(TIMEZONE).toPlainDateTime().toPlainDate();
  const validDateStr = date.toString();
  const year = date.year;

  let data = cache.get(year);
  if (data === undefined) {
    const response = await fetch(`https://api.prompt.lv/api/v1/info/holidays/LV/${year}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return { success: false, error: `Failed to fetch holidays: ${response.statusText}` };
    }

    const holidays = await response.json();
    const parsed = ResponseSchema.safeParse(holidays);
    if (parsed.success === false) {
      return { success: false, error: "Invalid response format" };
    }

    cache.set(year, parsed.data);
    data = parsed.data;
  }

  const todayEntry = data.result.find((entry) => entry.date === validDateStr);

  return { success: true, date: validDateStr, ...isHoliday(todayEntry, date) };
}

const isHoliday = (
  entry: Holiday | undefined,
  date: Temporal.PlainDate,
): { isHoliday: boolean; reason: HolidayReason } => {
  const dow = date.dayOfWeek;
  if (entry?.kind === "holiday") return { isHoliday: true, reason: "holiday" };
  if (entry?.kind === "warning" && WEEKEND_DAYS.has(Number(entry.dow))) {
    return { isHoliday: false, reason: null };
  }
  if (WEEKEND_DAYS.has(dow)) return { isHoliday: true, reason: "weekend" };
  return { isHoliday: false, reason: null };
};
