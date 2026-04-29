import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import Layout from '@/components/layout/Layout'

const Home = lazy(() => import('@/pages/Home'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const IonicConcept = lazy(() => import('@/pages/IonicConcept'))
const IonicLab = lazy(() => import('@/pages/IonicLab'))
const CovalentConcept = lazy(() => import('@/pages/CovalentConcept'))
const CovalentLab = lazy(() => import('@/pages/CovalentLab'))
const Quiz = lazy(() => import('@/pages/Quiz'))

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ionic-concept" element={<IonicConcept />} />
          <Route path="/ionic-lab" element={<IonicLab />} />
          <Route path="/covalent-concept" element={<CovalentConcept />} />
          <Route path="/covalent-lab" element={<CovalentLab />} />
          <Route path="/quiz" element={<Quiz />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
