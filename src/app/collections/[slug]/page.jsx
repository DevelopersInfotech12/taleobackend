import { Suspense } from "react";
import CollectionScreen from "../../screens/CollectionScreen";

export default function Page({ params }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fdfaf6" }} />}>
      <CollectionScreen collectionSlug={params.slug} />
    </Suspense>
  );
}