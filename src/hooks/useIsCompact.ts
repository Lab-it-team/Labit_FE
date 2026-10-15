import { useEffect, useState } from "react";

const DEFAULT_BREAKPOINT = 1024;

/** 뷰포트 폭이 breakpoint(기본 1024px, 아이패드 가로 기준) 미만인지 */
export function useIsCompact(breakpoint: number = DEFAULT_BREAKPOINT): boolean {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < breakpoint);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isCompact;
}
