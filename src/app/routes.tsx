import { Navigate, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";

const Landing = lazy(() => import("@/pages/Landing"));
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const KakaoCallback = lazy(() => import("@/pages/KakaoCallback"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const ElementConcept = lazy(() => import("@/pages/ElementConcept"));
const AtomConcept = lazy(() => import("@/pages/AtomConcept"));
const IonFormationConcept = lazy(() => import("@/pages/IonFormationConcept"));
const IonicConcept = lazy(() => import("@/pages/IonicConcept"));
const IonicLab = lazy(() => import("@/pages/IonicLab"));
const CovalentConcept = lazy(() => import("@/pages/CovalentConcept"));
const CovalentLab = lazy(() => import("@/pages/CovalentLab"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const MyPage = lazy(() => import("@/pages/MyPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/Home" element={<Navigate to="/home" replace />} />
        </Route>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/element-concept" element={<ElementConcept />} />
        <Route path="/atom-concept" element={<AtomConcept />} />
        <Route path="/ion-formation-concept" element={<IonFormationConcept />} />
        <Route path="/ionic-concept" element={<IonicConcept />} />
        <Route path="/ionic-lab" element={<IonicLab />} />
        <Route path="/covalent-concept" element={<CovalentConcept />} />
        <Route path="/covalent-lab" element={<CovalentLab />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
