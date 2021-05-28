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
  }
}

export default rooms;