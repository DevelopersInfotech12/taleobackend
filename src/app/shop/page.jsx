import React, { Suspense } from 'react'
import ShopScreen from '../screens/ShopScreen'

const page = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fdfaf6" }} />}>
      <ShopScreen/>
    </Suspense>
  )
}

export default page