require("dotenv").config({ path: __dirname + "/.env" }); // Ensure correct path
console.log("API KEY:", process.env.GNEWS_API_KEY); // Debugging output

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const API_KEY = process.env.GNEWS_API_KEY; // Ensure this is correct
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?country=us&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error.message); // Log error
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
