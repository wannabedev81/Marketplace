const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const itemListRoutes = require('./routes/itemListRoutes');
const path = require('path');

//     const errorHandler = require('./middleware/error');


const app = express();

//connect db
db.init();

//middle services
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



//API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemListRoutes);


// Last Item!! only as last item - - errorhandling
//app.use('/api/middleware/', errorHandler);

module.exports = app;


