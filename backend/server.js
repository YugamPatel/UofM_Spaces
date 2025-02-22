import express from "express";
import availabilityRoutes from "./routes/availabilityRoutes.js"; // Import routes

const app = express();
const PORT = 5990;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mount Routes
app.use("/api", availabilityRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
