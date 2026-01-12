import { useSession } from "@/lib/auth-client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { toast } from "sonner";
// import NodeCanvas from "../../components/NodeCanvas";
const NodeCanvas = lazy(() => import("@/components/NodeCanvas"));

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoading = session?.isPending ?? true;
    const isAuthenticated = !!session?.data?.user;

    if (!isLoading && !isAuthenticated) {
      toast("Your are not signed in.", {
        description: "You need to sign in to create conversations!",
        action: {
          label: "OK!",
          onClick: () => {},
        },
      });
      navigate({ to: "/signin" });
    }
  }, [navigate, session]);

  if (session.isPending) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="p-4 border bg-zinc-800 h-full flex justify-center items-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" h-screen  flex flex-col">
      {/* <KonvaCanvas /> */}
      {/* <KonvaCanvasChatGroup /> */}
      <Suspense fallback={<CanvasLoader />}>
        <NodeCanvas />
      </Suspense>
    </div>
  );
}

const CanvasLoader = () => (
  <div className="p-4 border bg-zinc-800 h-full flex justify-center items-center">Loading canvas...</div>
);
