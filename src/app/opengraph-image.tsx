import { readFile } from "fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import checkDateHoliday from "@/checkDateHoliday";

export default async function Image() {
  const isHoliday = await checkDateHoliday();
  const fontData = await readFile(path.join(process.cwd(), "public/Montserrat-Bold.ttf"));

  return new ImageResponse(
    <div
      style={{
        fontSize: 150,
        fontWeight: 700,
        background: isHoliday.success === false || isHoliday.isHoliday ? "#a4343a" : "#fff",
        color: isHoliday.success === false || isHoliday.isHoliday ? "#fff" : "#a4343a",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isHoliday.success === false ? "Error" : isHoliday.isHoliday ? "Brīvdiena" : "Darba diena"}
    </div>,
    { fonts: [{ name: "Montserrat", data: fontData, style: "normal" }] },
  );
}
