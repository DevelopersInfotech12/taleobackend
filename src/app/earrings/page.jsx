import React, { Suspense } from 'react'
import EarringsScreen from '../screens/EarringsScreen'

const page = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fdfaf6" }} />}>
      <EarringsScreen />
    </Suspense>
  )
}

export default page