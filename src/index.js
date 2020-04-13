import express from "express";
import { Login, Cars } from "./routes/index.js";
import { instance } from "./orm/index.js";

const port = 3000;
const app = express();

app.use(express.json());
app.use("/login", Login);
app.use("/cars", Cars);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on("exit", () => instance.close());
