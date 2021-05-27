export const handleMovement = (element, { prevPosition, position }, scene) => {
  const actuallyMoved = (() => {
    if (position.spawn) return false;
    return (prevPosition?.x !== position.x) || (prevPosition?.y !== position.y);
  })();
  // prevX and prevY are the user's coords AT TIME OF CLICK, including mid-translation (so not the same as prevPosition)
  const { top, left } = element.getBoundingClientRect();
  const { prevX, prevY } = {
    prevX: left - scene.getBoundingClientRect().left,
    prevY: top - scene.getBoundingClientRect().top
  }
  const { x, y } = position;
  if ((prevX === x) && (prevY === y)) return {};
  // first need to determine transition duration, THEN start moving
  const transitionDuration = (() => {
    if (!actuallyMoved) return 0;
    const [diffX, diffY] = [Math.abs(prevX - x), Math.abs(prevY - y)];
    const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    const speed = 40; // px per second
    const duration = distance / speed;
    return duration;
  })();
  const elementProps = {
    transitionDuration: `${transitionDuration}s`,
    zIndex: `${Math.round(position.y)}`, // should ideally be based on element.getBoundingClientRect() (relative to container)
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`
  }
  return {
    actuallyMoved,
    elementProps,
    transitionDuration
  }
}