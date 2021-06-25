interface IRoomPortal {
  to: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size: number[];
  // why is IPortal from <Map> making me put these in here:
  coords?: any;
  name?: string;
  rect?: any;
}

interface IRoom {
  bg?: string;
  objects: string[];
  portals: IRoomPortal[];
}

const rooms: {
  [roomName: string]: IRoom
} = {
  plaza: {
    bg: 'outside',
    objects: ['townhall', 'mossyhouse', 'wishingwell'],
    portals: [{
      to: 'swamp',
      top: 150,
      right: 0,
      size: [80, 200]
    }]
  },
  swamp: {
    bg: 'outside',
    objects: ['witchshack'],
    portals: [{
      to: 'plaza',
      top: 150,
      left: 0,
      size: [80, 200]
    }]
  },
  townhall: {
    objects: [],
    portals: [{
      to: 'plaza',
      bottom: 0,
      right: 0,
      size: [100, 100]
    }]
  },
  witchshack: {
    objects: [],
    portals: [{
      to: 'swamp',
      bottom: 0,
      left: 0,
      size: [100, 100]
    }]
  }
}

export default rooms;