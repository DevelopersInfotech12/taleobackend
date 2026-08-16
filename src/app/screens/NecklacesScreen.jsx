import React from 'react'
import ShopPage from '../Components/shop/ShopPage'
import Navbar from '../Components/Navbar'
import OtherHero from '../Components/OtherHero'
import Footer from '../Components/Footer'

const NecklacesScreen = () => {
    return (
        <div>
            <Navbar />
            <OtherHero
                title="Necklaces"
                subtitle="Worn close to the heart"
                breadcrumb={[{ label: "Home", href: "/" }, { label: "Necklaces" }]}
                desktopImages={[
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1600&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1600&q=80&fit=crop",
                ]}
                mobileImages={[
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80&fit=crop&crop=center",
                ]}
            />
            <ShopPage categorySlug="necklaces" />
            <Footer />
        </div>
    )
}

export default NecklacesScreen
