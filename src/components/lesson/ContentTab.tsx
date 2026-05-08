interface ContentTabProps {
  active: "learn" | "practice";
  onChange: (v: "learn" | "practice") => void;
}

export default function ContentTab({ active, onChange }: ContentTabProps) {
  return (
    <div className="flex items-center bg-neutral-10 rounded-lg p-1.5 self-center">
      <button
        type="button"
        onClick={() => onChange("learn")}
        className={`px-4 py-1.5 rounded-lg text-label-lg font-semibold transition-all ${
          active === "learn"
            ? "bg-white shadow-sm text-text-strong"
            : "text-neutral-50"
        }`}
      >
        학습하기
      </button>
      <button
        type="button"
        onClick={() => onChange("practice")}
        className={`px-4 py-1.5 rounded-lg text-label-lg font-semibold transition-all ${
          active === "practice"
            ? "bg-white shadow-sm text-text-strong"
            : "text-neutral-50"
        }`}
      >
        실습하기
      </button>
    </div>
  );
}
