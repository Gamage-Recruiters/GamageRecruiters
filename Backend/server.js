const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const {dbconnect} = require('./config/dbConnection');

app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT || 5000;

dbconnect();  ///database Connecting
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

const contactRouter = require('./Routers/contactRouter');
app.use("/api/contact",contactRouter);

const testimonialsRouter = require('./Routers/testimonialsRouter');
app.use("/api/testimonials",testimonialsRouter);
