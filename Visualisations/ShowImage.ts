import { Painter } from "./Painter";

let painter = new Painter();

let paths: string[] = [
  "./images/play.png",
  "./images/cat.png",
  "./images/plane.png",
  "./images/house.jpeg",
  "./images/apple.png",
  "./images/flower.png",
  "./images/eye.png",
  "./images/powerdrill.png",
  "./images/rgb.png",
  "./images/painter.png",
  "./images/x.png",
  "./images/hand.png",
];

for (let i = 0; i < paths.length; i++) painter.ShowImage(paths[i], 1000);
