import { useState } from "react";
import { Link } from "react-router";
import logoFullSvg from "@/assets/brand/logo-full.svg";
import rightSvg from "@/assets/icons/right.svg";
import decoWater from "@/assets/deco/deco-water.svg";
import decoFlask from "@/assets/deco/deco-flask.svg";
import decoMoleculeRight from "@/assets/deco/deco-molecule-right.svg";
import decoMoleculeBottom from "@/assets/deco/deco-molecule-bottom.svg";
import decoLines from "@/assets/deco/deco-lines.svg";
import decoLines2 from "@/assets/deco/deco-line-2.svg";
import BohrAtom from "@/components/lab/BohrAtom";
import PuzzlePiece from "@/components/lab/PuzzlePiece";
import { CATIONS, ANIONS } from "@/data/ions";

const NA_ION = CATIONS.find((ion) => ion.id === "Na")!;
const CL_ION = ANIONS.find((ion) => ion.id === "Cl")!;

interface DecoProps {
  src: string;
  left: string;
  top: string;
  width: string | number;
  height?: string | number;
  rotate?: number;
  opacity?: number;
  animation: string;
  dur: string;
  delay: string;
}

function Deco({ src, left, top, width, height, rotate = 0, opacity = 1, animation, dur, delay }: DecoProps) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left,
        top,
        width,
        ...(height != null && { height }),
        opacity,
        pointerEvents: "none",
        animation: `${animation} ${dur} ${delay} ease-in-out infinite`,
        transformOrigin: "center center",
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: height != null ? "100%" : "auto",
          transform: `rotate(${rotate}deg)`,
          display: "block",
        }}
      />
    </div>
  );
}

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full bg-white text-label-md font-medium text-text-sub ${className}`}>
      {children}
    </span>
  );
}

function OutlineChip({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-1 rounded-md text-label-sm font-medium"
      style={{
        border: `1px solid ${dark ? "var(--color-element-drag-fill-blue)" : "var(--color-primary-normal)"}`,
        color: dark ? "var(--color-element-drag-fill-blue)" : "var(--color-primary-normal)",
      }}
    >
      {children}
    </span>
  );
}

function StatItem({ big, label, last = false }: { big: string; label: string; last?: boolean }) {
  return (
    <div
      className={`flex-1 flex flex-col items-center gap-1 py-0 ${last ? "" : "border-r border-border-light"}`}
    >
      <span className="text-display-sm text-text-normal">{big}</span>
      <span className="text-body-xl font-medium text-text-sub">{label}</span>
    </div>
  );
}

function useBondToggle() {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const bonded = hovered || active;
  const toggle = () => setActive((prev) => !prev);
  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
    onClick: toggle,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
  };
  return { bonded, active, handlers };
}

function IonicMiniIllustration() {
  const { bonded, active, handlers } = useBondToggle();
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label="나트륨 이온과 염화 이온의 결합 미리보기"
      className="w-full flex items-center justify-center rounded-xl bg-bg-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-normal"
      style={{ height: 180, cursor: "pointer" }}
      {...handlers}
    >
      <PuzzlePiece ion={NA_ION} interaction={bonded ? "placed" : "default"} />
      <div
        style={{
          marginLeft: bonded ? -20 : 20,
          transition: "margin-left 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)",
        }}
      >
        <PuzzlePiece ion={CL_ION} interaction={bonded ? "placed" : "default"} />
      </div>
    </div>
  );
}

function CovalentMiniIllustration() {
  const { bonded, active, handlers } = useBondToggle();
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label="수소 원자 두 개의 공유 결합 미리보기"
      className="relative w-full flex items-center justify-center rounded-xl bg-bg-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-normal"
      style={{ height: 180, cursor: "pointer" }}
      {...handlers}
    >
      <div style={{ marginRight: bonded ? -18 : 10, transition: "margin-right 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)" }}>
        <BohrAtom element="H" occupiedAngles={bonded ? [0] : []} remainingValence={bonded ? 0 : undefined} />
      </div>
      <BohrAtom element="H" occupiedAngles={bonded ? [180] : [0]} remainingValence={bonded ? 0 : undefined} />
      {bonded && (
        <div className="absolute flex items-center" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", gap: 3 }}>
          {[0, 1].map((i) => (
            <span
              key={i}
              className="block rounded-full"
              style={{ width: 10, height: 10, background: "var(--color-primary-normal)", border: "1.5px solid var(--color-static-white)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-bg-normal">
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-[60px] px-10 bg-white border-b border-border-light">
        <img src={logoFullSvg} alt="Labit" width={90} height={25} />
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-label-xl font-semibold text-text-normal px-2.5 py-2">
            로그인
          </Link>
          <Link
            to="/login"
            className="h-[38px] px-4 rounded-lg text-label-xl font-semibold text-static-white flex items-center"
            style={{ background: "var(--color-primary-normal)" }}
          >
            체험하기
          </Link>
        </div>
      </header>

      <main className="pt-[60px]">
        <section className="relative flex flex-col items-center overflow-hidden" style={{ paddingTop: 160, isolation: "isolate" }}>
          <div
            className="absolute pointer-events-none"
            style={{
              width: "106.7%",
              left: "50%",
              transform: "translateX(-50%)",
              top: -60,
              height: 700,
              background: `
                radial-gradient(110.08% 68% at 50% 34.75%, #F6F9FC 0%, rgba(255,255,255,0.4) 15.08%, rgba(233,239,254,0) 100%),
                #E9EFFE
              `,
              zIndex: 0,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "min(106.7%, 1320px)",
              left: "50%",
              transform: "translateX(-50%)",
              top: -60,
              height: 700,
              zIndex: 0,
            }}
          >
            <Deco src={decoWater} left="6%" top="26%" width="clamp(44px, 5.2vw, 69px)" rotate={22} animation="deco-float-b" dur="7.2s" delay="0s" />
            <Deco src={decoFlask} left="80%" top="20%" width="clamp(40px, 4.9vw, 65px)" rotate={10} animation="deco-float-a" dur="8.5s" delay="-1.4s" />
            <Deco src={decoLines2} left="20%" top="15%" width="clamp(180px, 23.2vw, 306px)" opacity={0.6} animation="deco-float-b" dur="9.5s" delay="-7s" />
            <Deco src={decoLines} left="70%" top="60%" width="clamp(180px, 23.1vw, 305px)" animation="deco-float-a" dur="10s" delay="-5s" />
            <Deco src={decoMoleculeRight} left="77%" top="22%" width="clamp(64px, 8.3vw, 110px)" height="clamp(165px, 21.5vw, 284px)" animation="deco-float-d" dur="11s" delay="-0.7s" />
            <Deco src={decoMoleculeBottom} left="0%" top="55%" width="clamp(180px, 22.9vw, 302px)" height="clamp(200px, 25.4vw, 335px)" animation="deco-float-c" dur="9.8s" delay="-3.5s" />
          </div>

          <div className="relative flex flex-col items-center gap-4" style={{ zIndex: 1 }}>
            <Chip>중학교 과학 인터랙티브 학습 서비스</Chip>
            <div className="flex flex-col items-center gap-6 max-w-[431px]">
              <div className="flex flex-col items-center">
                <h1 className="text-display-lg text-text-normal m-0 text-center">화학 결합,</h1>
                <h1
                  className="text-display-lg m-0 text-center"
                  style={{
                    background: "linear-gradient(116.58deg, #4E78F3 17.37%, var(--color-primary-strong) 70.94%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  직접 체험해 보세요!
                </h1>
              </div>
              <p className="text-body-xl font-medium text-text-normal text-center m-0">
                이온 결합과 공유 결합의 원리를 이해하고
                <br />
                인터랙티브 실습으로 직접 분자를 만들어 보세요.
              </p>
              <Link
                to="/login"
                className="flex items-center gap-1 h-12 px-5 rounded-xl text-label-xl font-semibold text-static-white"
                style={{ background: "var(--color-primary-normal)" }}
              >
                지금 바로 체험하기
                <img src={rightSvg} alt="" width={20} height={20} className="brightness-0 invert" />
              </Link>
            </div>
          </div>

          <div className="relative w-full flex items-center justify-center gap-1 py-20 bg-bg-normal border-b border-border-light" style={{ zIndex: 1, marginTop: 60 }}>
            <div className="flex items-center w-full max-w-[1206px]">
              <StatItem big="드래그앤드롭" label="직접 조작하는 실습" />
              <StatItem big="AI기반" label="오개념 맞춤 피드백" />
              <StatItem big="3단계" label="개념 → 실습 → 퀴즈" />
              <StatItem big="100%" label="국내 중학 교육과정 맞춤" last />
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-[100px]" style={{ padding: "156px 156px", background: "var(--color-element-drag-fill-blue)" }}>
          <div className="flex flex-col items-center gap-3 max-w-[1128px]">
            <OutlineChip>개념 학습</OutlineChip>
            <h2 className="text-display-sm text-text-strong m-0 text-center">추상적인 개념을 직관적인 모형으로</h2>
            <p className="text-body-md font-medium text-text-sub m-0 text-center">
              텍스트만으로는 헷갈리던 분자 구조와 전자 이동 과정을 시각화하여 명확하게 보여줍니다.
            </p>
          </div>
          <div className="flex items-start gap-6 w-full max-w-[1128px]">
            <div className="flex-1 flex flex-col items-start gap-10 p-10 rounded-3xl bg-white" style={{ boxShadow: "1px 5px 6px rgba(14, 48, 91, 0.04)" }}>
              <IonicMiniIllustration />
              <div className="flex flex-col items-start gap-2.5">
                <h3 className="text-heading-md text-text-normal m-0">이온 결합</h3>
                <p className="text-body-md font-medium text-text-sub m-0">
                  양이온과 음이온의 전하량을 맞추는 퍼즐 형태로 구현하여,
                  <br />
                  전하 균형과 결합 비율의 원리를 자연스럽게 체득합니다.
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start gap-10 p-10 rounded-3xl bg-white" style={{ boxShadow: "1px 5px 6px rgba(14, 48, 91, 0.04)" }}>
              <CovalentMiniIllustration />
              <div className="flex flex-col items-start gap-2.5">
                <h3 className="text-heading-md text-text-normal m-0">공유 결합</h3>
                <p className="text-body-md font-medium text-text-sub m-0">
                  원자 모형의 전자 궤도가 겹치며 전자를 공유하는 과정을 시뮬레이션하여
                  <br />
                  분자 형성의 핵심을 시각화합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-[100px]" style={{ padding: "156px 156px", background: "var(--color-bg-normal)" }}>
          <div className="flex flex-col items-center gap-3 max-w-[1128px]">
            <OutlineChip>단계별 학습 흐름</OutlineChip>
            <h2 className="text-display-sm text-text-strong m-0 text-center">개념부터 실습까지 이어지는 단계적 학습</h2>
            <p className="text-body-md font-medium text-text-sub m-0 text-center">파편화된 지식이 아닌, 매끄러운 흐름 속에서 과학의 뼈대를 세웁니다.</p>
          </div>
          <div className="flex items-stretch gap-6 w-full max-w-[1128px]">
            {[
              { n: "01", t: "직관적 개념 학습", d: "불필요한 텍스트를 줄이고,\n이미지와 모션을 통해 핵심 개념을 먼저 이해합니다." },
              { n: "02", t: "인터랙티브 실습", d: "학습한 개념을 바탕으로 원자와 이온을\n직접 드래그하며 결합을 완성해 봅니다." },
              { n: "03", t: "오답 분석 피드백", d: "단원 퀴즈를 통해 성취도를 확인하고,\n틀린 이유를 정확하게 파악합니다." },
            ].map(({ n, t, d }) => (
              <div key={n} className="flex-1 flex flex-col items-start gap-8 p-8 rounded-3xl bg-white">
                <span className="text-display-sm" style={{ color: "var(--color-text-disabled)" }}>{n}</span>
                <div className="flex flex-col items-start gap-2.5">
                  <h3 className="text-heading-md text-text-normal m-0">{t}</h3>
                  <p className="text-body-sm font-medium text-text-sub m-0" style={{ whiteSpace: "pre-line" }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="flex flex-col items-center gap-[100px]"
          style={{ padding: "156px 156px", background: "linear-gradient(180deg, var(--color-bg-normal) 0%, var(--color-element-drag-fill-blue) 40.67%)" }}
        >
          <div className="flex flex-col items-center gap-3 max-w-[1128px]">
            <OutlineChip>개념 학습</OutlineChip>
            <h2 className="text-display-sm text-text-strong m-0 text-center">나의 오개념을 바로잡아주는 친절한 피드백</h2>
            <p className="text-body-md font-medium text-text-sub m-0 text-center">단순히 정답만 알려주지 않습니다. AI가 당신이 헷갈린 개념을 콕 집어 설명해 줍니다.</p>
          </div>
          <div className="w-full max-w-[1128px] rounded-3xl bg-white" style={{ height: 363, boxShadow: "1px 4px 8px rgba(14, 48, 91, 0.03)" }} />
        </section>

        <section
          className="flex flex-col items-center gap-[100px]"
          style={{ padding: "156px 156px", background: "linear-gradient(180deg, var(--color-primary-normal) 0%, var(--color-primary-strong) 100%)" }}
        >
          <div className="flex flex-col items-center gap-3 max-w-[1128px]">
            <OutlineChip dark>학습 대상</OutlineChip>
            <h2 className="text-display-sm text-static-white m-0 text-center">누구를 위한 서비스인가요?</h2>
            <p className="text-body-md font-medium text-static-white m-0 text-center">파편화된 지식이 아닌, 매끄러운 흐름 속에서 과학의 뼈대를 세웁니다.</p>
          </div>
          <div className="flex items-stretch gap-6 w-full max-w-[1128px]">
            {[
              { l: "핵심 타겟", t: "중학교 학생", d: "이온, 화학 결합 등 처음 접하는 추상적인 개념을\n확실하게 내 것으로 만들고 싶은 학생" },
              { l: "추천 대상", t: "자기주도 학습자", d: "학교 수업만으로는 부족하여 집에서 직접 먼저 보며\n원리를 복습하고 싶은 학습자" },
              { l: "확장 예정", t: "고등학생 (예정)", d: "통합과학 및 화학의 기초를 다시 한번 탄탄하게\n다지고 싶은 예비 고등학생" },
            ].map(({ l, t, d }) => (
              <div key={t} className="flex-1 flex flex-col items-start gap-8 p-8 rounded-3xl bg-white">
                <span className="text-label-xl font-semibold" style={{ color: "var(--color-text-sub)" }}>{l}</span>
                <div className="flex flex-col items-start gap-2.5">
                  <h3 className="text-heading-md text-text-normal m-0">{t}</h3>
                  <p className="text-body-sm font-medium text-text-sub m-0" style={{ whiteSpace: "pre-line" }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-[60px]" style={{ padding: "156px" }}>
          <div className="flex flex-col items-center gap-6 max-w-[668px]">
            <h2
              className="text-display-lg m-0 text-center"
              style={{
                background: "radial-gradient(89.7% 150.06% at 52.19% 50%, var(--color-primary-normal) 0%, var(--color-element-drag-stroke-blue) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              과학을 체험하는 순간이 옵니다
            </h2>
            <p className="text-body-lg font-medium text-text-normal m-0 text-center">
              복잡한 가입 절차 없이, 지금 바로 첫 번째 단원부터 화학 결합의 세계를 조작해 보세요.
            </p>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1 h-[38px] px-4 rounded-lg text-label-xl font-semibold text-text-normal bg-bg-normal"
            style={{ border: "1px solid var(--color-border-strong)" }}
          >
            지금 바로 체험하기
            <img src={rightSvg} alt="" width={20} height={20} />
          </Link>
        </section>

        <footer className="flex flex-col items-start gap-3 bg-white" style={{ padding: "80px 156px" }}>
          <span className="text-body-md font-medium text-text-normal">랩잇(Labit)</span>
          <span className="text-caption-sm text-text-sub">© 2026 Labit Project. All rights reserved.</span>
        </footer>
      </main>
    </div>
  );
}
