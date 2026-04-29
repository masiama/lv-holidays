"use client";

import { clsx } from "clsx";
import { useLayoutEffect, useRef, useState } from "react";

type FitTextProps = {
  text: string;
  className?: string;
};

export default function FitText({ text, className }: FitTextProps) {
  const [detecting, setDetecting] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    const fit = async () => {
      setDetecting(true);
      let size = window.innerHeight;
      el.style.fontSize = `${size}px`;

      await document.fonts.ready;
      if (cancelled) return;

      while (
        document.body.scrollWidth > document.body.clientWidth ||
        document.body.scrollHeight > document.body.clientHeight
      ) {
        size -= 1;
        el.style.fontSize = `${size}px`;
        if (size <= 20) break;
      }
      if (!cancelled) setDetecting(false);
    };

    void fit();
    window.addEventListener("resize", fit);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", fit);
    };
  }, [text]);

  return (
    <div
      ref={ref}
      className={clsx("leading-none font-bold whitespace-nowrap", className, {
        "opacity-0": detecting,
      })}
    >
      {text}
    </div>
  );
}
