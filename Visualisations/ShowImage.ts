import { Painter } from "./Painter";

export async function ShowImage(painter: Painter) {
  const paths: string[] = [
    "./images/play.png",
    "./images/raspberry.png",
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

  for (let i = 0; i < paths.length; i++)
    await painter.ShowImage(paths[i], 1000);
}
