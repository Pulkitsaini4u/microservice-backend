const Redis = require('ioredis');
const axios = require('axios');

module.exports.CreateChannel = async () => {
  try {
    const channel = new Redis();
    const subscriber = new Redis();
    subscriber.subscribe('product');
    subscriber.on('message', async (client, message) => {
      try {
        const apiUrl = 'http://localhost:1000/api/updateProductStock';
        const response = await axios.put(apiUrl, JSON.parse(message));
        if (response && response.data) {
          channel.publish('customer', Buffer.from(JSON.stringify({ isSuccess: true })));
        } else {
          channel.publish('customer', Buffer.from(JSON.stringify({ isSuccess: false })));
        }
      } catch (error) {
        throw error;
      }
    });
    return channel
  } catch (err) {
    console.error('Error creating channel:', err.message);
    throw err;
  }
};

