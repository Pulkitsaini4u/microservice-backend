const express = require('express');
const proxy = require('express-http-proxy');
const app= express();
app.use(express.json());

app.use('/customer', proxy('http://localhost:1001'));
app.use('/order', proxy('http://localhost:1003'));
app.use('/', proxy('http://localhost:1002'));


app.listen(1000,()=>{
    console.log('gateway is listening to prot 1000');
})

