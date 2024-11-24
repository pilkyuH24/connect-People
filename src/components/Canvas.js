import React, { useRef, useEffect, useState } from "react";
import { drawConnections } from "../utils/connections";

// Canvas component renders a dynamic canvas element to visualize nodes and their connections.
// Handles animations, interactions (hover and click), and dynamic updates based on filters and user actions.

const Canvas = ({ 
  nodes,              // Array of nodes with properties like x, y, radius, and draw/update methods
  connectionRange,    // Range within which connections are drawn
  maxConnections,     // Maximum number of connections per node
  onHoverChange,      // Callback triggered when the hovered node changes
  setSelectedNode,    // Callback to update the selected node
  selectedNode,       // Currently selected node
  filters             // Filtering criteria to filter nodes and connections
}) => {
  const canvasRef = useRef(null); // Reference to the canvas DOM element
  const [isPaused, setIsPaused] = useState(false); // State to control animation pause/resume
  const [filteredConnections, setFilteredConnections] = useState(null); // Filtered nodes based on current filters

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
  }, [connectionRange, maxConnections, onHoverChange, isPaused, selectedNode, filters]); // Dependencies to re-run effect

  useEffect(() => {
    // Filter nodes based on the provided filters
    const filtered = nodes.filter((node) => {
      // Check if the node satisfies all filter conditions
      if (filters.hobbies && !node.hobbies) return false;
      if (filters.location && !node.location) return false;
      if (filters.nationality && !node.nationality) return false;

      return true; // Include nodes that pass all conditions
    });

    setFilteredConnections(filtered); // Update state with filtered nodes
  }, [filters]); // Re-run effect when filters change

  return <canvas ref={canvasRef} className="w-full h-full"></canvas>; // Render the canvas
};

export default Canvas;
