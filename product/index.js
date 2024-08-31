
const express = require('express');
const database = require('./databaseConnection/initializeDatabase');
const bodyParser = require('body-parser');
const routes = require('./productRoutes');

const StartServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use('/api', routes);
    app.listen(1002, () => {
        console.log(`listening to port 1002`);
    })
}
StartServer();