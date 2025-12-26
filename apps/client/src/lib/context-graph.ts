import type { Edge } from "reactflow";

/**
 * Builds a reverse adjacency list (target -> sources) for efficient upstream traversal
 * @param edges Array of ReactFlow edges
 * @returns Map where key is target node ID and value is array of source node IDs
 */
function buildReverseAdjacencyList(edges: Edge[]): Map<string, string[]> {
  const adjList = new Map<string, string[]>();

  for (const edge of edges) {
    const target = edge.target;
    if (!adjList.has(target)) {
      adjList.set(target, []);
    }
    adjList.get(target)!.push(edge.source);
  }

  return adjList;
}

/**
 * Finds all upstream nodes (ancestors) of a given node using BFS
 * @param nodeId The target node ID
 * @param edges Array of ReactFlow edges
 * @returns Array of upstream node IDs in topological order (oldest first)
 */
export function getUpstreamNodes(nodeId: string, edges: Edge[]): string[] {
  if (edges.length === 0) {
    return [];
  }

  const adjList = buildReverseAdjacencyList(edges);
  const visited = new Set<string>();
  const upstreamNodes: string[] = [];
  const queue: string[] = [nodeId];

  // BFS to find all ancestors
  while (queue.length > 0) {
    const current = queue.shift()!;
    const sources = adjList.get(current) || [];

    for (const source of sources) {
      if (!visited.has(source)) {
        visited.add(source);
        upstreamNodes.push(source);
        queue.push(source);
      }
    }
  }

  // Return in reverse order (oldest nodes first) for context chain
  // This ensures messages from earlier nodes come before later nodes
  return upstreamNodes.reverse();
}

/**
 * Builds the context chain for a node, including all upstream nodes and the node itself
 * @param nodeId The current node ID (database node ID)
 * @param edges Array of ReactFlow edges
 * @param nodeIdMap Optional map to convert ReactFlow node IDs to database node IDs
 * @returns Ordered array of database node IDs: [upstream1, upstream2, ..., currentNode]
 */
export function buildContextChain(nodeId: string, edges: Edge[], nodeIdMap?: Map<string, string>): string[] {
  // If no edges, return just the current node (isolated)
  if (edges.length === 0) {
    return [nodeId];
  }

  // Find the ReactFlow node ID that corresponds to this database node ID
  // We need to find which ReactFlow node has this dbNodeId
  let reactFlowNodeId: string | undefined = nodeId;

  // If nodeIdMap is provided, use it to find the ReactFlow ID
  if (nodeIdMap) {
    for (const [rfId, dbId] of nodeIdMap.entries()) {
      if (dbId === nodeId) {
        reactFlowNodeId = rfId;
        break;
      }
    }
  }

  if (!reactFlowNodeId) {
    // If we can't find the ReactFlow node, return just the current node
    return [nodeId];
  }

  // Get all upstream nodes (ReactFlow IDs)
  const upstreamReactFlowIds = getUpstreamNodes(reactFlowNodeId, edges);

  // Convert ReactFlow IDs to database IDs if map is provided
  const upstreamDbIds = nodeIdMap
    ? upstreamReactFlowIds.map((rfId) => nodeIdMap.get(rfId)).filter((dbId): dbId is string => dbId !== undefined)
    : upstreamReactFlowIds;

  // Return chain: [upstream nodes..., current node]
  return [...upstreamDbIds, nodeId];
}

/**
 * Simplified version that works with ReactFlow node IDs directly
 * Use this when you have the ReactFlow node ID and need to find upstream ReactFlow IDs
 */
export function buildContextChainFromReactFlowId(
  reactFlowNodeId: string,
  edges: Edge[],
  dbNodeIdMap: Map<string, string> // Map from ReactFlow ID to DB ID
): string[] {
  if (edges.length === 0) {
    const dbId = dbNodeIdMap.get(reactFlowNodeId);
    return dbId ? [dbId] : [];
  }

  const upstreamReactFlowIds = getUpstreamNodes(reactFlowNodeId, edges);
  const upstreamDbIds = upstreamReactFlowIds
    .map((rfId) => dbNodeIdMap.get(rfId))
    .filter((dbId): dbId is string => dbId !== undefined);

  const currentDbId = dbNodeIdMap.get(reactFlowNodeId);
  if (!currentDbId) {
    return upstreamDbIds;
  }

  return [...upstreamDbIds, currentDbId];
}
