const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage paths
const imagePath = path.join(__dirname, '../uploads/images');
const cvPath = path.join(__dirname, '../uploads/cvs');
const blogImagePath = path.join(__dirname, '../uploads/blogs/images');
const blogCoverPath = path.join(__dirname, '../uploads/blogs/covers');

// Ensure directories exist
if (!fs.existsSync(imagePath)) fs.mkdirSync(imagePath, { recursive: true });
if (!fs.existsSync(cvPath)) fs.mkdirSync(cvPath, { recursive: true });
if (!fs.existsSync(blogImagePath)) fs.mkdirSync(blogImagePath, { recursive: true });
if (!fs.existsSync(blogCoverPath)) fs.mkdirSync(blogCoverPath, { recursive: true });


// Define storage logic
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'photo') {
            callback(null, imagePath);
        } else if (file.fieldname === 'cv') {
            callback(null, cvPath);
        } else if (file.fieldname === 'blog') {
            callback(null, blogImagePath);
        } else if (file.fieldname === 'blogCover') {
            callback(null, blogCoverPath);
        } else {
            callback(new Error('Invalid file field'), false);
        }
    },
    filename: (req, file, callback) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        callback(null, uniqueName);
    }
});

// Define file filter logic
const fileFilter = (req, file, callback) => {
    const imageTypes = /jpeg|jpg|png|gif|JPG|PNG|JPEG|GIF/;
    const cvTypes = /pdf|docx|PDF|DOCX|ppt|PPT|pptx|PPTX/;
    const blogTypes = /jpeg|jpg|png|gif|JPG|PNG|JPEG|GIF/;
    const blogCoverTypes = /jpeg|jpg|png|gif|JPG|PNG|JPEG|GIF/;

    const extName = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    if (file.fieldname === 'photo' && imageTypes.test(extName) && imageTypes.test(mimeType)) {
        callback(null, true);
    } else if (file.fieldname === 'cv' && cvTypes.test(extName) && cvTypes.test(mimeType)) {
        callback(null, true);
    } else if (file.fieldname === 'blog' && blogTypes.test(extName) && blogTypes.test(mimeType)) {
        callback(null, true);
    } else if (file.fieldname === 'blogCover' && blogCoverTypes.test(extName) && blogCoverTypes.test(mimeType)) {
        callback(null, true);
    } else {
        callback(new Error(`Invalid file type for ${file.fieldname}`), false);
    }
};

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'blog', maxCount: 1 },
    { name: 'blogCover', maxCount: 1 },
]);

module.exports = upload;
