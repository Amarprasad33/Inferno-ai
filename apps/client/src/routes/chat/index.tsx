import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
// import NodeCanvas from "../../components/NodeCanvas";
const NodeCanvas = lazy(() => import("@/components/NodeCanvas"));

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
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
