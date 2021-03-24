import express, { Application } from "express";
import { Painter } from "../Visualisations/Painter";
import { FillPanelPixels } from "../Visualisations/FillPanelPixels";
import { PrintOwnText } from "../Visualisations/PrintText";

const PORT = 8000;

const app: Application = express();

const painter = new Painter();

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/testPanel", (req, res) => {
  FillPanelPixels(1, painter);
  painter.Clear();
});

app.get("/text/:text", (req, res) => {
  let text: string = req.params["text"];
  PrintOwnText(painter, text);
  painter.Sleep(3000);
  painter.Clear();
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
