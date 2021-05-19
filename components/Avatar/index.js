export const colorMap = {
  blue: ['#005b97', '#0075be', '#1e9cd7', '#cce0f4'],
  pink: ['#930097', '#B900BE', '#D01ED7', '#F1CCF4'],
  green: ['#609700', '#7ABE00', '#9DD71E', '#E6F4CC'],
}

const Avatar = ({ orientation, outfit, socketId, isMoving }) => {
  const color = colorMap[outfit?.color ?? 'blue'];
  return (
    <>
      {(orientation === 'N') && <AvatarS {...{ socketId, color, isMoving }} />}
      {(orientation === 'NE') && <AvatarSW {...{ socketId, color, isMoving }} />}
      {(orientation === 'NW') && <AvatarSE {...{ socketId, color, isMoving }} />}
      {(orientation === 'S') && <AvatarS {...{ socketId, color, isMoving }} />}
      {(orientation === 'SE') && <AvatarSE {...{ socketId, color, isMoving }} />}
      {(orientation === 'SW') && <AvatarSW {...{ socketId, color, isMoving }} />}
      {(orientation === 'E') && <AvatarE {...{ socketId, color, isMoving }} />}
      {(orientation === 'W') && <AvatarW {...{ socketId, color, isMoving }} />}
    </>
  );
}

const AvatarS = ({ socketId, color, isMoving }) => {
  return (
    <svg viewBox="0 0 73.92 78.77">
      <defs>
        <linearGradient id={`${socketId}-linear-gradient`} x1="31.4" y1="53.77" x2="84.52" y2="53.77" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color[0]}/>
          <stop offset="0.23" stopColor={color[1]}/>
          <stop offset="0.6" stopColor={color[2]}/>
          <stop offset="1" stopColor={color[3]}/>
        </linearGradient>
        <linearGradient id={`${socketId}-linear-gradient-2`} x1="21.38" y1="68.94" x2="33.95" y2="68.94" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-3`} x1="82.72" y1="69.16" x2="95.29" y2="69.16" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-4`} x1="39.44" y1="90.12" x2="50.1" y2="90.12" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-5`} x1="66.5" y1="90.11" x2="77.16" y2="90.11" xlinkHref={`#${socketId}-linear-gradient`}/>
      </defs>
      <path d="M32.5,62.06a104.47,104.47,0,0,1-1.1-15.43c0-5.4.11-8.09.7-10.42A22.63,22.63,0,0,1,45,21.6c5.91-2.62,12.47-2.93,18.82-2.36,4.36.4,9.42,1.47,13.88,6A24.32,24.32,0,0,1,83.5,35.63c.85,2.92.91,5.65,1,11a136.14,136.14,0,0,1-1,17.63c-.74,7.35-1.27,9.23-2,11a23.62,23.62,0,0,1-5,7.71c-5.9,5.86-13.65,5.65-19,5.51-4.86-.14-11.56-.32-17-5.53a23.35,23.35,0,0,1-4.74-6.67C33.94,72.69,33.43,69.1,32.5,62.06Z" transform="translate(-21.38 -19)" style={{ fill: `url(#${socketId}-linear-gradient)` }}/>
      <path d="M32.5,60.5c-1.22-.55-2.9.69-6,3-2,1.46-3.11,2.33-4,4a7.28,7.28,0,0,0-1,5c.52,2.48,2.7,4.88,5,5,3.78.21,6.27-5.82,7-9C34.12,65.81,34.35,61.34,32.5,60.5Z" transform="translate(-21.38 -19)" style={{ fill: `url(#${socketId}-linear-gradient-2)` }} />
      <path d="M84.17,60.72c1.22-.55,2.9.69,6,3,2,1.46,3.11,2.34,4,4a7.28,7.28,0,0,1,1,5c-.52,2.49-2.7,4.88-5,5-3.78.21-6.27-5.82-7-9C82.55,66,82.32,61.56,84.17,60.72Z" transform="translate(-21.38 -19)" style={{ fill: `url(#${socketId}-linear-gradient-3)` }} />
      <path d="M42.09,96.66a4.56,4.56,0,0,0,3.79,1,4.53,4.53,0,0,0,2.91-2.71,9.79,9.79,0,0,0,.44-1.67,37.8,37.8,0,0,0,.87-7.48A3.13,3.13,0,0,0,50,85a2.64,2.64,0,0,0-1.22-1.4,8.5,8.5,0,0,0-3.88-1.15,5.47,5.47,0,0,0-4.32,1.28,1.7,1.7,0,0,0-.39.81C39.87,85.68,37.87,93.56,42.09,96.66Z" transform="translate(-21.38 -19)" style={{ fill: `url(#${socketId}-linear-gradient-4)` }} />
      <path d="M74.51,96.66a4.6,4.6,0,0,1-3.79,1,4.53,4.53,0,0,1-2.91-2.71,8.84,8.84,0,0,1-.44-1.68,36.89,36.89,0,0,1-.87-7.47,2.77,2.77,0,0,1,.08-.76,2.55,2.55,0,0,1,1.22-1.39,8.38,8.38,0,0,1,3.88-1.15A5.49,5.49,0,0,1,76,83.75a1.73,1.73,0,0,1,.39.82C76.72,85.67,78.72,93.56,74.51,96.66Z" transform="translate(-21.38 -19)" style={{ fill: `url(#${socketId}-linear-gradient-5)` }} />
    </svg>
  );
}

const AvatarSE = ({ socketId, color, isMoving }) => {
  return (
    <svg viewBox="0 0 56.8 78.2">
      <defs>
        <linearGradient id={`${socketId}-linear-gradient`} x1="76.75" y1="61.32" x2="87.32" y2="61.32" gradientTransform="translate(6.53 -6.13) rotate(6)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color[0]}/>
          <stop offset="0.23" stopColor={color[1]}/>
          <stop offset="0.6" stopColor={color[2]}/>
          <stop offset="1" stopColor={color[3]}/>
        </linearGradient>
        <linearGradient id={`${socketId}-linear-gradient-2`} x1="66.91" y1="85.05" x2="76.07" y2="85.05" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-3`} x1="31.76" y1="53.82" x2="84" y2="53.82" gradientTransform="matrix(0.91, 0.1, -0.1, 0.99, 9.21, -5.85)" gradientUnits="userSpaceOnUse">
          <stop offset="0.19" stopColor={color[0]}/>
          <stop offset="0.32" stopColor={color[1]}/>
          <stop offset="0.6" stopColor={color[2]}/>
          <stop offset="1" stopColor={color[3]}/>
        </linearGradient>
        <linearGradient id={`${socketId}-linear-gradient-4`} x1="31.27" y1="70.34" x2="44.05" y2="70.34" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-5`} x1="46.73" y1="91.11" x2="59.1" y2="91.11" xlinkHref={`#${socketId}-linear-gradient`}/>
      </defs>
      <path d="M78.4,55.94c1.07-.35,2.36.84,4.75,3a10,10,0,0,1,3,3.7,6.08,6.08,0,0,1,.4,4.27c-.65,2-2.69,3.83-4.62,3.74-3.18-.16-4.73-5.42-5.06-8.14C76.58,60.24,76.78,56.48,78.4,55.94Z" transform="translate(-29.98 -19.55)" style={{ fill: `url(#${socketId}-linear-gradient)` }}>
        {/* left arm */}
        <Animation show={isMoving} attributeName="transform" type="translate" values="-29.98 -19.55;-29.98 -22.55;-29.98 -19.55" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M70.47,91.5a4.12,4.12,0,0,1-3.33.46,3.86,3.86,0,0,1-2.25-2.47,6.8,6.8,0,0,1-.23-1.41,29.61,29.61,0,0,1-.11-6.17,2.57,2.57,0,0,1,.14-.61,2.09,2.09,0,0,1,1.16-1,7.46,7.46,0,0,1,3.41-.59,4.83,4.83,0,0,1,3.58,1.42,1.44,1.44,0,0,1,.27.71C73.3,82.74,74.33,89.35,70.47,91.5Z" transform="translate(-29.98 -19.55)"  style={{ fill: `url(#${socketId}-linear-gradient-2)` }}>
        {/* left leg */}
        <Animation show={isMoving} attributeName="transform" type="translate" values="-32.98 -22.55;-29 -21.55;-32.98 -22.55" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M35,66.83a85,85,0,0,1-1.4-15c-.21-10.41-.31-15.62,2.2-21A20.53,20.53,0,0,1,41.59,23c4.7-3.71,9.83-3.61,19.19-3.28,7.33.26,11,.38,13.63,2.49,4.48,3.59,5.18,9.72,6.08,17.61.77,6.75.07,11.87-1.33,22.12C77.61,73.23,76,76.79,73.36,79.34A23.24,23.24,0,0,1,68,83a30.49,30.49,0,0,1-10.25,3.17C51.8,87,47,87.66,43.05,84.64c-2.33-1.79-3.39-4.14-5.12-8A43.83,43.83,0,0,1,35,66.83Z" transform="translate(-29.98 -19.55)" style={{ fill: `url(#${socketId}-linear-gradient-3)` }}>
        {/* body */}
        <Animation show={isMoving} attributeName="transform" type="translate" values="-29.98 -19.55;-29.98 -22.55;-29.98 -19.55" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M41.71,60.91a4.91,4.91,0,0,0-1.85-1.83,5,5,0,0,0-4,.21c-2.65,1.17-3.71,3.94-4.71,6.54-.87,2.27-1.38,3.62-1.07,5.42.4,2.33,2.14,5.16,4.45,5.5,3.63.52,6.53-5.43,7.9-8.22a7.07,7.07,0,0,0,.86-3.43A7.49,7.49,0,0,0,41.71,60.91Z" transform="translate(-29.98 -19.55)"  style={{ fill: `url(#${socketId}-linear-gradient-4)` }}>
        {/* right arm */}
        <Animation show={isMoving} attributeName="transform" type="translate" values="-29.98 -19.55;-29.98 -22.55;-29.98 -19.55" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M47.12,96.33a4.72,4.72,0,0,0,3.68,1.38A4.56,4.56,0,0,0,54,95.31a9,9,0,0,0,.61-1.62,37.11,37.11,0,0,0,1.65-7.34,3.22,3.22,0,0,0,0-.76,2.57,2.57,0,0,0-1.07-1.51,8.81,8.81,0,0,0-3.74-1.55,10,10,0,0,0-4,.1,6.23,6.23,0,0,0-2.09.79C42.66,85.33,43.14,93,47.12,96.33Z" transform="translate(-29.98 -19.55)"  style={{ fill: `url(#${socketId}-linear-gradient-5)` }}>
        {/* right leg */}
        <Animation show={isMoving} attributeName="transform" type="translate" values="-29 -21.55;-32.98 -22.55;-29 -21.55" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

const AvatarSW = ({ socketId, color, isMoving }) => {
  return (
    <svg viewBox="0 0 56.8 78.2">
      <defs>
        <linearGradient id={`${socketId}-linear-gradient`} x1="76.75" y1="61.32" x2="87.32" y2="61.32" gradientTransform="matrix(-0.99, 0.1, 0.1, 0.99, 110.23, -6.13)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color[3]}/>
          <stop offset="0.4" stopColor={color[2]}/>
          <stop offset="0.77" stopColor={color[1]}/>
          <stop offset="1" stopColor={color[0]}/>
        </linearGradient>
        <linearGradient id={`${socketId}-linear-gradient-2`} x1="66.91" y1="85.05" x2="76.07" y2="85.05" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-3`} x1="31.76" y1="53.82" x2="84" y2="53.82" gradientTransform="matrix(-0.91, 0.1, 0.1, 0.99, 107.55, -5.85)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color[3]}/>
          <stop offset="0.4" stopColor={color[2]}/>
          <stop offset="0.68" stopColor={color[1]}/>
          <stop offset="0.81" stopColor={color[0]}/>
        </linearGradient>
        <linearGradient id={`${socketId}-linear-gradient-4`} x1="31.27" y1="70.34" x2="44.05" y2="70.34" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-5`} x1="46.73" y1="91.11" x2="59.1" y2="91.11" xlinkHref={`#${socketId}-linear-gradient`}/>
      </defs>
        <path d="M38.36,55.94c-1.08-.35-2.37.84-4.76,3a10,10,0,0,0-3,3.7,6.13,6.13,0,0,0-.4,4.27c.66,2,2.69,3.83,4.62,3.74,3.18-.16,4.74-5.42,5.07-8.14C40.17,60.24,40,56.48,38.36,55.94Z" transform="translate(-29.98 -19.55)" style={{ fill: `url(#${socketId}-linear-gradient)` }} />
        <path d="M46.29,91.5a4.08,4.08,0,0,0,3.32.46,3.87,3.87,0,0,0,2.26-2.47,8.46,8.46,0,0,0,.23-1.41,28.93,28.93,0,0,0,.1-6.17,1.74,1.74,0,0,0-1.3-1.63,7.46,7.46,0,0,0-3.41-.59,4.83,4.83,0,0,0-3.58,1.42,1.44,1.44,0,0,0-.27.71C43.45,82.74,42.42,89.35,46.29,91.5Z" transform="translate(-29.98 -19.55)" style={{ fill: `url(#${socketId}-linear-gradient-2)` }} />
        <path d="M81.76,66.83a85.4,85.4,0,0,0,1.39-15c.21-10.41.31-15.62-2.2-21A20.42,20.42,0,0,0,75.16,23c-4.7-3.71-9.83-3.61-19.19-3.28-7.33.26-11,.38-13.62,2.49-4.49,3.59-5.19,9.72-6.09,17.61-.77,6.75-.07,11.87,1.34,22.12,1.54,11.31,3.17,14.87,5.79,17.42A23.45,23.45,0,0,0,48.74,83,30.58,30.58,0,0,0,59,86.19c6,.81,10.79,1.47,14.72-1.55,2.32-1.79,3.38-4.14,5.11-8A43.61,43.61,0,0,0,81.76,66.83Z" transform="translate(-29.98 -19.55)" style={{ fill: `url(#${socketId}-linear-gradient-3)` }} />
        <path d="M75,60.91a4.91,4.91,0,0,1,1.85-1.83,5,5,0,0,1,4,.21c2.65,1.17,3.71,3.94,4.7,6.54.87,2.27,1.39,3.62,1.08,5.42-.41,2.33-2.14,5.16-4.45,5.5-3.63.52-6.54-5.43-7.91-8.22a7.18,7.18,0,0,1-.86-3.43A7.64,7.64,0,0,1,75,60.91Z" transform="translate(-29.98 -19.55)" style={{ fill: `url(#${socketId}-linear-gradient-4)` }} />
        <path d="M69.63,96.33A4.69,4.69,0,0,1,66,97.71a4.56,4.56,0,0,1-3.18-2.4,9,9,0,0,1-.61-1.62,37.11,37.11,0,0,1-1.65-7.34,3.22,3.22,0,0,1,0-.76,2.61,2.61,0,0,1,1.07-1.51,8.81,8.81,0,0,1,3.74-1.55,10,10,0,0,1,4,.1,6.36,6.36,0,0,1,2.1.79C74.1,85.33,73.61,93,69.63,96.33Z" transform="translate(-29.98 -19.55)" style={{ fill: `url(#${socketId}-linear-gradient-5)` }} />
    </svg>
  );
}

const AvatarE = ({ socketId, color, isMoving }) => {
  return (
    <svg viewBox="0 0 32.52 78.74">
      <defs>
        <linearGradient id={`${socketId}-linear-gradient`} x1="42" y1="53.77" x2="74.52" y2="53.77" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color[0]}/>
          <stop offset="0.23" stopColor={color[1]}/>
          <stop offset="0.6" stopColor={color[2]}/>
          <stop offset="1" stopColor={color[3]}/>
        </linearGradient>
        <linearGradient id={`${socketId}-linear-gradient-2`} x1="51.67" y1="69.01" x2="63" y2="69.01" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-3`} x1="51.99" y1="89.87" x2="65.07" y2="89.87" xlinkHref={`#${socketId}-linear-gradient`}/>
      </defs>
      <path d="M42.68,62.06c-.32-3.83-.7-8.76-.68-15.43a74.1,74.1,0,0,1,.43-10.42c1.07-6.76,4.25-12,7.86-14.61s7.64-2.93,11.53-2.36c2.67.4,5.77,1.47,8.49,6a31.28,31.28,0,0,1,3.58,10.44c.52,2.92.56,5.65.62,11,.06,6.49-.21,11.06-.62,17.63-.45,7.35-.77,9.23-1.22,11A29,29,0,0,1,69.61,83C66,88.85,61.25,88.64,58,88.5c-3-.14-7.08-.32-10.42-5.53a27.23,27.23,0,0,1-2.9-6.67C43.55,72.69,43.25,69.1,42.68,62.06Z" transform="translate(-42 -19)" style={{ fill: `url(#${socketId}-linear-gradient)` }} />
      <path d="M58,60c-1.34,0-2.43,1.67-4,4a11.58,11.58,0,0,0-2,4,8.59,8.59,0,0,0,1,7c.23.33,2.39,3.31,5,3,3.17-.37,5-5.35,5-9C63,64.62,60.32,59.92,58,60Z" transform="translate(-42 -19)" style={{ fill: `url(#${socketId}-linear-gradient-2)` }} />
      <path d="M55.56,96.63a6.15,6.15,0,0,0,4.47,1A5.8,5.8,0,0,0,63,96c2.42-2.45,2.09-6,2-7a7.76,7.76,0,0,0-2-5,6.39,6.39,0,0,0-4.1-2A6.49,6.49,0,0,0,54,84a7.43,7.43,0,0,0-2,5A8.63,8.63,0,0,0,55.56,96.63Z" transform="translate(-42 -19)" style={{ fill: `url(#${socketId}-linear-gradient-3)` }} />
    </svg>
  );
}

const AvatarW = ({ socketId, color, isMoving }) => {
  return (
    <svg viewBox="0 0 32.52 78.74">
      <defs>
        <linearGradient id={`${socketId}-linear-gradient`} x1="42" y1="53.77" x2="74.52" y2="53.77" gradientTransform="matrix(-1, 0, 0, 1, 116.52, 0)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color[3]}/>
          <stop offset="0.4" stopColor={color[2]}/>
          <stop offset="0.77" stopColor={color[1]}/>
          <stop offset="1" stopColor={color[0]}/>
        </linearGradient>
        <linearGradient id={`${socketId}-linear-gradient-2`} x1="51.67" y1="69.01" x2="63" y2="69.01" xlinkHref={`#${socketId}-linear-gradient`}/>
        <linearGradient id={`${socketId}-linear-gradient-3`} x1="51.99" y1="89.87" x2="65.07" y2="89.87" xlinkHref={`#${socketId}-linear-gradient`}/>
      </defs>
    <path d="M73.84,62.06c.31-3.83.7-8.76.68-15.43a72.11,72.11,0,0,0-.44-10.42c-1.06-6.76-4.24-12-7.86-14.61s-7.63-2.93-11.52-2.36c-2.67.4-5.77,1.47-8.5,6a31.52,31.52,0,0,0-3.58,10.44c-.52,2.92-.55,5.65-.61,11-.07,6.49.21,11.06.61,17.63.46,7.35.78,9.23,1.23,11A28.62,28.62,0,0,0,46.91,83c3.61,5.86,8.35,5.65,11.63,5.51,3-.14,7.07-.32,10.42-5.53a27.23,27.23,0,0,0,2.9-6.67C73,72.69,73.27,69.1,73.84,62.06Z" transform="translate(-42 -19)" style={{ fill: `url(#${socketId}-linear-gradient)` }} />
    <path d="M58.52,60c1.33,0,2.43,1.67,4,4a11.75,11.75,0,0,1,2,4,8.63,8.63,0,0,1-1,7c-.23.33-2.39,3.31-5,3-3.17-.37-5-5.35-5-9C53.52,64.62,56.2,59.92,58.52,60Z" transform="translate(-42 -19)" style={{ fill: `url(#${socketId}-linear-gradient-2)` }} />
    <path d="M61,96.63a6.15,6.15,0,0,1-4.47,1,5.8,5.8,0,0,1-3-1.64c-2.43-2.45-2.1-6-2-7a7.7,7.7,0,0,1,2-5,6.36,6.36,0,0,1,4.1-2,6.51,6.51,0,0,1,4.9,2,7.43,7.43,0,0,1,2,5A8.65,8.65,0,0,1,61,96.63Z" transform="translate(-42 -19)" style={{ fill: `url(#${socketId}-linear-gradient-3)` }} />
    </svg>
  );
}

const Animation = (props) => {
  if (!props.show) return null;
  return (
    <animateTransform {...props} />
  );
}

export default Avatar;