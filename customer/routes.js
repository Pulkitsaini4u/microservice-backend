
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const { CreateChannel } = require('./util');
var channel;
var subscriber;
(async function () {
  let value = await CreateChannel();
  channel = value.channel;
  subscriber = value.subscriber;
})();

let authenticate = async (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }
  try {
    let decoded = jwt.verify(token, secretKey);
    req.customerId = decoded.customerId;
    next();
  } catch (error) {
    res.status(401).json(error.stack);
  }
};

app.post('/register', async (req, res) => {
  try {
    let registeredCustomer = await registerCustomer(req.body);
    res.status(200).json(registeredCustomer);
  } catch (error) {
    res.status(500).json(error.stack);
  }
});

app.post('/login', async (req, res) => {
  try {
    let token = await loginCustomer(req.body);
    res.json({ token });
  } catch (error) {
    res.status(500).json(error.stack);
  }
});

app.put('/updateProfile', authenticate, async (req, res) => {
  try {
    const customerId = req.customerId;
    await updateProfile(req.body, customerId);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json(error.stack);
  }
});

app.get('/profile', authenticate, async (req, res) => {
  try {
    const customerId = req.customerId;
    let data = await getProfile(customerId);
    res.json(data);
  } catch (error) {
    res.status(500).json(error.stack);
  }
});

app.post('/addProductToCart', authenticate, async (req, res) => {
  try {
    const customerId = req.customerId;
    await addProductToCart(customerId, req.body);
    subscriber.subscribe('customer');
    let count = 0;
    let message;
    subscriber.on('message', (client, incomingData) => {
      message = {...JSON.parse(incomingData)};
      count++;
      if(count===2){
        res.json({
          orderId: message.orderId
        });
      }
    });
  } catch (error) {
    res.status(500).json(error.stack);
  }
});

function addProductToCart(customerId, { productId, quantity }) {
  return new Promise((resolve, reject) => {
    try {
      channel.publish("product", Buffer.from(JSON.stringify({ productId, quantity })));
      channel.publish("order", Buffer.from(JSON.stringify({ customerId, productId })));
      resolve();
    } catch (error) {
      reject(error);
    }
  })
}

function registerCustomer({ username, password, email, phoneNumber, address }) {
  return new Promise((resolve, reject) => {
    let returnObject = {};
    let transaction;
    global.databaseConnection.transaction()
      .then(async (fetchedTransaction) => {
        transaction = fetchedTransaction;
        return global.databaseConnection.models.customer.findOne({ where: { username } });
      })
      .then(async (existingCustomer) => {
        if (existingCustomer) {
          reject({ error: 'user already exists' });
          return;
        } else {
          return global.databaseConnection.models.customer.create(
            {
              username,
              password: await bcrypt.hash(password, 10),
              createdDateTimeUtc: new Date(),
              lastUpdatedDateTimeUtc: new Date(),
            },
            { transaction }
          );
        }
      })
      .then((createdOrExistingCustomer) => {
        returnObject.customerData = createdOrExistingCustomer.dataValues;
        return global.databaseConnection.models.contact.findOrCreate({
          where: { customerId: returnObject.customerData.id },
          defaults: {
            email,
            phoneNumber,
            createdDateTimeUtc: new Date(),
            lastUpdatedDateTimeUtc: new Date(),
          },
          transaction,
        });
      })
      .then(([createdOrExistingContact]) => {
        returnObject.contactDetails = createdOrExistingContact.dataValues;
        return global.databaseConnection.models.address.findOrCreate({
          where: { customerId: returnObject.customerData.id },
          defaults: {
            address,
            createdDateTimeUtc: new Date(),
            lastUpdatedDateTimeUtc: new Date(),
          },
          transaction,
        });
      })
      .then(async ([createdOrExistingAddress]) => {
        returnObject.addressDetails = createdOrExistingAddress.dataValues;
        await transaction.commit();
        resolve(returnObject);
      })
      .catch(async (ex) => {
        if (transaction) {
          await transaction.rollback();
        }
        reject(ex);
      });
  });
}

function loginCustomer({ username, password }) {
  return new Promise((resolve, reject) => {
    let customerId;
    global.databaseConnection.models.customer.findOne({ where: { username } })
      .then((foundCustomer) => {
        if (!foundCustomer) {
          reject({ error: 'User Not Found' });
        }
        customerId = foundCustomer.id;
        return bcrypt.compare(password, foundCustomer.password);
      })
      .then((passwordMatch) => {
        if (!passwordMatch) {
          reject({ error: 'Invalid Credentials' });
        }
        return jwt.sign({ customerId: customerId }, secretKey, { expiresIn: '1h' });
      })
      .then((token) => {
        resolve(token);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function updateProfile({ email, phoneNumber, address }, customerId) {
  return new Promise((resolve, reject) => {
    global.databaseConnection.models.customer.findOne({ where: { id: customerId } })
      .then((foundCustomer) => {
        if (!foundCustomer) {
          reject({ error: 'Customer not found' });
        }
        return global.databaseConnection.models.contact.update(
          {
            email,
            phoneNumber,
            lastUpdatedDateTimeUtc: new Date(),
          },
          { where: { customerId } }
        );
      })
      .then(() => {
        return global.databaseConnection.models.address.update(
          {
            address,
            lastUpdatedDateTimeUtc: new Date(),
          },
          { where: { customerId } }
        );
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getProfile(customerId) {
  return new Promise(async (resolve, reject) => {
    try {
      let customer = await global.databaseConnection.models.customer.findOne({
        where: { id: customerId },
        include: [
          {
            model: global.databaseConnection.models.contact,
            as: 'customerContact',
          },
          {
            model: global.databaseConnection.models.address,
            as: 'customerAddress',
          },
        ],
      });
      resolve(customer);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = app;