import { Suspense } from "react";
import CheckoutScreen from "../screens/CheckoutScreen";

export const metadata = {
  title: "Checkout — Luxéor Fine Jewellery",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f5efe8" }} />}>
      <CheckoutScreen />
    </Suspense>
  );
}