const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadBlogImage');
const { getBlogs, updateBlog, deleteBlog, createBlog } = require('../Controllers/blogController');

// POST - Create a Blog
router.post('/', upload.single('image'), createBlog);

// View Blogs (with pagination)
router.get('/', getBlogs);

// Update Blog with optional image upload
router.put('/:id', upload.single('image'), updateBlog);

// Delete Blog
router.delete('/:id', deleteBlog);

module.exports = router;