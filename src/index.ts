import express from "express";
import { app } from "./controllers/app";
import { MeasureController } from "./controllers/MeasureController";
import { MeasureService } from "./services/MeasureService";
import { MeasureRepository } from "./repository/MeasureRepository";
import path from "path";

const measureService = new MeasureService(new MeasureRepository());
const measureController = new MeasureController(measureService);

app.post("/upload", measureController.upload);

app.patch("/confirm", measureController.confirm);

app.get("/:customer_code/list", measureController.list);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
