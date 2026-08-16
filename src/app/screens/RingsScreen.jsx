import React from 'react'
import ShopPage from '../Components/shop/ShopPage'
import Navbar from '../Components/Navbar'
import OtherHero from '../Components/OtherHero'
import Footer from '../Components/Footer'

const RingsScreen = () => {
    return (
        <div>
            <Navbar />
            <OtherHero
                title="Rings"
                subtitle="Bands that speak without words"
                breadcrumb={[{ label: "Home", href: "/" }, { label: "Rings" }]}
                desktopImages={[
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80&fit=crop",
                    "./banner3.png",
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&fit=crop",
                ]}
                mobileImages={[
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80&fit=crop&crop=center",
                ]}
            />
            <ShopPage categorySlug="rings" />
            <Footer />
        </div>
    )
}

export default RingsScreen
