import type { CSSProperties } from "react";

// 온보딩 가이드 모달/툴팁 공통: radial gradient 테두리 (디자인 시스템의 Primary Blue 스탑 4개)
export const guideCardBorderStyle: CSSProperties = {
  border: "1px solid transparent",
  backgroundImage:
    "linear-gradient(var(--color-static-white), var(--color-static-white)), " +
    "radial-gradient(circle at 0% 0%, " +
    "var(--color-element-drag-stroke-blue) 0%, " +
    "var(--color-primary-normal) 39%, " +
    "var(--color-element-drag-stroke-blue) 66%, " +
    "var(--color-primary-normal) 100%)",
  backgroundOrigin: "padding-box, border-box",
  backgroundClip: "padding-box, border-box",
};
