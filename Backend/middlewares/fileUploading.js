const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage paths
const imagePath = path.join(__dirname, '../uploads/users/images');
const adminImagePath = path.join(__dirname, '../uploads/admin/images');
const cvPath = path.join(__dirname, '../uploads/cvs');
const blogImagePath = path.join(__dirname, '../uploads/blogs/images');
const blogCoverPath = path.join(__dirname, '../uploads/blogs/covers');



const authorImagePath = path.join(__dirname, '../uploads/blogs/authors');
const jobApplicationPath = path.join(__dirname, '../uploads/appliedJobs/resumes');
const workShopImagePath = path.join(__dirname, '../uploads/workshops/images');

// Ensure directories exist
if (!fs.existsSync(imagePath)) fs.mkdirSync(imagePath, { recursive: true });
if (!fs.existsSync(adminImagePath)) fs.mkdirSync(adminImagePath, { recursive: true });
if (!fs.existsSync(cvPath)) fs.mkdirSync(cvPath, { recursive: true });
if (!fs.existsSync(blogImagePath)) fs.mkdirSync(blogImagePath, { recursive: true });
if (!fs.existsSync(blogCoverPath)) fs.mkdirSync(blogCoverPath, { recursive: true });
if (!fs.existsSync(authorImagePath)) fs.mkdirSync(authorImagePath, { recursive: true });
if (!fs.existsSync(workShopImagePath)) fs.mkdirSync(workShopImagePath, { recursive: true });

// Define storage logic
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'photo') {
            callback(null, imagePath);
        } else if (file.fieldname === 'adminPhoto') {
            callback(null, adminImagePath);
        }
        else if (file.fieldname === 'cv') {
            callback(null, cvPath);
        }
        else if (file.fieldname === 'blog') {
            callback(null, blogImagePath);
        } else if (file.fieldname === 'blogCover') {
            callback(null, blogCoverPath);
        }else if (file.fieldname === 'authorImage') {
            callback(null, authorImagePath);
        } else if (file.fieldname === 'resume') {
            callback(null, jobApplicationPath);
        } else if (file.fieldname === 'workshopImage') {
            callback(null, workShopImagePath);
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
    const adminImageTypes = /jpeg|jpg|png|gif|JPG|PNG|JPEG|GIF/;
    const cvTypes = /pdf|docx|PDF|DOCX|ppt|PPT|pptx|PPTX/;
    const blogTypes = /jpeg|jpg|png|gif|JPG|PNG|JPEG|GIF/;
    const blogCoverTypes = /jpeg|jpg|png|gif|JPG|PNG|JPEG|GIF/;
    const jobApplicationTypes = /pdf|doc|docx|txt/;
    const workShopImageTypes = /jpeg|jpg|png|gif|JPG|PNG|JPEG|GIF/;

    const extName = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    if (file.fieldname === 'photo' && imageTypes.test(extName) && imageTypes.test(mimeType)) {
        callback(null, true);
    } else if (file.fieldname === 'adminPhoto' && imageTypes.test(extName) && imageTypes.test(mimeType)) {
        callback(null, true);
    }
    else if (file.fieldname === 'cv' && cvTypes.test(extName) && cvTypes.test(mimeType)) {
        callback(null, true);
    }
    else if (file.fieldname === 'blog' && blogTypes.test(extName) && blogTypes.test(mimeType)) {
        callback(null, true);
    } else if (file.fieldname === 'blogCover' && blogCoverTypes.test(extName) && blogCoverTypes.test(mimeType)) {
        callback(null, true);
    }else if (file.fieldname === 'authorImage' && imageTypes.test(extName) && imageTypes.test(mimeType)) {
        callback(null, true);
    } else if (file.fieldname === 'resume' && jobApplicationTypes.test(extName) && jobApplicationTypes.test(mimeType)) {
        callback(null, true);
    } else if (file.fieldname === 'workshopImage' && workShopImageTypes.test(extName) && workShopImageTypes.test(mimeType)) {
        callback(null, true);
    } else {
        callback(new Error(`Invalid file type for ${file.fieldname}`), false);
    }
};

// Configure multer
const rawUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'adminPhoto', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'blog', maxCount: 1 },
    { name: 'blogCover', maxCount: 1 },
    { name: 'authorImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'workshopImage', maxCount: 1 }
]);

const upload = (req, res, next) => {
    rawUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // multer errors
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ message: `Too many files for field: ${err.field}` });
            } else if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: `File too large. Max size is 5MB.` });
            } else {
                return res.status(400).json({ message: `Upload error: ${err.message}` });
            }
        } else if (err) {
            return res.status(400).json({ message: `Upload failed: ${err.message}` });
        }

        next();
    });
};

module.exports = upload;
