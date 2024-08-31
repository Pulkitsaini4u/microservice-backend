const Redis = require('ioredis');
const axios = require('axios');

module.exports.createChannel = async () => {
  try {
    const channel = new Redis();
    const subscriber = new Redis();

    subscriber.subscribe('order');
    subscriber.on('message', async (client, message) => {
      try {
        const apiUrl = 'http://localhost:1000/order/api/createOrders';
        const response = await axios.post(apiUrl, JSON.parse(message));
        if (response && response.data) {
          channel.publish('customer', Buffer.from(JSON.stringify({isSuccess: true, orderId: response.data })));
        } else {
          channel.publish('customer', Buffer.from(JSON.stringify({isSuccess: false })));
        }
      } catch (error) {
        throw error;
      }
    });
    return { channel, subscriber };
  } catch (err) {
    console.error('Error creating channel:', err.message);
    throw err;
  }
};
