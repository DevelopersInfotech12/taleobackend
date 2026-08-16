import React, { Suspense } from 'react'
import RingsScreen from '../screens/RingsScreen'

const page = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fdfaf6" }} />}>
      <RingsScreen />
    </Suspense>
  )
}

export default page