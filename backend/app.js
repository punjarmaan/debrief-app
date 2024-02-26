const express = require('express');

const app = express()

const PORT = 8080;

app.get('/', (request, response) => {

});

app.listen(PORT, () => {
    console.log(PORT + ' is listening')
})