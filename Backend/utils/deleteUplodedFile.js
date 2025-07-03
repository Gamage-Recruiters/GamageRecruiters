const path = require('path');
const fs = require('fs');

// Define storage paths (same as upload middleware)
const paths = {
    photo: path.join(__dirname, '../uploads/users/images'),
    adminPhoto: path.join(__dirname, '../uploads/admin/images'),
    cv: path.join(__dirname, '../uploads/cvs'),
    blog: path.join(__dirname, '../uploads/blogs/images'),
    blogCover: path.join(__dirname, '../uploads/blogs/covers'),
    authorImage: path.join(__dirname, '../uploads/blogs/authors'), 
    resume: path.join(__dirname, '../uploads/appliedJobs/resumes'),
    workshopImage: path.join(__dirname, '../uploads/workshops/images'),
};


const deleteUploadedFile = async (fieldname, filename) => {
    return new Promise((resolve, reject) => {
        const dir = paths[fieldname];

        if (!dir) {
            return reject(new Error(`Invalid fieldname: ${fieldname}`));
        }

        const filePath = path.join(dir, filename);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // File does not exist
                return resolve(false);
            }

            fs.unlink(filePath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    });
};

module.exports = deleteUploadedFile;
