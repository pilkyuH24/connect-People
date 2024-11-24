import React, { useRef, useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import NodeInfo from "./components/NodeInfo";
import { generateNodes, peopleData } from "./utils/nodes";
import BackgroundCanvas from "./components/BackgroundCanvas";
import "./App.css";

function App() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null); // Selected node state
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [connectionFilters, setConnectionFilters] = useState({
    hobbies: true, // Default: Show connections for common hobbies
    location: true, // Default: Show connections for common location
    nationality: true, // Default: Show connections for common nationality
  });

  const [meData, setMeData] = useState({
    name: "Me",
    job: null,
    location: null,
    nationality: null,
    hobbies: [],
  });

  const nodesRef = useRef(generateNodes(peopleData));

  const connectionRange = 600; // Connection range in pixels
  const maxConnections = 5; // Maximum number of connections per node

  const ws = useRef(null);
  const [, setNodesVersion] = useState(0); // State to trigger re-render

  useEffect(() => {
    // Establish WebSocket connection
    // ws.current = new WebSocket("ws://localhost:4000");
    ws.current = new WebSocket("wss://connect-people.onrender.com");

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Update nodesRef.current
      const existingData = nodesRef.current.map((node) => node.data);

      // Check if data already exists to avoid duplicates
      if (
        !existingData.some(
          (d) =>
            d.name === data.name &&
            d.job === data.job &&
            d.location === data.location &&
            d.nationality === data.nationality &&
            JSON.stringify(d.hobbies) === JSON.stringify(data.hobbies)
        )
      ) {
        nodesRef.current = generateNodes([...existingData, data]);
        setNodesVersion((v) => v + 1); // Trigger re-render
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSubmit = () => {
    // Add meData to nodesRef.current
    const existingData = nodesRef.current.map((node) => node.data);
    nodesRef.current = generateNodes([...existingData, meData]);
    setIsFormSubmitted(true);
    setNodesVersion((v) => v + 1); // Trigger re-render

    // Send meData via WebSocket
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(meData));
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
              !meData.name.trim() || // Ensure name is not empty
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
            <label className="checkbox-label blue">
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
            selectedNode={selectedNode} // Pass selectedNode for emphasis
            setSelectedNode={(node) => {
              setSelectedNode(node);
            }}
            isPaused={!!selectedNode} // Pause animation when a node is selected
            filters={connectionFilters} // Pass connection filters
          />

          <NodeInfo node={hoveredNode} selectedNode={selectedNode} />
        </>
      )}
    </div>
  );
}

export default App;
