require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Mount routes
app.use('/api', require('./routes'));

// Catch-all route to serve SPA
app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
