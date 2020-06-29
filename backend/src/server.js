const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/image',express.static(path.join(__dirname,'uploads/images'))); 
app.use(routes);

app.listen(3333);