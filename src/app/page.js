'use client';

import React, { useRef, useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import NodeInfo from "./components/NodeInfo";
import { generateNodes } from "./utils/nodes";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ProfileForm from "./components/ProfileForm";
import ConnectionFilters from "./components/ConnectionFilters";

// Dynamically import Canvas to prevent SSR-related issues
const Canvas = dynamic(() => import('./components/Canvas'), { ssr: false });

function Home() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  // Connection filters for determining node relationships
  const [connectionFilters, setConnectionFilters] = useState({
    hobbies: true,
    location: true,
    nationality: false,
  });

  // User profile data state
  const [meData, setMeData] = useState({
    name: "",
    job: null,
    location: null,
    nationality: null,
    hobbies: [],
  });

  const nodesRef = useRef([]); // Store the list of nodes
  const [nodes, setNodes] = useState([]); // State for rendering nodes
  const lastUpdateRef = useRef(null); // Store the last update timestamp

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        let url = "/api/getNodes";
        if (lastUpdateRef.current) {
          url += `?since=${encodeURIComponent(lastUpdateRef.current)}`;
        }
    
        console.log("Fetching from:", url); // Check the requested URL
    
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch nodes");
    
        const data = await response.json();
        console.log("Fetched nodes:", data.nodes); // Check the fetched data
    
        if (data && data.nodes.length > 0) {
          const existingData = nodesRef.current.map((node) => node.data);
    
          // Filter out duplicate data
          const newData = data.nodes.filter((nodeData) =>
            !existingData.some(
              (d) =>
                d.name === nodeData.name &&
                d.job === nodeData.job &&
                d.location === nodeData.location &&
                d.nationality === nodeData.nationality &&
                JSON.stringify(d.hobbies) === JSON.stringify(nodeData.hobbies)
            )
          );
    
          if (newData.length > 0) {
            const updatedNodes = generateNodes([...existingData, ...newData]);
            nodesRef.current = updatedNodes;
            setNodes(updatedNodes); // Update only if there are new nodes
            console.log("Updated nodes:", updatedNodes); // Verify canvas update
          }
    
          lastUpdateRef.current = data.lastUpdate; // Update last timestamp
        }
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    // Initial fetch and polling setup (every 5 seconds)
    fetchNodes();
    const intervalId = setInterval(fetchNodes, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle profile submission
  const handleSubmit = async () => {
    const existingData = nodesRef.current.map((node) => node.data);
    const updatedNodes = generateNodes([...existingData, meData]);

    nodesRef.current = updatedNodes;
    setNodes(updatedNodes);
    setIsFormVisible(false); // Close the form after submission

    try {
      await fetch("/api/addNode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meData),
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Handle selection of user attributes (e.g., job, location, hobbies)
  const handleOptionSelect = (field, value) => {
    setMeData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? prev[field].includes(value)
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value]
        : value,
    }));
  };

  return (
    <div className="relative w-full h-full">
      {/* Button to toggle the profile input form */}
      <button
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        onClick={() => setIsFormVisible((prev) => !prev)}
      >
        {isFormVisible ? "Close" : "Insert Profile"}
      </button>

      {/* Render the profile form only when it is visible */}
      {isFormVisible && (
        <div className="absolute top-16 left-4 bg-white p-4 rounded-lg shadow-lg z-50">
          <ProfileForm
            meData={meData}
            setMeData={setMeData}
            handleSubmit={handleSubmit}
            handleOptionSelect={handleOptionSelect}
          />
        </div>
      )}

      {/* Render the canvas and UI components */}
      <ConnectionFilters connectionFilters={connectionFilters} setConnectionFilters={setConnectionFilters} />
      <BackgroundCanvas />
      <Canvas
        nodes={nodes}
        connectionRange={600}
        maxConnections={5}
        onHoverChange={setHoveredNode}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        isPaused={!!selectedNode}
        filters={connectionFilters}
      />
      <NodeInfo node={hoveredNode} selectedNode={selectedNode} />
    </div>
  );
}

export default Home;
