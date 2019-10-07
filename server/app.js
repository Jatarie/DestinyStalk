"use strict";
const express = require('express')
const app = express();


var stalkRouter = require('./routes/stalk/stalk');
var craftingRouter = require('./routes/crafting/crafting');
var graphRouter = require('./routes/graph/graph');


app.use("/api", stalkRouter)
app.use("/crafting", craftingRouter)
app.use("/graphapi", graphRouter)
app.listen(8000, () => { });