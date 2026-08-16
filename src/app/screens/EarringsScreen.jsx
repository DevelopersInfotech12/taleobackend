import React from 'react'
import ShopPage from '../Components/shop/ShopPage'
import Navbar from '../Components/Navbar'
import OtherHero from '../Components/OtherHero'
import Footer from '../Components/Footer'

const EarringsScreen = () => {
    return (
        <div>
            <Navbar />
            <OtherHero
                title="Earrings"
                subtitle="Frame every moment with grace"
                breadcrumb={[{ label: "Home", href: "/" }, { label: "Earrings" }]}
                desktopImages={[
                    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
                ]}
                mobileImages={[
                    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop&crop=center",
                ]}
            />
            <ShopPage categorySlug="earrings" />
            <Footer />
        </div>
    )
}

export default EarringsScreen
