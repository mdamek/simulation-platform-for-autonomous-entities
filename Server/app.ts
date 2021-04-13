import express, { Application, Request, Response } from "express";
import { Painter } from "../Visualisations/Painter";
import { PrintOwnText } from "../Visualisations/PrintText";
import bodyParser from "body-parser";
import { XinukIteration } from "../Models/XinukInterfaces";
import { CalculateFrequency, ConvertBodyToXinukIteration } from "./helpers";
import { FillPanelPixels } from "../Visualisations/FillPanelPixels";
import { performance } from "perf_hooks";
import axios from "axios";

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

app.get("/paintPixel/:x/:y", (req: Request, res: Response) => {
  let x: number = +req.params["x"];
  let y: number = +req.params["y"];
  painter.PaintPixel(x, y);
  res.sendStatus(200);
});

app.get("/clearPixelsState", (req: Request, res: Response) => {
  painter.ClearPixelsState();
  res.sendStatus(200);
});

app.get("/pixelsGlobal/:shape", (req: Request, res: Response) => {
  let shape: string = req.params["shape"];

  //let nodeIp1: string = "192.168.100.180";
  let nodeIp2: string = "192.168.100.185";
  let nodeIp3: string = "192.168.100.192";
  let nodeIp4: string = "192.168.100.191";

  axios.all([
    axios.get<number[][]>(`http://${nodeIp1}/pixelsLocal:${PORT}`),
    axios.get<number[][]>(`http://${nodeIp2}/pixelsLocal:${PORT}`),
    axios.get<number[][]>(`http://${nodeIp3}/pixelsLocal:${PORT}`),
    axios.get<number[][]>(`http://${nodeIp4}/pixelsLocal:${PORT}`),
  ]).then(axios.spread((response1, response2, response3) => {
    console.log(response1)
    console.log(response2)
    console.log(response3)
    //console.log(response4)
  })).catch(error => {
    console.log(error);
  });
  res.send(shape)
});

app.get("/pixelsLocal", (req: Request, res: Response) => {
  const localState = painter.GetPixelsState();
  res.json(localState)
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

