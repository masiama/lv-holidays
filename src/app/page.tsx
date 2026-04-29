import checkDateHoliday from "@/checkDateHoliday";
import Page from "@/Page";

export default async function Home() {
  const isHoliday = await checkDateHoliday();
  return (
    <Page
      text={
        isHoliday.success === false ? "Error" : isHoliday.isHoliday ? "Brīvdiena" : "Darba diena"
      }
      highlight={isHoliday.success === false || isHoliday.isHoliday}
      supText="Šodien"
    />
  );
}
