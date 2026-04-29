import clsx from "clsx";

import FitText from "./FitText";

type PageProps = {
  supText?: string;
  text: string;
  highlight?: boolean;
};

export default function Page({ text, supText, highlight }: PageProps) {
  return (
    <div
      className={clsx(
        "flex h-screen w-screen flex-col items-center justify-center py-20 select-none",
        highlight ? "bg-primary text-secondary" : "bg-secondary text-primary",
      )}
    >
      {supText && (
        <div
          className={clsx(
            "shrink-0 text-lg text-[#292D32]/50",
            highlight ? "text-white/50" : "text-[#292D32]/50",
          )}
        >
          {supText}
        </div>
      )}
      <FitText text={text} className="px-20" />
    </div>
  );
}
