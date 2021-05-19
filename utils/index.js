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

export const randomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}