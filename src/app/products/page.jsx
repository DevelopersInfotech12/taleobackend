import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import OtherHero from "../Components/OtherHero";

export default function ProductsPage() {
  return (
    <div>
      <Navbar />
      <OtherHero
        title="Products"
        subtitle="Discover our jewellery"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
        desktopImages={[
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
        ]}
        mobileImages={[
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop",
        ]}
      />
      <Footer />
    </div>
  );
}