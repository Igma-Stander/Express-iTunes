const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const path = require("path");

// Create an Express application
const app = express();
const port = process.env.PORT || 8000;

// Secret key for JWT token signing
const jwtSecretKey = "Hyperion";

// Middleware to parse JSON bodies
app.use(express.json());

// Serve React static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  // Serve React app's index.html
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    // Attach decoded user information to the request object
    req.user = decoded;
    next();
  });
};

// API route for iTunes search
app.get("/api/search", verifyToken, async (req, res) => {
  const { term, media } = req.query;
  const endpoint = `https://itunes.apple.com/search?term=${term}&media=${media}`;

  // if (media && media !== "all") {
  //   endpoint += `&media=${media}`;
  // }

  try {
    // Fetch data from iTunes API
    const response = await axios.get(endpoint);
    // Send back the response data from iTunes API
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from iTunes API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API route to generate JWT token
app.get("/api/generate-token", (req, res) => {
  try {
    const payload = { api: "itunes-api", scope: "public" };
    // Generate JWT token with a 1-hour expiration
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Token generation error", error);
    res.status(500).json({ error: "Token generation failed" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
