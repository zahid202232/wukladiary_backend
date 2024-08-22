require('dotenv').config();
const mongoose = require('mongoose');
const cors = require("cors")
const express = require('express');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');
const commonRoute = require('./routes/commonRoute');
const userRoute = require("./routes/userRoute")
const firmRoute = require("./routes/firmRoute")
const superAdminRoute = require("./routes/superAdminRoute")
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.SERVER_PORT || 3005;
require('events').EventEmitter.defaultMaxListeners = 20;

// connecting mongo DB
const connection = mongoose.connection
mongoose.connect("mongodb://127.0.0.1:27017/EinnoventionProject");
connection.on("connected", () => {
    console.log("Connected to Database.");
})
connection.once("error", (err) => {
    console.log("Error while connecting mongo db:", err);
})
//middlewares
app.use(express.json());
//app.use(express.static('public'));
app.use(cookieParser());
// app.use(cors());
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both origins
    credentials: true, // Allow cookies to be sent with requests
};

// Use CORS middleware with options
app.use(cors(corsOptions));






// //Firm Routes
app.use('/api', firmRoute);


//Admin Routes
app.use('/api', superAdminRoute);

// Auth Routes
app.use('/api', authRoute);
// admin routes
app.use('/api/admin', adminRoute);
// common routes
app.use('/api', commonRoute);
//for Simple Email Storage
app.use("/emailStorage", userRoute)
app.listen(PORT, () => {
    console.log(`🛺 Server is Running at the PORT ${PORT}`)
})