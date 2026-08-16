import React from 'react'
import ShopPage from '../Components/shop/ShopPage'
import Navbar from '../Components/Navbar'
import OtherHero from '../Components/OtherHero'
import Footer from '../Components/Footer'


const ShopScreen = () => {
    return (
        <div>
            <Navbar />
            <OtherHero
                title="Our Collections"
                subtitle="Timeless pieces for every moment"
                breadcrumb={[{ label: "Home", href: "/" }, { label: "Collections" }]}
                desktopImages={[
                    "./banner3.png",
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&fit=crop",
                ]}
                mobileImages={[
                    "./banner3.png",
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80&fit=crop&crop=center",
                ]}
            />
            <ShopPage />
            <Footer />

        </div>
    )
}

export default ShopScreen
