"use client";

import dynamic from "next/dynamic";

const AIRecommendationScreen = dynamic(
  () => import("../screens/AIRecommendationScreen"),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: "100vh", background: "#faf7f2" }} />
    ),
  }
);

export default function AIRecommendationClient() {
  return <AIRecommendationScreen />;
}
