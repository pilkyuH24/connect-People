# 🌐 Connect People - A Dynamic Node Visualization App

**Connect People** is a web application designed to **visually represent and interact with people as nodes**. Each node contains individual data such as name, job, location, nationality, and hobbies. The app leverages **MongoDB for data storage** and **Vercel for deployment**, offering a smooth and interactive experience. 🚀

---

## ✨ Key Features

### 🎨 Dynamic Node Visualization
- Nodes dynamically render on a **canvas**, with **connections drawn based on shared attributes** (hobbies, location, nationality).
- Smooth animations and real-time interactivity enhance the user experience.

### 📝 Profile Setup
- 👤 Users can set up their profile with details like **name, job, location, nationality, and hobbies**.

### 🔍 Interactive Filters
- 🕵️‍♂️ Users can **filter connections based on specific criteria** (e.g., hobbies, location, nationality).

### 🛠️ Backend Integration
- 💾 **Powered by MongoDB** for storing user profiles and nodes.
- 📡 **Custom API endpoints** (`/api/addNode` and `/api/getNodes`) for **adding new profiles and fetching node data**.

---

## 🔄 Optimized Data Synchronization: Polling + Delta Updates

To ensure **efficient real-time updates without unnecessary server load**, this project **replaces WebSockets** with a **Polling + Delta Updates** mechanism.

### 🔹 Why Polling + Delta Updates?
🚀 **Reduces server load** compared to WebSockets.  
📉 **Minimizes network traffic** by sending **only changed data** instead of full datasets.  
📡 **Ensures reliability** even in **unstable networks** where WebSockets may disconnect.  

### 🔹 How It Works
1️⃣ **Polling**: The frontend **requests updates every 5 seconds** instead of maintaining a persistent WebSocket connection.  
2️⃣ **Delta Updates**: Instead of fetching all data, the server **only returns data that has changed since the last request**.  

### 🔹 Backend (MongoDB + Next.js API Route)
- `updatedAt` timestamps track when data is modified.
- The `/api/getNodes` endpoint fetches **only modified nodes** since the client’s last request.

```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lastFetched = new Date(Number(searchParams.get("lastFetched")) || 0);

  const { db } = await connectToDatabase();
  if (!db) return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });

  const updatedData = await db.collection('people')
    .find({ createdAt: { $gt: lastFetched } }) // Fetch only updated data
    .toArray();

  return NextResponse.json({ changes: updatedData, lastUpdated: Date.now() });
}

### 🔹 Frontend (Polling Implementation)
- Automatically fetches updates every 5 seconds.
- Stores the last update timestamp to request only new data.

```javascript
useEffect(() => {
  const fetchData = async () => {
    const response = await axios.get('/api/getNodes', { params: { lastFetched: lastUpdated } });
    setData(prev => [...prev, ...response.data.changes]); // Append new data
    setLastUpdated(response.data.lastUpdated);
  };

  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, [lastUpdated]);


---

## 💻 **Technical Stack**
- **Frontend**: ⚛️ React with Next.js.
- **Backend**: 🟢 Node.js, 🍃 MongoDB (Atlas).
With Polling + Delta Updates, Connect People achieves efficient, scalable, and near real-time data synchronization while keeping server load minimal. 🚀

[Visit Demo](https://connect-people.vercel.app/) ✅

![Alt text](/public/profile.png)
![Alt text](/public/screenshot.png)

