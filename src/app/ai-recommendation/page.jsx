import AIRecommendationClient from "./AIRecommendationClient";

export const metadata = {
  title: "AI Jewellery Stylist | Taleo",
  description:
    "Answer a few quick questions and let Taleo's AI stylist curate jewellery pieces matched to your taste, occasion, and budget.",
};

export default function AIRecommendationPage() {
  return <AIRecommendationClient />;
}
