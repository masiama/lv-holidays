import { Temporal } from "temporal-polyfill";
import { z } from "zod";

const TIMEZONE = "Europe/Riga";

const HolidaySchema = z.object({
  name: z.string(),
  kind: z.enum(["holiday", "warning", "event"]),
  date: z.string(), // "2026-01-01"
  dow: z.string(),
});

const ResponseSchema = z.object({
  success: z.boolean(),
  code: z.number(),
  result: z.array(HolidaySchema),
});

type HolidayResponse =
  | { success: true; date: string; isHoliday: boolean }
  | { success: false; error: string };

const secondsUntilNextYear = () => {
  const now = Temporal.Now.zonedDateTimeISO(TIMEZONE);

  const nextYear = now.with({
    year: now.year + 1,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0,
  });

  return now.until(nextYear).total("seconds");
};

export default async function checkDateHoliday(
  dateStr?: Temporal.PlainDate,
): Promise<HolidayResponse> {
  const date = dateStr ?? Temporal.Now.zonedDateTimeISO(TIMEZONE).toPlainDateTime().toPlainDate();
  const year = date.year;
  const url = `https://api.prompt.lv/api/v1/info/holidays/LV/${year}`;
  const response = await fetch(url, { next: { revalidate: secondsUntilNextYear() } });
  if (!response.ok) {
    return { success: false, error: `Failed to fetch holidays: ${response.statusText}` };
  }

  const holidays = await response.json();
  const parsed = ResponseSchema.safeParse(holidays);
  if (parsed.success === false) {
    return { success: false, error: "Invalid response format" };
  }

  const isHoliday = parsed.data.result.some(
    (holiday) => holiday.kind === "holiday" && holiday.date === date.toString(),
  );
  return { success: true, date: date.toString(), isHoliday };
}
