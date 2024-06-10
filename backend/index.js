require("dotenv").config();
const express = require("express");
const cors = require("cors");
const AppError = require("./src/utils/appError");
const globalErrorHandlers = require("./src/controllers/errorControllers");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const app = express();
app.use(express.json());
async function startServer() {
  app.use(cors());
  try {
    app.use("/", userRoutes);
    app.use("/admin", adminRoutes);
    app.all("*", (req, res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });
    app.use(globalErrorHandlers);
    const port = process.env.PORT || 3003;
    app.listen(port, () => console.log(`app running on port ${port}`));
  } catch (error) {
    console.log(error);
    return next(new AppError(error, 500));
  }
}

startServer();
