const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUploading');
const blogRouter = require('../Controllers/blogController');

// Route to get all the blogs ...
router.get('/', blogRouter.getAllBlogs);

// Route to get a specific blog ...
router.get('/:blogId', blogRouter.getSpecificBlogPost);

// Route to add a blog ...
router.post('/add', upload, blogRouter.createNewBlog);

// Route to update a blog ...
router.put('/update/:blogId', upload, blogRouter.updateBlog);

// Route to delete a blog ...
router.delete('/delete/:blogId', blogRouter.deleteBlog);

// Route to fetch blog like count ...
router.get('/like-count/:blogId', blogRouter.fetchBlogLikeCount);

// Route to fetch blog comments ...
router.get('/comments/:blogId', blogRouter.fetchBlogComments);

// Route to add a comment to a blog post ...
router.post('/comments/add', blogRouter.addCommentToBlog)

// // POST - Create a Blog
// router.post('/', upload.single('image'), createBlog);

// // View Blogs (with pagination)
// router.get('/', getBlogs);

// // Update Blog with optional image upload
// router.put('/:id', upload.single('image'), updateBlog);

// // Delete Blog
// router.delete('/:id', deleteBlog);

module.exports = router;