const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUploading');
const adminAuth = require('../middlewares/adminAuth');
const blogRouter = require('../Controllers/blogController');

// Route to get all the blogs ...
router.get('/', blogRouter.getAllBlogs);

// Route to get a specific blog ...
router.get('/:blogId', blogRouter.getSpecificBlogPost);

// Route to add a blog ...
router.post('/add', adminAuth, upload, blogRouter.createNewBlog);

// Route to update a blog ...
router.put('/update/:blogId', adminAuth, upload, blogRouter.updateBlog);

// Route to delete a blog ...
router.delete('/delete/:blogId', adminAuth, blogRouter.deleteBlog);

// Route to fetch blog like count ...
router.get('/like-count/:blogId', blogRouter.fetchBlogLikeCount);

// Route to fetch blog comments ...
router.get('/comments/:blogId', blogRouter.fetchBlogComments);

// Route to add a comment to a blog post ...
router.post('/comments/add', blogRouter.addCommentToBlog);

// Route to add a like to a blog post ...
router.post('/likes/add', blogRouter.LikeToBlog);

// Route to remove a like related to a post ...
router.post('/likes/remove', blogRouter.DislikeToBlog);

// Route to get the like state related to a user for a specific post ...
router.get('/state/:blogId/:userId', blogRouter.fetchUserLikeStateForBlog);

// // POST - Create a Blog
// router.post('/', upload.single('image'), createBlog);

// // View Blogs (with pagination)
// router.get('/', getBlogs);

// // Update Blog with optional image upload
// router.put('/:id', upload.single('image'), updateBlog);

// // Delete Blog
// router.delete('/:id', deleteBlog);

// Add this route in your backend router
router.get('/:blogId', async (req, res) => {
    try {
      const { blogId } = req.params;
      const query = `
        SELECT *, 
          CONCAT('/uploads/blog_images/', blogImage) as blogImageUrl,
          CONCAT('/uploads/cover_images/', coverImage) as blogCoverUrl
        FROM blogs WHERE blogId = ?`;
      
      pool.query(query, [blogId], (error, results) => {
        if (error) return res.status(500).send(error);
        if (results.length === 0) return res.status(404).send('Blog not found');
        res.json(results[0]);
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

module.exports = router;