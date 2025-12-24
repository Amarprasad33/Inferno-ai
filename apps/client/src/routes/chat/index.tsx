import { useSessionStore } from "@/stores/session-store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { toast } from "sonner";
// import NodeCanvas from "../../components/NodeCanvas";
const NodeCanvas = lazy(() => import("@/components/NodeCanvas"));

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isAuthenticated } = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("/chat -> user-->", user);
    console.log("/chat -> isAuthenticated-->", isAuthenticated);
    if (!isAuthenticated) {
      toast("Your are not signed in.", {
        description: "You need to sign in to create conversations!",
        action: {
          label: "OK!",
          onClick: () => { },
        },
      });
      navigate({ to: "/signin" })
    }

  }, [isAuthenticated, user, navigate]);

  return (
    <div className="border border-green-500 min-h-screen p-1 flex flex-col">
      {/* <KonvaCanvas /> */}
      {/* <KonvaCanvasChatGroup /> */}
      <Suspense fallback={<CanvasLoader />}>
        <NodeCanvas />
      </Suspense>
      {/* <div>Ends here</div> */}
    </div>
  );
}

const CanvasLoader = () => (
  <div className="p-4 border bg-zinc-800 h-full flex justify-center items-center">Loading canvas...</div>
);
