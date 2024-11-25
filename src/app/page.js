'use client';

import React, { useRef, useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import NodeInfo from "./components/NodeInfo";
import { generateNodes } from "./utils/nodes";
import BackgroundCanvas from "./components/BackgroundCanvas";
// import styles from "./globals.css";

// Dynamically import Canvas to avoid SSR issues with canvas
const Canvas = dynamic(() => import('./components/Canvas'), { ssr: false });

function Home() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [connectionFilters, setConnectionFilters] = useState({
    hobbies: true,
    location: true,
    nationality: false,
  });
  
  const [meData, setMeData] = useState({
    name: "",
    job: null,
    location: null,
    nationality: null,
    hobbies: [],
  });

  const nodesRef = useRef([]);
  const [nodesVersion, setNodesVersion] = useState(0);
  const lastUpdateRef = useRef(null);

  const connectionRange = 600;
  const maxConnections = 5;

  useEffect(() => {
    // Function to fetch nodes from the API
    const fetchNodes = async () => {
      try {
        let url = "/api/getNodes";
        if (lastUpdateRef.current) {
          // Fetch only nodes updated after the last timestamp
          url += `?since=${encodeURIComponent(lastUpdateRef.current)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.nodes) {
          const existingData = nodesRef.current.map((node) => node.data);

          // Filter out duplicates
          const newData = data.nodes.filter((nodeData) => {
            return !existingData.some(
              (d) =>
                d.name === nodeData.name &&
                d.job === nodeData.job &&
                d.location === nodeData.location &&
                d.nationality === nodeData.nationality &&
                JSON.stringify(d.hobbies) === JSON.stringify(nodeData.hobbies)
            );
          });

          if (newData.length > 0) {
            nodesRef.current = generateNodes([...existingData, ...newData]);
            setNodesVersion((v) => v + 1); // Trigger re-render
          }

          // Update the last update timestamp
          lastUpdateRef.current = data.lastUpdate;
        }
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    // Initial fetch
    fetchNodes();

    // Polling interval (e.g., every 5 seconds)
    const intervalId = setInterval(fetchNodes, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = async () => {
    // Add meData to nodesRef.current
    const existingData = nodesRef.current.map((node) => node.data);
    nodesRef.current = generateNodes([...existingData, meData]);
    setIsFormSubmitted(true);
    setNodesVersion((v) => v + 1); // Trigger re-render

    // Send meData to the API to save to MongoDB
    try {
      const response = await fetch("/api/addNode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meData),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

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
    <div>
      {!isFormSubmitted && (
        <div className="form-container">
          <h2 className="form-title">Set Up Your Profile</h2>

          {/* Name Input Section */}
          <div className="form-section">
            <h3>Name</h3>
            <input
              type="text"
              className="text-input"
              placeholder="Enter your name"
              value={meData.name}
              onChange={(e) =>
                setMeData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          {/* Job Selection */}
          <div className="form-section">
            <h3>Job</h3>
            <div className="options-grid">
              {[
                "Frontend Developer",
                "Backend Engineer",
                "Data Scientist",
                "UX Designer",
                "Cloud Architect",
                "DevOps Engineer",
                "AI Researcher",
                "Cybersecurity Specialist",
                "Product Manager",
                "Graphic Designer",
              ].map((job) => (
                <div
                  key={job}
                  className={`option ${meData.job === job ? "selected" : ""}`}
                  onClick={() => handleOptionSelect("job", job)}
                >
                  {job}
                </div>
              ))}
            </div>
          </div>

          {/* Location Selection */}
          <div className="form-section">
            <h3>Location</h3>
            <div className="options-grid">
              {[
                "San Francisco",
                "Seattle",
                "New York",
                "Seoul",
                "Austin",
                "Tokyo",
                "Sydney",
                "San Diego",
                "Los Angeles",
              ].map((location) => (
                <div
                  key={location}
                  className={`option ${
                    meData.location === location ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect("location", location)}
                >
                  {location}
                </div>
              ))}
            </div>
          </div>

          {/* Nationality Selection */}
          <div className="form-section">
            <h3>Nationality</h3>
            <div className="options-grid">
              {[
                "American",
                "Canadian",
                "Korean",
                "British",
                "Japanese",
                "Indian",
              ].map((nationality) => (
                <div
                  key={nationality}
                  className={`option ${
                    meData.nationality === nationality ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect("nationality", nationality)}
                >
                  {nationality}
                </div>
              ))}
            </div>
          </div>

          {/* Hobbies Selection */}
          <div className="form-section">
            <h3>Hobbies</h3>
            <div className="options-grid">
              {[
                "Coding",
                "Reading",
                "Gaming",
                "Traveling",
                "Cooking",
                "Hiking",
                "Photography",
                "Cycling",
                "Yoga",
                "Gardening",
                "Painting",
                "Writing",
              ].map((hobby) => (
                <div
                  key={hobby}
                  className={`option ${
                    meData.hobbies.includes(hobby) ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect("hobbies", hobby)}
                >
                  {hobby}
                </div>
              ))}
            </div>
          </div>

          <button
            className="form-submit"
            onClick={handleSubmit}
            disabled={
              !meData.name.trim() ||
              !meData.job ||
              !meData.location ||
              !meData.nationality ||
              meData.hobbies.length === 0
            }
          >
            Confirm
          </button>
        </div>
      )}

      {isFormSubmitted && (
        <>
          {/* Filters UI */}
          <div className="connection-filters">
            <h3>Connection Filters</h3>
            <label className="checkbox-label fuchsia">
              <input
                type="checkbox"
                checked={connectionFilters.hobbies}
                onChange={() =>
                  setConnectionFilters((prev) => ({
                    ...prev,
                    hobbies: !prev.hobbies,
                  }))
                }
              />
              <span>Common Hobbies</span>
            </label>
            <label className="checkbox-label green">
              <input
                type="checkbox"
                checked={connectionFilters.location}
                onChange={() =>
                  setConnectionFilters((prev) => ({
                    ...prev,
                    location: !prev.location,
                  }))
                }
              />
              <span>Common Location</span>
            </label>
            <label className="checkbox-label black">
              <input
                type="checkbox"
                checked={connectionFilters.nationality}
                onChange={() =>
                  setConnectionFilters((prev) => ({
                    ...prev,
                    nationality: !prev.nationality,
                  }))
                }
              />
              <span>Common Nationality</span>
            </label>
          </div>

          <BackgroundCanvas />
          {/* Canvas and NodeInfo */}
          <Canvas
            nodes={nodesRef.current}
            connectionRange={connectionRange}
            maxConnections={maxConnections}
            onHoverChange={setHoveredNode}
            selectedNode={selectedNode}
            setSelectedNode={(node) => {
              setSelectedNode(node);
            }}
            isPaused={!!selectedNode}
            filters={connectionFilters}
          />

          <NodeInfo node={hoveredNode} selectedNode={selectedNode} />
        </>
      )}
    </div>
  );
}

export default Home;
