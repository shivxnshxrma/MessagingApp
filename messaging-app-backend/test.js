require("dotenv").config(); // Load .env variables

const jwt = require("jsonwebtoken");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTdhY2E0ZjYyNmQ5YjhkMmM4YzU5MCIsImlhdCI6MTc0MzI1NDUyMSwiZXhwIjoxNzQzMjU4MTIxfQ.Rv8OLj97abWZuWiBza-SyHPXirslnbTxolc4iFeMZys";
const secret = process.env.JWT_SECRET; // Load from .env

console.log("🔍 Using Secret:", secret);

try {
  const decoded = jwt.verify(token, secret);
  console.log("✅ Token is valid:", decoded);
} catch (error) {
  console.error("❌ Token verification failed:", error.message);
}
