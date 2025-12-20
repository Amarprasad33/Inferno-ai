import { BaseEdge, type EdgeProps, getBezierPath, useReactFlow } from "reactflow";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((eds) => {
      //   const deletedEdge = eds.find((e) => e.id === id);
      //   console.log("🗑️ Edge Deleted:", {
      //     edgeId: id,
      //     source: deletedEdge?.source,
      //     target: deletedEdge?.target,
      //     edge: deletedEdge,
      //   });
      return eds.filter((e) => e.id !== id);
    });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <g>
        <foreignObject
          x={labelX - 12}
          y={labelY - 12}
          width={24}
          height={24}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <button
            className="edgebutton !bg-[#f3f3f3] hover:!bg-orange-400 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center cursor-pointer border-0"
            onClick={onEdgeClick}
            title="Delete edge"
          >
            <svg
              className="!w-4 !h-4"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.91675 2.91675L7.08341 7.08341M2.91675 7.08341L7.08341 2.91675"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </foreignObject>
      </g>
    </>
  );
}
