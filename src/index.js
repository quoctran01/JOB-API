require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const authRouter = require("./routes/authRouter");
const jobsRouter = require("./routes/jobApiRouter");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticatedUser = require("./middleware/authMid");
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticatedUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const connectdb = require("./db/connect");
const start = async () => {
  try {
    await connectdb(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
