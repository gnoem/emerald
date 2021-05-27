import { clickedInside, getDistanceBetween, getOrientation, randomIntBetween } from "../../utils";

export const moveUser = (e, { socket, playerId, view, userInstances, ref, collisionZones }) => {
  if (Object.entries(view).length) return;
  if (clickedInside(e, ['Chat', 'User', 'UserCard'])) return;
  const { clientX, clientY } = e;
  const [canvas, canvasRect] = [ref.current, ref.current.getBoundingClientRect()];
  let position = {
    x: (clientX - canvasRect.left),
    y: (clientY - canvasRect.top)
  }
  // need to base prev coords on user element's coords AT TIME OF CLICK
  let prevPosition = userInstances[playerId].getBoundingClientRect();
  prevPosition = {
    x: prevPosition.x - canvasRect.left,
    y: prevPosition.y - canvasRect.top
  }
  const orientation = getOrientation(prevPosition.x, prevPosition.y, position.x, position.y);
  // check for collisions - look at what objects are inside the map and check to see if they lie in the user's projected path
  // if so, adjust position so that the projected path ends at the collision object's boundary
  const preventCollision = () => {
    const collisionPoint = getCollisionPoint(collisionZones, { prevPosition, position }, canvas);
    if (collisionPoint) {
      position = collisionPoint;
    }
  }
  preventCollision();
  socket.emit('a user moved', {
    socketId: playerId,
    position,
    orientation
  });
}

const getCollisionPoint = (collisionZones, { prevPosition, position }, canvas) => { // will return { x, y } coordinates if collision
  const canvasRect = canvas.getBoundingClientRect();
  // loop through all collision zones - for each, get top, left, right, bottom;
  // get 4 lines segments: N boundary, E boundary, S boundary, W boundary
  const objectBoundaries = Object.entries(collisionZones).map(([name, element]) => {
    if (!element) return null;
    let { top: originalTop, bottom: originalBottom, left: originalLeft, right: originalRight } = element.getBoundingClientRect();
    const [width, height] = [originalRight - originalLeft, originalBottom - originalTop];
    const top = originalTop - canvasRect.top;
    const bottom = top + height;
    const left = originalLeft - canvasRect.left;
    const right = left + width;
    return {
      [`${name}-N`]: [{ x: left, y: top }, { x: right, y: top }],
      [`${name}-E`]: [{ x: right, y: top }, { x: right, y: bottom }],
      [`${name}-S`]: [{ x: right, y: bottom }, { x: left, y: bottom }],
      [`${name}-W`]: [{ x: left, y: bottom }, { x: left, y: top }]
    }
  }).filter(el => el);
  const collisionPoints = Object.values(objectBoundaries).map(boundaries => {
    return Object.entries(boundaries).map(([boundaryName, points]) => {
      const [p1, p0] = points;
      const boundary = {
        x: p1.x - p0.x,
        y: p1.y - p0.y
      }
      const path = {
        x: prevPosition.x - position.x,
        y: prevPosition.y - position.y
      }
      const s = (-boundary.y * (p0.x - position.x) + boundary.x * (p0.y - position.y)) / (-path.x * boundary.y + boundary.x * path.y);
      const t = (path.x * (p0.y - position.y) - path.y * (p0.x - position.x)) / (-path.x * boundary.y + boundary.x * path.y);
      const getPadding = () => { // this is to prevent getting "stuck" on the boundary line
        const direction = boundaryName.split('-')[1];
        switch (direction) {
          case 'N': return { x: 0, y: -1 };
          case 'E': return { x: 1, y: 0 };
          case 'S': return { x: 0, y: 1 };
          case 'W': return { x: -1, y: 0 };
        }
      }
      if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return { // point of intersection, with 1px of padding in opposite direction of boundary
          boundaryName,
          x: p0.x + (t * boundary.x) + getPadding().x,
          y: p0.y + (t * boundary.y) + getPadding().y
        }
      }
      return null;
    });
  }).flat().filter(el => el);
  const showCollisionPoints = () => {
    collisionPoints.forEach(point => {
      const div = document.createElement('div');
      div.className = `collisionPoint ${point.boundaryName}` //.add(styles.collisionPoint);
      console.log(point);
      div.style.top = `${point.y}px`;
      div.style.left = `${point.x}px`;
      div.addEventListener('click', () => {
        console.log(Object.values(objectBoundaries).find(element => element.boundaryName === point.boundaryName));
      });
      canvas.appendChild(div);
    });
  }
  const closestCollisionPoint = () => {
    const distances = collisionPoints.map(point => {
      return getDistanceBetween(prevPosition.x, prevPosition.y, point.x, point.y);
    });
    distances.sort((a, b) => a - b);
    const shortestDistance = distances[0];
    const closestPoint = collisionPoints.find(point => {
      return getDistanceBetween(prevPosition.x, prevPosition.y, point.x, point.y) === shortestDistance;
    })
    return closestPoint;
  }
  // todo also!!!! if the closest 2 collision points are sufficiently close together, set position to the 3rd collision point if there is one or to the original target
  // that way the user's path won't be interrupted by the corner of a collision zone where it would be more natural to just go through it
  // or maybe in the collision zone definition, set "wiggle room" property/closeness threshold for each corner (NW, NE, SE, SW)
  // showCollisionPoints();
  return closestCollisionPoint();
}

export const getSpawnPosition = (canvas, objectsRef) => {
  // generate x, y roughly in the center of the canvas
  const { width, height } = canvas.getBoundingClientRect();
  const radius = 50;
  const xRange = [(0.5 * width) - radius, (0.5 * width) + radius];
  const yRange = [(0.5 * height) - radius, (0.5 * height) + radius];
  // generate a set of Forbidden Ranges from objectsRef elements
  const forbiddenRanges = Object.values(objectsRef).map(element => {
    const { top, left } = element.style;
    const [objectTop, objectLeft] = [parseInt(top), parseInt(left)];
    const { width: objectWidth, height: objectHeight } = element.getBoundingClientRect();
    console.log(`(${objectLeft}, ${objectTop}): ${objectWidth} by ${objectHeight}`);
    return {
      top: objectTop,
      bottom: objectTop + objectHeight,
      left: objectLeft,
      right: objectLeft + objectWidth
    }
  });
  const tryPosition = () => ({
    x: randomIntBetween(xRange[0], xRange[1]),
    y: randomIntBetween(yRange[0], yRange[1]),
    spawn: true
  });
  let randomPosition = tryPosition();
  // check generated x, y against each object in forbiddenRanges
  const spawnIsAllowed = (position) => {
    for (let i = 0; i < forbiddenRanges.length; i++) {
      const { top, bottom, left, right } = forbiddenRanges[i];
      if ((position.x > left) && (position.x < right) && (position.y > top) && (position.y < bottom)) return false;
    }
    return true;
  }
  while (!spawnIsAllowed(randomPosition)) {
    randomPosition = tryPosition();
  }
  return randomPosition;
}