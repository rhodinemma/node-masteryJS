const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
