import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import countryRoutes from "./routes/countryRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL!,
      process.env.LOCAL_FRONTEND_URL!,
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/countries", countryRoutes);

app.use(errorHandler);

export default app;
