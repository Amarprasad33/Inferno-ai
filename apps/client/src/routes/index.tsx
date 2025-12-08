// import { Button } from '@/components/ui/button'
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import PainPoints from "@/components/landing/pain-points";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // const navigate = useNavigate();

  return (
    <div className="">
      {/* <Button className='mt-10'  onClick={() => navigate({ to: '/account/your_keys' })}>Click to setup API key</Button> */}
      <section>
        <Hero />
        <PainPoints />
        <Features />
      </section>
      <Footer />
    </div>
  );
}
