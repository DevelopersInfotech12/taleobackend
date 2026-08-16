import React, { Suspense } from 'react'
import BraceletsScreen from '../screens/BraceletsScreen'

const page = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fdfaf6" }} />}>
      <BraceletsScreen />
    </Suspense>
  )
}

export default page