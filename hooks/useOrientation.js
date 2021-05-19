import { getAngle } from "../utils";

export const useOrientation = (prevX, prevY, x, y) => {
  const angle = getAngle(prevX, prevY, x, y);
  const angleIsBetween = (min, max) => (angle > min) && (angle <= max);
  if ((angle < 22.5) || (angle > 337.5)) return 'E';
  if (angleIsBetween(22.5, 67.5)) return 'SE';
  if (angleIsBetween(67.5, 112.5)) return 'S';
  if (angleIsBetween(112.5, 157.5)) return 'SW';
  if (angleIsBetween(157.5, 202.5)) return 'W';
  if (angleIsBetween(202.5, 247.5)) return 'NW';
  if (angleIsBetween(247.5, 292.5)) return 'N';
  if (angleIsBetween(292.5, 337.5)) return 'NE';
}