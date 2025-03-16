import React from "react";

const ProfileForm = ({ meData, setMeData, handleSubmit, handleOptionSelect }) => {
  return (
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
  );
};

export default ProfileForm;
