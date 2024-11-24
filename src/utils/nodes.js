let idCounter = 0; // Counter for generating unique IDs

export class CircleNode {
  constructor(x, y, radius, color, data) {
    this.id = idCounter++; // Assign a unique ID
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.data = data; // Holds the person's information
    // Random movement on x-axis avoiding values near 0
    this.dx = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.5);
    // Random movement on y-axis avoiding values near 0
    this.dy = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.5);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    ctx.fillStyle = this.color; // Solid color for all nodes
    ctx.fill();
    ctx.closePath();

    // Draw the text (name) in the center
    ctx.font = "16px Arial"; // Set font size and style
    ctx.fillStyle = "white"; // Set text color
    ctx.textAlign = "center"; // Align text to center horizontally
    ctx.textBaseline = "middle"; // Align text to center vertically
    ctx.fillText(this.data.name, this.x, this.y); // Render the name
  }

  update(width, height) {
    // Update the position of the node
    this.x += this.dx;
    this.y += this.dy;

    // Reverse direction if the node hits a boundary
    if (this.x + this.radius > width || this.x - this.radius < 0) this.dx *= -1;
    if (this.y + this.radius > height || this.y - this.radius < 0)
      this.dy *= -1;
  }
}

export function generateNodes(data) {
  if (!Array.isArray(data)) {
    console.error("Invalid data passed to generateNodes. Expected an array.");
    return [];
  }

  const nodes = [];
  data.forEach((person) => {
    const x = 100 + Math.random() * (window.innerWidth - 200); // Random x position
    const y = 100 + Math.random() * (window.innerHeight - 200); // Random y position

    const isSpecial = !person.name.includes("Example"); // Special condition for names without "Example"
    const radius = isSpecial ? 75 : 60; // Larger radius for special nodes
    const color = isSpecial
      ? "rgba(0, 0, 0, 0.8)" // Red color for special nodes
      : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        }, 0.8)`; // Random solid color for other nodes

    nodes.push(new CircleNode(x, y, radius, color, person));
  });
  return nodes;
}

// Sample People Data
export const peopleData = [
  {
    name: "Alice (Example)",
    job: "Frontend Developer",
    location: "San Francisco",
    nationality: "American",
    hobbies: ["Coding", "Gaming"],
  },
  {
    name: "Bob (Example)",
    job: "Backend Engineer",
    location: "Seattle",
    nationality: "Canadian",
    hobbies: ["Cooking", "Traveling"],
  },
  {
    name: "Diana (Example)",
    job: "UX Designer",
    location: "Seoul",
    nationality: "Korean",
    hobbies: ["Painting", "Traveling"],
  },
  {
    name: "Ethan (Example)",
    job: "Cloud Architect",
    location: "New York",
    nationality: "Canadian",
    hobbies: ["Hiking"],
  },
  {
    name: "George (Example)",
    job: "AI Researcher",
    location: "San Francisco",
    nationality: "American",
    hobbies: ["Yoga", "Coding"],
  },
  {
    name: "Ivy (Example)",
    job: "Product Manager",
    location: "Austin",
    nationality: "American",
    hobbies: ["Writing", "Traveling"],
  },
  {
    name: "Jack (Example)",
    job: "Software Engineer",
    location: "Los Angeles",
    nationality: "Canadian",
    hobbies: ["Gaming"],
  },
  {
    name: "Karen (Example)",
    job: "Marketing Specialist",
    location: "Los Angeles",
    nationality: "American",
    hobbies: ["Photography", "Reading"],
  },
  //   {
  //     name: "Leo (Example)",
  //     job: "Machine Learning Engineer",
  //     location: "San Diego",
  //     nationality: "American",
  //     hobbies: ["Coding", "Yoga"],
  //   },
  //   {
  //     name: "Nathan (Example)",
  //     job: "Game Developer",
  //     location: "Tokyo",
  //     nationality: "Japanese",
  //     hobbies: ["Gaming", "Hiking"],
  //   },
  //   {
  //     name: "Quinn (Example)",
  //     job: "HR Specialist",
  //     location: "Sydney",
  //     nationality: "Australian",
  //     hobbies: ["Yoga"],
  //   },
  //   {
  //     name: "Rachel (Example)",
  //     job: "QA Engineer",
  //     location: "Madrid",
  //     nationality: "Spanish",
  //     hobbies: ["Cooking", "Photography"],
  //   },
  //   {
  //     name: "Tina (Example)",
  //     job: "Network Engineer",
  //     location: "Mumbai",
  //     nationality: "Indian",
  //     hobbies: ["Gaming", "Reading"],
  //   },
];
