const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUploading');
const blogRouter = require('../Controllers/blogController');

// Route to get all the blogs ...
router.get('/blogs', blogRouter.getAllBlogs);

// Route to get a specific blog ...
router.get('/blogs/:blogId', blogRouter.getSpecificBlogPost);

// Route to add a blog ...
router.get('/blogs/add', upload, blogRouter.createNewBlog);

// Route to update a blog ...
router.put('/blogs/update/:blogId', blogRouter.updateBlog);

// Route to delete a blog ...
router.delete('/blogs/delete/:blogId', blogRouter.deleteBlog);

// // POST - Create a Blog
// router.post('/', upload.single('image'), createBlog);

// // View Blogs (with pagination)
// router.get('/', getBlogs);

// // Update Blog with optional image upload
// router.put('/:id', upload.single('image'), updateBlog);

// // Delete Blog
// router.delete('/:id', deleteBlog);

module.exports = router;