import clsx from "clsx";
import type { Metadata } from "next";

import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ weight: ["700"], style: ["normal"] });

export const metadata: Metadata = {
  title: "Latvijas Brīvdienas",
  description: "Informācija par Latvijas brīvdienām",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lv" className={clsx(montserrat.className, "antialiased")}>
      <body>{children}</body>
    </html>
  );
}
