require('dotenv').config();
const express = require('express');
const discordRoutes = require('./routes/discord');
app.use('/api', discordRoutes);
const app = express();
app.use('/api', discordRoutes);
