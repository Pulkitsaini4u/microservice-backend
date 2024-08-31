const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const {
    createChannel
} = require('./orderUtil');
var channel;
(async function () {
    let value = await createChannel();
    channel = value.channel;
})();
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
let authenticate = async (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized - Token not provided'
        });
    }
    try {
        let decoded = jwt.verify(token, secretKey);
        req.customerId = decoded.customerId;
        next();
    } catch (error) {
        res.status(401).json({
            error: 'Unauthorized - Invalid token'
        });
    }
};

app.post('/createOrders', async (req, res) => {
    try {
        const order = await createOrder(req.body);
        res.json(order.id);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/orders/:id', authenticate, async (req, res) => {
    try {
        let order = await getOrderById(req.params.id)
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/getAllOrders', authenticate, async (req, res) => {
    try {
        let order = await getAllOrders(req.customerId)
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

function createOrder({
    productId,
    customerId
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let createdOrder = await global.databaseConnection.models.order.create({
                productId,
                customerId,
                status: 'confirmed'
            });
            resolve(createdOrder);
        } catch (ex) {
            reject(ex);
        }
    });
}

function getOrderById(orderId) {
    return new Promise(async (resolve, reject) => {
        try {
            let order = await global.databaseConnection.models.order.findOne({
                where: {
                    id: orderId
                }
            });
            if (order) {
                resolve(order);
            } else {
                reject({
                    message: "order not found"
                });
            }
        } catch (ex) {
            reject(ex);
        }
    });
}

function getAllOrders(customerId) {
    return new Promise(async (resolve, reject) => {
        try {
            let orders = await global.databaseConnection.models.order.findAll({
                where: {
                    customerId: customerId
                }
            });
            if (orders) {
                resolve(orders);
            } else {
                reject({
                    message: "order not found"
                });
            }
        } catch (ex) {
            reject(ex);
        }
    });
}

module.exports = app;