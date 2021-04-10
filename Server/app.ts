import express, { Application, Request, Response } from "express";
import { Painter } from "../Visualisations/Painter";
import { PrintOwnText } from "../Visualisations/PrintText";
import bodyParser from "body-parser";
import { XinukIteration } from "../Models/XinukInterfaces";
import { CalculateFrequency, ConvertBodyToXinukIteration } from "./helpers";
import { FillPanelPixels } from "../Visualisations/FillPanelPixels";
import { performance } from "perf_hooks";

const PORT = 8000;

let savedTime: number;
let requestsNumber: number = 0;

const app: Application = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const painter = new Painter();

app.get("/test", (req: Request, res: Response) => {
  FillPanelPixels(5, painter);
  painter.Clear();
  res.sendStatus(200);
});

app.get("/text/:text", (req: Request, res: Response) => {
  let text: string = req.params["text"];
  PrintOwnText(painter, text);
  painter.Clear();
  res.sendStatus(200);
});

app.post("/xinukIteration", (req: Request, res: Response) => {
  const xinukIteration: XinukIteration = ConvertBodyToXinukIteration(req.body);
  painter.Paint(xinukIteration.points);
  const updatePerformanceFrequency = 15;
  if (requestsNumber % updatePerformanceFrequency == 0) {
    if (requestsNumber != 0) {
      CalculateFrequency(updatePerformanceFrequency, savedTime);
    }
    savedTime = performance.now();
  }
  requestsNumber++;
  res.sendStatus(200);
});

app.get("/clear", (req: Request, res: Response) => {
  painter.Clear();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  painter.PrintString("LED server is ready");
});

