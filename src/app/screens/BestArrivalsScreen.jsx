import React from 'react'
import ShopPage from '../Components/shop/ShopPage'
import Navbar from '../Components/Navbar'
import OtherHero from '../Components/OtherHero'
import Footer from '../Components/Footer'

const BestArrivalsScreen = () => {
    return (
        <div>
            <Navbar />
            <OtherHero
                title="Best Arrivals"
                subtitle="Our most celebrated new pieces"
                breadcrumb={[{ label: "Home", href: "/" }, { label: "Best Arrivals" }]}
                desktopImages={[
                    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80&fit=crop",
                ]}
                mobileImages={[
                    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&fit=crop&crop=center",
                ]}
            />
            <ShopPage initialFilters={{ toggles: ["newArrivals"] }} />
            <Footer />
        </div>
    )
}

export default BestArrivalsScreen
