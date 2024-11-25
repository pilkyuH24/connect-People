export function drawConnections(
  ctx,
  nodes,
  connectionRange,
  maxConnections,
  selectedNode,
  filters
) {
  nodes.forEach((nodeA, index) => {
    let connections = 0;

    for (
      let j = index + 1;
      j < nodes.length && connections < maxConnections;
      j++
    ) {
      const nodeB = nodes[j];

      // Get the type of commonality
      const { hasCommonHobbies, hasCommonLocation, hasCommonNationality } =
        checkCommonality(nodeA.data, nodeB.data);

      // Calculate distance between the two nodes
      const dx = nodeB.x - nodeA.x;
      const dy = nodeB.y - nodeA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only connect if within the connection range
      if (distance < connectionRange) {
        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);

        // Determine color based on commonality
        if (hasCommonHobbies && hasCommonLocation) {
          // Both hobbies and one of location or nationality overlap
          if (filters.hobbies && filters.location){
            ctx.strokeStyle = "rgba(255, 0, 0, 0.9)"; // Red for both
          }else if (!filters.hobbies && filters.location){
            ctx.strokeStyle = "rgba(0, 255, 0, 0.9)"; 
          }else if (filters.hobbies && !filters.location){
            ctx.strokeStyle = "rgba(200, 170, 255, 0.9)"; 
          }
        } else if (hasCommonHobbies) {
          // Only hobbies overlap
          if (filters.hobbies) {
            ctx.strokeStyle = "rgba(200, 170, 255, 0.9)"; 
          } else {
            ctx.strokeStyle = "rgba(0, 0, 0, 0)";
          }
        } else if (hasCommonLocation) {
          // Only location overlap
          if (filters.location) {
            ctx.strokeStyle = "rgba(0, 255, 0, 0.9)"; 
          } else {
            ctx.strokeStyle = "rgba(0, 0, 0, 0)";
          }
        } else if (hasCommonNationality) {
          // Only nationality overlap
          if (filters.nationality) {
            ctx.strokeStyle = "rgba(180, 180, 0, 0.9)"; 
          } else {
            ctx.strokeStyle = "rgba(0, 0, 0, 0)";
          }
        } else {
          // Skip drawing if no commonality
          continue;
        }

        // Emphasize connection if it involves the selected node
        if (
          selectedNode &&
          (selectedNode === nodeA || selectedNode === nodeB)
        ) {
          ctx.lineWidth = 4 - (distance*1.5 / connectionRange); // Thicker line for emphasis
        } else {
          ctx.lineWidth = 2 - (distance*1.5 / connectionRange); // Default line width
        }

        ctx.stroke();
        ctx.closePath();

        connections++;
      }
    }
  });
}

export function checkCommonality(dataA, dataB) {
  // Ensure data objects are defined
  if (!dataA || !dataB) {
    return {
      hasCommonHobbies: false,
      hasCommonLocation: false,
      hasCommonNationality: false,
    };
  }

  const hasCommonHobbies =
    Array.isArray(dataA.hobbies) &&
    Array.isArray(dataB.hobbies) &&
    dataA.hobbies.length > 0 &&
    dataB.hobbies.length > 0 &&
    dataA.hobbies.some((hobby) => dataB.hobbies.includes(hobby));

  const hasCommonLocation =
    typeof dataA.location === "string" &&
    typeof dataB.location === "string" &&
    dataA.location === dataB.location;

  const hasCommonNationality =
    typeof dataA.nationality === "string" &&
    typeof dataB.nationality === "string" &&
    dataA.nationality === dataB.nationality;

  return {
    hasCommonHobbies,
    hasCommonLocation,
    hasCommonNationality,
  };
}
