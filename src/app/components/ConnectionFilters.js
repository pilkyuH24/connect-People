import React from "react";

const ConnectionFilters = ({ connectionFilters, setConnectionFilters }) => {
  return (
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
  );
};

export default ConnectionFilters;
