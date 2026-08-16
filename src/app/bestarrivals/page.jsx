import React, { Suspense } from 'react'
import BestArrivalsScreen from '../screens/BestArrivalsScreen'

const page = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fdfaf6" }} />}>
      <BestArrivalsScreen />
    </Suspense>
  )
}

export default page