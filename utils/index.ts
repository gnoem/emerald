export const randomIntBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const getDistanceBetween = (cx: number, cy: number, ex: number, ey: number): number => {
  const dy = ey - cy;
  const dx = ex - cx;
  return Math.hypot(dx, dy);
}

export const getAngle = (cx: number, cy: number, ex: number, ey: number): number => {
  const dy = ey - cy;
  const dx = ex - cx;
  let theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

export const getOrientation = (prevX: number, prevY: number, x: number, y: number): string => {
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

export const randomFromArray = (array: any[]): any => {
  return array[Math.floor(Math.random() * array.length)];
}

export const arraysAreEqual = (array1: any[], array2: any[]): boolean => {
  if (!array1 || !array2) return false;
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    if (!array2.includes(array1[i])) {
      return false;
    }
  }
  return true;
}

export const clickedInside = (e, arrayOfClassNames: string[]): boolean => {
  for (let i = 0; i < arrayOfClassNames.length; i++) {
    const className = arrayOfClassNames[i];
    if (e.target.closest(`[class*=${className}] *`)) {
      return true;
    }
  }
  return false;
}