import { notFound } from "next/navigation";
import { fetchProductBySlug, fetchProducts, normaliseProduct } from "../../lib/api";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const raw = await fetchProductBySlug(slug);
  if (!raw) return { title: "Product not found" };
  return {
    title: `${raw.name} | Taleo Fine Jewellery`,
    description: raw.shortDesc ?? raw.description ?? "",
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const raw = await fetchProductBySlug(slug);
  if (!raw) notFound();
  const product = normaliseProduct(raw);

  let relatedProducts = [];
  try {
    const json = await fetchProducts({ category: raw.category?._id ?? raw.category, limit: 5 });
    relatedProducts = (json.data?.products ?? [])
      .filter((r) => r.slug !== product.slug)
      .slice(0, 4)
      .map(normaliseProduct);
  } catch {
    relatedProducts = [];
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}