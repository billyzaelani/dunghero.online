const SocketIO = require('socket.io');

function getRandomLocation() {
  return {
    x: Math.random(),
    y: Math.random() * 0.8,
  };
}

module.exports = (server) => {
  const io = SocketIO(server);
  const clients = {};
  const gameState = {
    dungCollected: 0,
    animals: [{
      id: 0,
      emoji: '🐅',
      location: getRandomLocation(),
    }, {
      id: 1,
      emoji: '🐘',
      location: getRandomLocation(),
    }, {
      id: 2,
      emoji: '🐂',
      location: getRandomLocation(),
    }, {
      id: 3,
      emoji: '🐧',
      location: getRandomLocation(),
    }, {
      id: 4,
      emoji: '🐿',
      location: getRandomLocation(),
    }],
    dungs: [{
      id: 0,
      location: getRandomLocation(),
    }, {
      id: 1,
      location: getRandomLocation(),
    }, {
      id: 2,
      location: getRandomLocation(),
    }, {
      id: 3,
      location: getRandomLocation(),
    }, {
      id: 4,
      location: getRandomLocation(),
    }, {
      id: 5,
      location: getRandomLocation(),
    }, {
      id: 6,
      location: getRandomLocation(),
    }, {
      id: 7,
      location: getRandomLocation(),
    }],
  };

  let hasUpdate = false;
  io.on('connection', (socket) => {
    console.log('Connected clients', Object.keys(clients).length);
    clients[socket.id] = true;
    const lastCollected = Date.now();
    socket.emit('game-state', gameState);
    socket.on('collect-dung', ({ id }) => {
      if (Date.now() - lastCollected < 1000) return;
      const dungIndex = gameState.dungs.findIndex((dung) => dung.id === id);
      if (dungIndex !== -1) {
        gameState.dungs[dungIndex].location = getRandomLocation();
        gameState.dungCollected += 1;
        hasUpdate = true;
      }
    });
    socket.on('disconnect', () => {
      delete clients[socket.id];
    });
  });

  setInterval(() => {
    if (hasUpdate) {
      io.emit('game-state', gameState);
      hasUpdate = false;
    }
  }, 300);
};
