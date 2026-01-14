import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import PainPoints from "@/components/landing/pain-points";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="">
      <section>
        <Hero />
        <PainPoints />
        <Features />
      </section>
      <Footer />
    </div>
  );
}
