import { rooms } from "@config";
import { clickedInside, getDistanceBetween, getOrientation, randomIntBetween } from "@utils";

export const moveUser = (e, { socket, playerId, room, view, userInstances, ref, collisionZones, portalZones }) => {
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
  const checkPortal = () => {
    const clickedInsidePortal = getPortalClick(room, portalZones, { position }, canvas);
    if (clickedInsidePortal) {
      position.portal = clickedInsidePortal;
    }
  }
  checkPortal();
  socket.emit('a user moved', {
    socketId: playerId,
    position,
    orientation
  });
}

const getBoundaryRelativeToCanvas = (canvas, element) => {
  if (!element || !canvas) return null;
  const canvasRect = canvas.getBoundingClientRect();
  let { top: originalTop, bottom: originalBottom, left: originalLeft, right: originalRight } = element.getBoundingClientRect();
  const [width, height] = [originalRight - originalLeft, originalBottom - originalTop];
  const top = originalTop - canvasRect.top;
  const bottom = top + height;
  const left = originalLeft - canvasRect.left;
  const right = left + width;
  return {
    top,
    bottom,
    left,
    right
  }
}

const getCollisionPoint = (collisionZones, { prevPosition, position }, canvas) => { // will return { x, y } coordinates if collision
  // loop through all collision zones - for each, get top, left, right, bottom;
  // get 4 lines segments: N boundary, E boundary, S boundary, W boundary
  const objectBoundaries = Object.entries(collisionZones).map(([name, element]) => {
    if (!element) return null;
    const { top, bottom, left, right } = getBoundaryRelativeToCanvas(canvas, element);
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
    });
    return closestPoint;
  }
  // todo also!!!! if the closest 2 collision points are sufficiently close together, set position to the 3rd collision point if there is one or to the original target
  // that way the user's path won't be interrupted by the corner of a collision zone where it would be more natural to just go through it
  // or maybe in the collision zone definition, set "wiggle room" property/closeness threshold for each corner (NW, NE, SE, SW)
  // showCollisionPoints();
  return closestCollisionPoint();
}

const getPortalClick = (currentRoom, portalZones, { position }, canvas) => {
  const portalBoundaries = Object.entries(portalZones).map(([name, element]) => {
    if (!element) return null;
    return {
      name,
      ...getBoundaryRelativeToCanvas(canvas, element)
    }
  }).filter(el => el);
  const clickedInsidePortal = () => {
    return portalBoundaries.map(boundaryDef => {
      const { name, top, bottom, left, right } = boundaryDef;
      const clickedInside = (position.x > left) && (position.x < right) && (position.y > top) && (position.y < bottom);
      if (clickedInside) {
        const arrivalZone = rooms[name].portals.find(portal => portal.to === currentRoom);
        const getArrivalBoundaries = (arrivalZone) => {
          if (!arrivalZone) return {};
          const { top, bottom, left, right, size } = arrivalZone;
          const [width, height] = size;
          let boundaryTop, boundaryBottom, boundaryLeft, boundaryRight;
          if (left != null) {
            boundaryLeft = left;
            boundaryRight = left + width;
          } else if (right != null) { // right must be defined
            boundaryLeft = canvas.getBoundingClientRect().width - width;
            boundaryRight = canvas.getBoundingClientRect().width;
          }
          if (top != null) {
            boundaryTop = top;
            boundaryBottom = top + height;
          } else if (bottom != null) {
            boundaryTop = canvas.getBoundingClientRect().height - height;
            boundaryBottom = canvas.getBoundingClientRect().height;
          }
          return { boundaryTop, boundaryBottom, boundaryLeft, boundaryRight };
        }
        const { boundaryTop, boundaryBottom, boundaryLeft, boundaryRight } = getArrivalBoundaries(arrivalZone);
        return {
          portalName: name,
          x: arrivalZone ? randomIntBetween(boundaryLeft, boundaryRight) : null,
          y: arrivalZone ? randomIntBetween(boundaryTop, boundaryBottom) : null
          // ^^ todo better - should be the left boundary (NOT a range) if coming in from the right, top boundary if coming in from the bottom, etc
          // to prevent accidentally clicking inside boundary and getting transported back
        }
      }
      return null;
    }).filter(el => el);
  }
  const clickedInside = clickedInsidePortal()[0];
  if (clickedInside) {
    const { portalName, x, y } = clickedInside;
    const spawnLocation = (x != null && y != null)
      ? { x, y, spawn: true }
      : null;
    return {
      roomName: portalName,
      spawnLocation
    }
  }
  return null;
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