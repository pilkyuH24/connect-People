import React from "react";

const NodeInfo = ({ node, selectedNode }) => {
  if (!node) return null;

  const { name = "Unknown", job = "Unknown", location = "Unknown", nationality = "Unknown", hobbies = [] } = node.data || {};

  const xPosition = node.x + 20;
  const yPosition = node.y + 20;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const adjustedX = Math.min(xPosition, viewportWidth - 320);
  const adjustedY = Math.min(yPosition, viewportHeight - 420);

  const findCommonAttributes = () => {
    if (!selectedNode || !selectedNode.data) return { hobbies: [], location: null, nationality: null };

    const selectedHobbies = Array.isArray(selectedNode.data.hobbies) ? selectedNode.data.hobbies : [];
    const currentHobbies = Array.isArray(hobbies) ? hobbies : [];

    const common = {
      location: selectedNode.data.location === location ? location : null,
      nationality: selectedNode.data.nationality === nationality ? nationality : null,
      hobbies: currentHobbies.filter((hobby) => selectedHobbies.includes(hobby)),
    };

    return common;
  };

  const commonAttributes = findCommonAttributes();

  return (
    <div
      className="node-info"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
      }}
      role="dialog"
      aria-labelledby="node-info-title"
    >
      <h4 id="node-info-title">Node Information</h4>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Job:</strong> {job}
      </p>
      <p
        className={commonAttributes.location ? "highlight" : ""}
      >
        <strong>Location:</strong> {location}
      </p>
      <p
        className={commonAttributes.nationality ? "highlight" : ""}
      >
        <strong>Nationality:</strong> {nationality}
      </p>
      <p>
        <strong>Hobbies:</strong>
      </p>
      <ul>
        {Array.isArray(hobbies) &&
          hobbies.map((hobby, index) => (
            <li
              key={index}
              className={commonAttributes.hobbies.includes(hobby) ? "highlight" : ""}
            >
              {hobby}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default NodeInfo;
