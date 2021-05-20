import { getAngle } from "../utils";

export const useOrientation = (prevX, prevY, x, y) => {
  const angle = getAngle(prevX, prevY, x, y);
  const angleIsBetween = (min, max) => (angle > min) && (angle <= max);
  if ((angle < 10) || (angle > 350)) return 'E';
  if (angleIsBetween(10, 80)) return 'SE';
  if (angleIsBetween(80, 100)) return 'S';
  if (angleIsBetween(100, 170)) return 'SW';
  if (angleIsBetween(170, 190)) return 'W';
  if (angleIsBetween(190, 260)) return 'NW';
  if (angleIsBetween(260, 280)) return 'N';
  if (angleIsBetween(280, 350)) return 'NE';
}