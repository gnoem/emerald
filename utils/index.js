export const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const getAngle = (cx, cy, ex, ey) => {
  const dy = ey - cy;
  const dx = ex - cx;
  let theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

export const getOrientation = (prevX, prevY, x, y) => {
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

export const randomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}