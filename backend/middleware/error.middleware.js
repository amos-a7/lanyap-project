const notFound = (req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = { notFound, errorHandler };
