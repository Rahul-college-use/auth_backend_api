import app from './src/app.js'
import connectDB from './src/config/database.js';

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✓ Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();