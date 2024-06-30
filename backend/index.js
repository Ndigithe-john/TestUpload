require("dotenv").config();
const express = require("express");
const cors = require("cors");
const AppError = require("./src/utils/appError");
const globalErrorHandlers = require("./src/controllers/errorControllers");
const paymentRoutes = require("./src/routes/paymentRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const documentsRoutes = require("./src/routes/documentsRoutes");
const {
  RedisClient,
  BlackListedRedisClient,
} = require("./src/config/redisConfig");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/payment", paymentRoutes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/", documentsRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandlers);
const startServer = async () => {
  try {
    await RedisClient.connect();
    await BlackListedRedisClient.connect();
    console.log("Connected to Redis");

    const port = process.env.PORT || 3003;
    app.listen(port, () => console.log(`App running on port ${port}`));
  } catch (error) {
    console.error("Failed to start the server:", error);
    next(new AppError(error, 500));
  }
};

startServer();

module.exports = { BlackListedRedisClient };
