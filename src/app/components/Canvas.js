// components/Canvas.js

import React, { useRef, useEffect, useState } from "react";
import { drawConnections } from "../utils/connections";

const Canvas = ({
  nodes,
  connectionRange,
  maxConnections,
  onHoverChange,
  setSelectedNode,
  selectedNode,
  filters,
}) => {
  const canvasRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Event handler for mouse move to detect hover on nodes
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Find the node that the mouse is hovering over
      const hoveredNode = nodes.find(
        (node) =>
          node &&
          node.radius &&
          Math.sqrt((node.x - mouseX) ** 2 + (node.y - mouseY) ** 2) <= node.radius
      );

      onHoverChange(hoveredNode || null);
    };

    // Event handler for mouse click to select/deselect nodes
    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const clickedNode = nodes.find(
        (node) =>
          node &&
          node.radius &&
          Math.sqrt((node.x - mouseX) ** 2 + (node.y - mouseY) ** 2) <= node.radius
      );

      if (clickedNode) {
        if (clickedNode === selectedNode) {
          setIsPaused(false); // Resume animation if the node is deselected
          setSelectedNode(null); // Deselect the node
        } else {
          setSelectedNode(clickedNode); // Select the clicked node
          setIsPaused(true); // Pause animation for focus on the selected node
        }
      } else {
        setIsPaused(false); // Resume animation if no node is clicked
        // setSelectedNode(null);
      }
    };

    // Event handler for resizing the canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Attach event listeners
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    let animationFrameId;

    // Animation loop to render nodes and connections
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Filter valid nodes (with defined x, y, and radius)
      const validNodes = nodes.filter(
        (node) => node && node.x !== undefined && node.y !== undefined && node.radius
      );

      // Draw each node
      validNodes.forEach((node) => {
        if (typeof node.draw === "function") {
          node.draw(ctx);
        }
      });

      // Draw connections between nodes
      drawConnections(ctx, validNodes, connectionRange, maxConnections, selectedNode, filters);

      // Update node positions if animation is not paused
      if (!isPaused) {
        validNodes.forEach((node) => {
          if (typeof node.update === "function") {
            node.update(canvas.width, canvas.height);
          }
        });
      }

      // Request the next animation frame
      animationFrameId = requestAnimationFrame(animate);
    };

    animate(); // Start the animation

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, connectionRange, maxConnections, onHoverChange, isPaused, selectedNode, filters]);

  return <canvas ref={canvasRef} className="w-full h-full"></canvas>; // Render the canvas
};

export default Canvas;
