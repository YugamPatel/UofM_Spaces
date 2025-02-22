import express from "express";
import availabilityRoutes from "./routes/availabilityRoutes.js"; // Import routes
import cors from "cors";

const app = express();
const PORT = 5990;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Mount Routes
app.use("/api", availabilityRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
