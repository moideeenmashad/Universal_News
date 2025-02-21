// const axios = require("axios");

// const API_URLS = {
//   NEWS: process.env.NEWS_API_URL,
//   WEATHER: process.env.WEATHER_API_URL,
//   USER_AUTH: process.env.USER_AUTH_API_URL,
// };

// const fetchData = async (api, endpoint, options = {}) => {
//   try {
//     const response = await axios({
//       url: `${API_URLS[api]}${endpoint}`,
//       ...options,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to fetch from ${api}:`, error.message);
//     return null;
//   }
// };

// module.exports = fetchData;



// const express = require("express");
// const cors = require("cors");
// const fetchData = require("./utils/apiService");

// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.get("/news", async (req, res) => {
//   const data = await fetchData("NEWS", "/latest");
//   res.json(data || { error: "Failed to fetch news" });
// });

// app.get("/weather", async (req, res) => {
//   const data = await fetchData("WEATHER", "/current");
//   res.json(data || { error: "Failed to fetch weather" });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
