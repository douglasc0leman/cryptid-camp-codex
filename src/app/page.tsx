import { Suspense } from 'react'
import HomeClient from './components/HomeClient'

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-4">Loading cards...</div>}>
      <HomeClient />
    </Suspense>
  )
}
