import express, { Application, Request, Response } from "express";
import { Painter } from "../Visualisations/Painter";
import { PrintOwnText } from "../Visualisations/PrintText";
import bodyParser from "body-parser";
import { XinukIteration } from "../Models/XinukInterfaces";
import { ConvertBodyToXinukIteration } from "./convertionHelpers";
import { NextPixelsOn } from "../Visualisations/NextPixelsOn";

const PORT = 8000;

const app: Application = express();
app.use(bodyParser.json({ limit: "100000mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "100000mb",
    extended: true,
    parameterLimit: 500000000,
  })
);

const painter = new Painter();

app.get("/", (req: Request, res: Response) => {
  res.send("Hi!");
  res.sendStatus(200);
});

app.get("/test", (req: Request, res: Response) => {
  NextPixelsOn(4096, painter);
  painter.Clear();
  res.sendStatus(200);
});

app.get("/text/:text", (req: Request, res: Response) => {
  let text: string = req.params["text"];
  painter.Sleep(3000);
  PrintOwnText(painter, text);
  painter.Clear();
  res.sendStatus(200);
});

app.get("/pixel/:x/:y", (req: Request, res: Response) => {
  let x: number = Number(req.params["x"]);
  let y: number = Number(req.params["y"]);
  painter.PaintPixel(x, y);
  res.sendStatus(200);
});

app.post("/xinukIteration", (req: Request, res: Response) => {
  const xinukIteration: XinukIteration = ConvertBodyToXinukIteration(req.body);
  painter.Paint(xinukIteration.points);
  console.log("Iteration: ", xinukIteration.iterationNumber);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  painter.PrintString("LED server is ready");
});

