import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import countryRoutes from "./routes/countryRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // React dev server
  credentials: true,               // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/countries", countryRoutes);

app.use(errorHandler);

export default app;
