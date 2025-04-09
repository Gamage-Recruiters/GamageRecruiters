const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const { dbconnect } = require('./config/dbConnection');
const { pool } = require("./config/dbConnection");
const userRouter = require('./Routers/userRouter');
const authRouter = require('./Routers/authRouter');
const adminRouter = require('./Routers/adminRouter');
const sessionRouter = require('./Routers/sessionRouter');
const googleAuthRouter = require('./Routers/googleAuthRouter');
const facebookAuthRouter = require('./Routers/facebookAuthRouter');
const linkedInAuthRouter = require('./Routers/linkedInAuthRouter');
const jobapplicationRouter = require('./Routers/jobApplicationRouter'); 
const JobsManagementRouter = require('./Routers/JobsManagementRouter')
const blogRoutes = require('./Routers/blogRouter');
const testimonialsRouter = require('./Routers/testimonialsRouter');
const workshopRoutes = require('./Routers/workshopsRoutes');

require('dotenv').config();
require('./auth/passportAuthGoogle');
require('./auth/passportAuthFacebook');
require('./auth/passportAuthLinkedIn');

const app = express();

const PORT = process.env.PORT || 8000;

dbconnect();  ///database Connecting 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, '/uploads/images')));
app.use('/uploads/cv', express.static(path.join(__dirname, '/uploads/cvs')));
app.use('/uploads/appliedJobs/resumes', express.static(path.join(__dirname, '/uploads/appliedJonobs/resumes')));
app.use('/uploads/blogs/images', express.static(path.join(__dirname, '/uploads/blogs/images')));
app.use('/uploads/blogs/covers', express.static(path.join(__dirname, '/uploads/blogs/covers')));
app.use('/uploads/appliedJobs/resumes', express.static(path.join(__dirname, '/uploads/appliedJobs/resumes')));

app.use(session({ 
    key: "GamageRecruiters",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day ...
    }
}));


// Add this near your other routes in server.js
app.get("/api/check-db", async (req, res) => {
  try {
    // Simple test query to check connection
    const [result] = await pool.promise().query("SELECT 1 + 1 AS test_result");
    res.json({
      success: true,
      database: "Connected and working",
      result: result[0].test_result, // Should return 2
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    res.status(500).json({
      success: false,
      error: "Database connection failed",
      details: error.message,
    });
  }
});

app.use(passport.initialize());
app.use(passport.session());

const contactRouter = require('./Routers/contactRouter');
app.use("/api/contact",contactRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);




app.use('/session', sessionRouter);

app.use('/', googleAuthRouter);
app.use('/', facebookAuthRouter);
app.use('/', linkedInAuthRouter);

app.use('/api/jobapplications', jobapplicationRouter);
app.use('/api/jobs', JobsManagementRouter);

app.use('/api/workshops', workshopRoutes);


app.use("/api/testimonials",testimonialsRouter);


app.use('/api/blogs', blogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
