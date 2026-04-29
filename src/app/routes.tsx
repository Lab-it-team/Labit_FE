import { Routes, Route } from 'react-router'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}
