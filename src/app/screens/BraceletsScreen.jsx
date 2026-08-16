import React from 'react'
import ShopPage from '../Components/shop/ShopPage'
import Navbar from '../Components/Navbar'
import OtherHero from '../Components/OtherHero'
import Footer from '../Components/Footer'

const BraceletsScreen = () => {
    return (
        <div>
            <Navbar />
            <OtherHero
                title="Bracelets"
                subtitle="Adorn every gesture"
                breadcrumb={[{ label: "Home", href: "/" }, { label: "Bracelets" }]}
                desktopImages={[
                    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
                ]}
                mobileImages={[
                    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop&crop=center",
                ]}
            />
            <ShopPage categorySlug="bracelets" />
            <Footer />
        </div>
    )
}

export default BraceletsScreen
