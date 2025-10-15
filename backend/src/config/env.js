const path = require('path');
require('dotenv').config({ 
    path: path.resolve(__dirname, '../.env') 
});


module.exports = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.DB_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || 'changeme',
    NODE_ENV: process.env.NODE_ENV || 'development'
};