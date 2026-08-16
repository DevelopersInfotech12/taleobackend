import React, { Suspense } from 'react'
import NecklacesScreen from '../screens/NecklacesScreen'

const page = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fdfaf6" }} />}>
      <NecklacesScreen />
    </Suspense>
  )
}

export default page