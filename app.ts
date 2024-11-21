import express from "express";
import middleware from "./src/config/middleware";
import connectDB from "./src/config/database";
import errorhandler from "./src/config/error";
import emitLogEventMiddleware from "./src/config/logs";
import authRoutes from "./src/auth/routes";
import usersRoutes from "./src/users/routes";
import courseRoutes from "./src/courses/routes";
import enrollmentRoutes from "./src/enrollment/routes";
import messagesRoutes from "./src/messages/routes";
import commentsRoutes from "./src/comments/routes";
import uploadsRoutes from "./uploads/routes";

const app = express();

middleware(app);
connectDB();

app.use(errorhandler);
app.use(emitLogEventMiddleware);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes)
app.use("/messages", messagesRoutes);
app.use("/comments", commentsRoutes);
app.use("/uploads", uploadsRoutes);

export default app;
