import { FillPanelPixels } from "./FillPanelPixels";
import { GameOfLife } from "./GameOfLife";
import { ShowImage } from "./ShowImage";
import { PrintText } from "./PrintText";
import { NextPixelsOn } from "./NextPixelsOn";
import { Painter } from "./Painter";

const painter = new Painter();

NextPixelsOn(1024, painter);
FillPanelPixels(5, painter);
GameOfLife(50, painter);
ShowImage(painter).then(() => PrintText(painter));
