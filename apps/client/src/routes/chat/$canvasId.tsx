import { useSession } from "@/lib/auth-client";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { toast } from "sonner";

const NodeCanvas = lazy(() => import("@/components/NodeCanvas"));

export const Route = createFileRoute("/chat/$canvasId")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useSession();
  const navigate = useNavigate();
  const { canvasId } = useParams({ from: "/chat/$canvasId" });

  useEffect(() => {
    const isLoading = session?.isPending ?? true;
    const isAuthenticated = !!session?.data?.user;

    if (!isLoading && !isAuthenticated) {
      toast("You are not signed in.", {
        description: "You need to sign in to view the chat!",
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
      <div className="min-h-screen p-1 flex flex-col border border-rose-400">
        <div className="p-4 border bg-zinc-800 h-full flex justify-center items-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen p-1 flex flex-col">
      <Suspense fallback={<CanvasLoader />}>
        <NodeCanvas canvasIdFromRoute={canvasId} />
      </Suspense>
    </div>
  );
}

const CanvasLoader = () => (
  <div className="p-4 border bg-zinc-800 h-full flex justify-center items-center">Loading canvas...</div>
);
