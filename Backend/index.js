import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import fileUpload from 'express-fileupload';

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
    })
);

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

// Database Connection
(async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
})();

// Routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

// Start Server
try {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} catch (error) {
    console.log("Error starting server:", error);
}
