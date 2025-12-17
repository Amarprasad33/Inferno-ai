import { createFileRoute } from "@tanstack/react-router";
import NodeCanvas from "../../components/NodeCanvas";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="border border-green-500 min-h-screen p-1 flex flex-col">
      {/* <KonvaCanvas /> */}
      {/* <KonvaCanvasChatGroup /> */}
      <NodeCanvas />
      <div>Ends here</div>
    </div>
  );
}
