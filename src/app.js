import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" }; // Note: Ensure Node.js v20+ is being used
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
// 2. Security Headers
app.use(helmet());

// 3. Rate Limiting (Increased limit slightly to prevent blocking on page load)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased to 500 for a news app frontend
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again later." },
});
app.use("/api", limiter); // Best practice: Sirf /api routes par limit lagao, static files par nahi

// 4. Logger (Only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// 5. Core Body Parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// 6. Routes Import
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import articleRouter from "./routes/article.routes.js";
import commentRouter from "./routes/comment.routes.js";
import videoRouter from "./routes/video.routes.js";
import webstoryRouter from "./routes/webstory.routes.js";
import adRouter from "./routes/ad.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import epaperRouter from "./routes/epaper.routes.js";

// 7. Routes Declaration
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Times News API Docs",
}));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/webstories", webstoryRouter);
app.use("/api/v1/ads", adRouter);
app.use("/api/v1/settings", settingsRouter);
app.get("/api/v1/test", (req, res) => res.send("OK"));
app.use("/api/v1/epaper", epaperRouter);

// 8. Global Error Handler (Hamesha sabse last mein)
app.use(globalErrorHandler);

export { app };