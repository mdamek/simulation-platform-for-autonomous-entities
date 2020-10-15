import { Painter } from "./Painter";

export function PrintText(painter: Painter) {
  const text = "Pracowania Problemowa Marcin Damek Dominik Kedzior";

  painter.PrintString(text);
}
