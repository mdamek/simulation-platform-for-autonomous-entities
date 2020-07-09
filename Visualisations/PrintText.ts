import { Painter } from "./Painter";

export function PrintText(painter: Painter) {
  let text = "Pracowania Problemowa Marcin Damek Dominik Kedzior";

  painter.PrintString(text);
}
