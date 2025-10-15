const app = require('./app');
const { PORT, NODE_ENV } = require('./config/env');


function startServer () {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT} in ${NODE_ENV} mode`);
});
}

startServer();