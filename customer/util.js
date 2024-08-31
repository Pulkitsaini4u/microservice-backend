const Redis = require('ioredis');

module.exports.CreateChannel = async () => {
  try {
    const channel = new Redis();
    const subscriber = new Redis();
    return ({channel, subscriber})
  } catch (err) {
    console.error('Error creating channel:', err.message);
    throw err;
  }
};