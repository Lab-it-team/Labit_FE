import { useEffect, useState } from "react";
import MiniPeriodicTable from "@/components/reference/MiniPeriodicTable";
import IonicSandboxPanel from "@/components/reference/IonicSandboxPanel";
import tableIconSvg from "@/assets/학습 참조/lucide_table-2.png";
import experimentIconSvg from "@/assets/학습 참조/icon-park-solid_experiment.png";

type ReferenceTab = "periodicTable" | "ionicLab";

interface LearningReferenceModalProps {
  onClose: () => void;
  defaultTab?: ReferenceTab;
}

const TABS: { key: ReferenceTab; label: string; icon: string }[] = [
  { key: "periodicTable", label: "미니 주기율표", icon: tableIconSvg },
  { key: "ionicLab", label: "이온 결합 실습", icon: experimentIconSvg },
];

export default function LearningReferenceModal({ onClose, defaultTab = "periodicTable" }: LearningReferenceModalProps) {
  const [activeTab, setActiveTab] = useState<ReferenceTab>(defaultTab);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{
          width: 1420,
          maxWidth: "calc(100vw - 48px)",
          height: 860,
          maxHeight: "calc(100vh - 48px)",
          background: "var(--color-static-white)",
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          padding: 40,
          gap: 24,
          boxShadow: "0px 0px 117.6px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <h3 className="text-heading-md font-bold text-text-strong" style={{ margin: 0 }}>
            학습 참조
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            style={{ width: 24, height: 24, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1L13 13" stroke="var(--color-text-normal)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 탭 */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "8px 12px",
                  gap: 6,
                  height: 40,
                  background: active ? "#F1F7FF" : "transparent",
                  border: active ? "1px solid #275AF0" : "1px solid transparent",
                  borderRadius: 999,
                  cursor: "pointer",
                }}
              >
                <img src={tab.icon} alt="" width={20} height={20} />
                <span
                  className="text-label-xl font-semibold"
                  style={{ color: active ? "#275AF0" : "var(--color-text-normal)", whiteSpace: "nowrap" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 콘텐츠 */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {activeTab === "periodicTable" ? <MiniPeriodicTable /> : <IonicSandboxPanel />}
        </div>
      </div>
    </div>
  );
}
