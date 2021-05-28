const rooms = {
  plaza: {
    objects: ['townhall', 'mossyhouse', 'wishingwell'],
    portals: [{
      to: 'swamp',
      top: 150,
      right: 0,
      size: [80, 200]
    }]
  },
  swamp: {
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