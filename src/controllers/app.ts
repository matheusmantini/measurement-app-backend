import express from "express";
import cors from "cors";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const server = app.listen(5000, () => {
  if (server) {
    console.log(`Server is running in http://localhost:5000`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
