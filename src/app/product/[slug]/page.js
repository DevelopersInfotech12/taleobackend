import { redirect } from "next/navigation";

// Old route — redirect to new canonical product route
export default async function OldProductPage({ params }) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
