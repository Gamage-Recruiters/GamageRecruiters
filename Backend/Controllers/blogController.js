const {pool} = require('../config/dbConnection');
const deleteUploadedFile = require('../utils/deleteUplodedFile');

// Get all Blog Posts ...
async function getAllBlogs(req, res) {
  try {
    const blogsQuery = 'SELECT * FROM blogs';
    pool.query(blogsQuery, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      }

      if(result.length === 0) {
        return res.status(404).send('No Blogs Found');
      }

      return res.status(200).json({ message: 'Blogs Found', data: result });
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
} 

// Get a specific blog ...
async function getSpecificBlogPost (req, res) {
  const { blogId } = req.params;

  if(!blogId) {
    return res.status(400).send('Blog ID is required');
  }

  try {
    const blogQuery = 'SELECT * FROM blogs WHERE blogId = ?';
    pool.query(blogQuery, blogId, (error, result) => {
      if(error) {
        console.error(error);
        return res.status(500).send(error);
      }

      if(result.length === 0) {
        return res.status(404).send('Blog not found');
      }

      return res.status(200).json({ message: 'Blog Found', data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// Create a New Blog Post ...
async function createNewBlog (req, res) {
  const { title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Quote1, Quote2, Quote3, category } = req.body;

  if(!title || !introduction || !author || !authorPosition || !authorCompany) {
    return res.status(400).json({ error: 'Some fields are required. Please fill those.' });
  }

  try {
    // If existing, access the file names of the cv and image ...
    const blogImageName = req.files?.blog?.[0]?.filename || null;
    const blogCoverName = req.files?.blogCover?.[0]?.filename || null;
    const authorImageName = req.files?.authorImage?.[0]?.filename || null;
    console.log({ blogImageName, blogCoverName, authorImageName });

    const addBlogQuery = 'INSERT INTO blogs (title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Quote1, Quote2, Quote3, blogImage, addedAt, category, coverImage, authorImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Quote1, Quote2, Quote3, blogImageName, new Date(), category, blogCoverName, authorImageName];
    pool.query(addBlogQuery, values, (error, result) => {
      if(error) {
        console.error(error);
        return res.status(400).json({ error: error.message || error });
      }

      if(result.affectedRows === 0) {
        return res.status(400).json({ error: 'Failed to update Blog' });
      }

      return res.status(200).json({ message: 'Blog Added Successfully', data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || error });
  }
}

// Update a specific blog post ...
async function updateBlog(req, res) {
  const { blogId } = req.params;
  const {
    title, introduction,
    subTitle1, subContent1,
    subTitle2, subContent2,
    subTitle3, subContent3,
    subTitle4, subContent4,
    subTitle5, subContent5,
    subTitle6, subContent6,
    subTitle7, subContent7,
    subTitle8, subContent8,
    subTitle9, subContent9,
    subTitle10, subContent10,
    tags, author, authorPosition, authorCompany,
    Quote1, Quote2, Quote3,
    category
  } = req.body;

  // Helper to ensure value is a string, not an array
  function normalizeInput(field) {
    if (Array.isArray(field)) return field[0] || '';
    return field || '';
  }

  // Normalize all inputs
  const normalized = {
    title: normalizeInput(title),
    introduction: normalizeInput(introduction),
    subTitle1: normalizeInput(subTitle1),
    subContent1: normalizeInput(subContent1),
    subTitle2: normalizeInput(subTitle2),
    subContent2: normalizeInput(subContent2),
    subTitle3: normalizeInput(subTitle3),
    subContent3: normalizeInput(subContent3),
    subTitle4: normalizeInput(subTitle4),
    subContent4: normalizeInput(subContent4),
    subTitle5: normalizeInput(subTitle5),
    subContent5: normalizeInput(subContent5),
    subTitle6: normalizeInput(subTitle6),
    subContent6: normalizeInput(subContent6),
    subTitle7: normalizeInput(subTitle7),
    subContent7: normalizeInput(subContent7),
    subTitle8: normalizeInput(subTitle8),
    subContent8: normalizeInput(subContent8),
    subTitle9: normalizeInput(subTitle9),
    subContent9: normalizeInput(subContent9),
    subTitle10: normalizeInput(subTitle10),
    subContent10: normalizeInput(subContent10),
    tags: normalizeInput(tags),
    author: normalizeInput(author),
    authorPosition: normalizeInput(authorPosition),
    authorCompany: normalizeInput(authorCompany),
    Quote1: normalizeInput(Quote1),
    Quote2: normalizeInput(Quote2),
    Quote3: normalizeInput(Quote3),
    category: normalizeInput(category),
  };

  if (
    !normalized.title ||
    !normalized.introduction ||
    !normalized.author ||
    !normalized.authorPosition ||
    !normalized.authorCompany ||
    !blogId
  ) {
    return res.status(400).send('Some fields are required. Please fill those.');
  }

  try {
    const getBlogQuery = 'SELECT blogImage, coverImage, authorImage FROM blogs WHERE blogId = ?';

    pool.query(getBlogQuery, [blogId], async (fetchError, fetchResult) => {
      if (fetchError) {
        console.error('Error fetching existing blog:', fetchError);
        return res.status(500).send('Database error when retrieving blog');
      }

      if (fetchResult.length === 0) {
        return res.status(404).send('Blog not found');
      }

      const existingBlog = fetchResult[0];
      const oldBlogImage = existingBlog.blogImage;
      const oldCoverImage = existingBlog.coverImage;
      const oldAuthorImage = existingBlog.authorImage;

      // File names for uploaded images (if any)
      const blogImageName = req.files?.blog?.[0]?.filename || null;
      const blogCoverName = req.files?.blogCover?.[0]?.filename || null;
      const authorImageName = req.files?.authorImage?.[0]?.filename || null;
    
      // Delete old images if new ones are uploaded
      try{
        if (blogImageName && oldBlogImage && blogImageName !== oldBlogImage) {
          await deleteUploadedFile('blog', oldBlogImage);
          console.log(`Deleted old blog image: ${oldBlogImage}`);
        }

        if (blogCoverName && oldCoverImage && blogCoverName !== oldCoverImage) {
          await deleteUploadedFile('blogCover', oldCoverImage);
          console.log(`Deleted old cover image: ${oldCoverImage}`);
        }
        
        if (authorImageName && oldAuthorImage && authorImageName !== oldAuthorImage) {
          await deleteUploadedFile('authorImage', oldAuthorImage);
          console.log(`Deleted old author image: ${oldAuthorImage}`);
        }
      } catch (deleteError) {
        console.error('Error deleting old images:', deleteError);
        // Continue with update even if deletion fails
      }
      let updateBlogQuery;
      let values;

      if (blogImageName && blogCoverName) {
        updateBlogQuery = `
          UPDATE blogs SET
            title = ?, introduction = ?, 
            subTitle1 = ?, subContent1 = ?, subTitle2 = ?, subContent2 = ?,
            subTitle3 = ?, subContent3 = ?, subTitle4 = ?, subContent4 = ?,
            subTitle5 = ?, subContent5 = ?, subTitle6 = ?, subContent6 = ?,
            subTitle7 = ?, subContent7 = ?, subTitle8 = ?, subContent8 = ?,
            subTitle9 = ?, subContent9 = ?, subTitle10 = ?, subContent10 = ?,
            tags = ?, author = ?, authorPosition = ?, authorCompany = ?,
            Quote1 = ?, Quote2 = ?, Quote3 = ?,
            blogImage = ?, addedAt = ?, category = ?, coverImage = ?, authorImage = ?
          WHERE blogId = ?
        `;

        values = [
          normalized.title, normalized.introduction,
          normalized.subTitle1, normalized.subContent1,
          normalized.subTitle2, normalized.subContent2,
          normalized.subTitle3, normalized.subContent3,
          normalized.subTitle4, normalized.subContent4,
          normalized.subTitle5, normalized.subContent5,
          normalized.subTitle6, normalized.subContent6,
          normalized.subTitle7, normalized.subContent7,
          normalized.subTitle8, normalized.subContent8,
          normalized.subTitle9, normalized.subContent9,
          normalized.subTitle10, normalized.subContent10,
          normalized.tags, normalized.author, normalized.authorPosition, normalized.authorCompany,
          normalized.Quote1, normalized.Quote2, normalized.Quote3,
          blogImageName, new Date(), normalized.category, blogCoverName, authorImageName,
          blogId
        ];
      } else if (!blogImageName && blogCoverName) {
        updateBlogQuery = `
          UPDATE blogs SET
            title = ?, introduction = ?, 
            subTitle1 = ?, subContent1 = ?, subTitle2 = ?, subContent2 = ?,
            subTitle3 = ?, subContent3 = ?, subTitle4 = ?, subContent4 = ?,
            subTitle5 = ?, subContent5 = ?, subTitle6 = ?, subContent6 = ?,
            subTitle7 = ?, subContent7 = ?, subTitle8 = ?, subContent8 = ?,
            subTitle9 = ?, subContent9 = ?, subTitle10 = ?, subContent10 = ?,
            tags = ?, author = ?, authorPosition = ?, authorCompany = ?,
            Quote1 = ?, Quote2 = ?, Quote3 = ?,
            addedAt = ?, category = ?, coverImage = ?, authorImage = ?
          WHERE blogId = ?
        `;

        values = [
          normalized.title, normalized.introduction,
          normalized.subTitle1, normalized.subContent1,
          normalized.subTitle2, normalized.subContent2,
          normalized.subTitle3, normalized.subContent3,
          normalized.subTitle4, normalized.subContent4,
          normalized.subTitle5, normalized.subContent5,
          normalized.subTitle6, normalized.subContent6,
          normalized.subTitle7, normalized.subContent7,
          normalized.subTitle8, normalized.subContent8,
          normalized.subTitle9, normalized.subContent9,
          normalized.subTitle10, normalized.subContent10,
          normalized.tags, normalized.author, normalized.authorPosition, normalized.authorCompany,
          normalized.Quote1, normalized.Quote2, normalized.Quote3,
          new Date(), normalized.category, blogCoverName, authorImageName,
          blogId
        ];
      } else if (blogImageName && !blogCoverName) {
        updateBlogQuery = `
          UPDATE blogs SET
            title = ?, introduction = ?, 
            subTitle1 = ?, subContent1 = ?, subTitle2 = ?, subContent2 = ?,
            subTitle3 = ?, subContent3 = ?, subTitle4 = ?, subContent4 = ?,
            subTitle5 = ?, subContent5 = ?, subTitle6 = ?, subContent6 = ?,
            subTitle7 = ?, subContent7 = ?, subTitle8 = ?, subContent8 = ?,
            subTitle9 = ?, subContent9 = ?, subTitle10 = ?, subContent10 = ?,
            tags = ?, author = ?, authorPosition = ?, authorCompany = ?,
            Quote1 = ?, Quote2 = ?, Quote3 = ?,
            blogImage = ?, addedAt = ?, category = ?, authorImage = ?
          WHERE blogId = ?
        `;

        values = [
          normalized.title, normalized.introduction,
          normalized.subTitle1, normalized.subContent1,
          normalized.subTitle2, normalized.subContent2,
          normalized.subTitle3, normalized.subContent3,
          normalized.subTitle4, normalized.subContent4,
          normalized.subTitle5, normalized.subContent5,
          normalized.subTitle6, normalized.subContent6,
          normalized.subTitle7, normalized.subContent7,
          normalized.subTitle8, normalized.subContent8,
          normalized.subTitle9, normalized.subContent9,
          normalized.subTitle10, normalized.subContent10,
          normalized.tags, normalized.author, normalized.authorPosition, normalized.authorCompany,
          normalized.Quote1, normalized.Quote2, normalized.Quote3,
          blogImageName, new Date(), normalized.category, authorImageName,
          blogId
        ];
      } else {
        updateBlogQuery = `
          UPDATE blogs SET
            title = ?, introduction = ?, 
            subTitle1 = ?, subContent1 = ?, subTitle2 = ?, subContent2 = ?,
            subTitle3 = ?, subContent3 = ?, subTitle4 = ?, subContent4 = ?,
            subTitle5 = ?, subContent5 = ?, subTitle6 = ?, subContent6 = ?,
            subTitle7 = ?, subContent7 = ?, subTitle8 = ?, subContent8 = ?,
            subTitle9 = ?, subContent9 = ?, subTitle10 = ?, subContent10 = ?,
            tags = ?, author = ?, authorPosition = ?, authorCompany = ?,
            Quote1 = ?, Quote2 = ?, Quote3 = ?,
            addedAt = ?, category = ?, authorImage = ?
          WHERE blogId = ?
        `;

        values = [
          normalized.title, normalized.introduction,
          normalized.subTitle1, normalized.subContent1,
          normalized.subTitle2, normalized.subContent2,
          normalized.subTitle3, normalized.subContent3,
          normalized.subTitle4, normalized.subContent4,
          normalized.subTitle5, normalized.subContent5,
          normalized.subTitle6, normalized.subContent6,
          normalized.subTitle7, normalized.subContent7,
          normalized.subTitle8, normalized.subContent8,
          normalized.subTitle9, normalized.subContent9,
          normalized.subTitle10, normalized.subContent10,
          normalized.tags, normalized.author, normalized.authorPosition, normalized.authorCompany,
          normalized.Quote1, normalized.Quote2, normalized.Quote3,
          new Date(), normalized.category, authorImageName,
          blogId
        ];
      }

      console.log('Update query values:', values);

      pool.query(updateBlogQuery, values, (error, result) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(400).send(error);
        }

        if (result.affectedRows === 0) {
          return res.status(400).send('Failed to update Blog');
        }

        return res.status(200).json({ message: "Blog updated successfully!" });
      });
    })
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).send(error);
  }
}


// Delete a specific blog post ...
async function deleteBlog (req, res) {
  const { blogId } = req.params;

  if(!blogId) {
    return res.status(400).send('Blog ID is required');
  }

  try {

    const getBlogQuery = 'SELECT blogImage, coverImage, authorImage FROM blogs WHERE blogId = ?';
    
    pool.query(getBlogQuery, [blogId], async (fetchError, fetchResult) => {
      if (fetchError) {
        console.error('Error fetching blog for deletion:', fetchError);
        return res.status(500).send('Database error when retrieving blog');
      }

      if (fetchResult.length === 0) {
        return res.status(404).send('Blog not found');
      }

      const blog = fetchResult[0];

      // Delete associated images
      try {
        if (blog.blogImage) {
          await deleteUploadedFile('blog', blog.blogImage);
          console.log(`Deleted blog image: ${blog.blogImage}`);
        }
        
        if (blog.coverImage) {
          await deleteUploadedFile('blogCover', blog.coverImage);
          console.log(`Deleted cover image: ${blog.coverImage}`);
        }
        
        if (blog.authorImage) {
          await deleteUploadedFile('authorImage', blog.authorImage);
          console.log(`Deleted author image: ${blog.authorImage}`);
        }
      } catch (deleteError) {
        console.error('Error deleting blog images:', deleteError);
        // Continue with blog deletion even if image deletion fails
      }

      const deleteBlogQuery = 'DELETE FROM blogs WHERE blogId = ?';
      pool.query(deleteBlogQuery, blogId, (error, result) => {
        if(error) {
          console.error(error);
          return res.status(400).send(error);
        }

        if(result.affectedRows === 0) {
        return res.status(404).send('Blog not found');
        }

        return res.status(200).send('Blog Deleted Successfully');
      });
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
} 

// Fetch the likes related to a blog ...
async function fetchBlogLikeCount (req, res) {
  const { blogId } = req.params;

  if(!blogId) {
    return res.status(400).send('Blog ID is required');
  }

  try {
    const fetchBlogLikeCountQuery = 'SELECT COUNT(userId) AS likeCount from bloglikes WHERE blogId = ? AND liked = ?';
    pool.query(fetchBlogLikeCountQuery, [blogId, 1], (error, result) => {
      if(error) {
        console.error(error);
        return res.status(400).send(error);
      }

      if(result.length === 0) {
        return res.status(404).send('No likes found for this blog');
      }

      return res.status(200).json({ likeCount: result[0].likeCount });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// Fetch comments related to a blog post ...
async function fetchBlogComments (req, res) {
  const { blogId } = req.params;

  if(!blogId) {
    return res.status(400).send('Blog ID is required');
  }

  try {
    const fetchBlogCommentsQuery = 'SELECT b.Id, b.userId, b.comment, b.commentedDate, u.firstName, u.lastName, u.email FROM blogcomments b INNER JOIN users u ON b.userId = u.userId WHERE b.blogId = ?';
    pool.query(fetchBlogCommentsQuery, blogId, (error, result) => {
      if(error) {
        console.error(error);
        return res.status(400).send(error);
      }

      if(result.length === 0) {
        return res.status(404).send('No comments found for this blog');
      }

      return res.status(200).json({ data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// Add a comment to a blog post ...
async function addCommentToBlog (req, res) {
  const { blogId, comment, userId } = req.body;

  if(!blogId || !comment || !userId) {
    return res.status(400).send('Some data are required. Fill Those');
  }

  try {
    const addCommentQuery = 'INSERT INTO blogcomments (userId, blogId, comment, commentedDate) VALUES (?, ?, ?, ?)';
    pool.query(addCommentQuery, [userId, blogId, comment, new Date()], (error, result) => {
      if(error) {
        console.error(error);
        return res.status(400).send(error);
      }

      if(result.affectedRows === 0) {
        return res.status(400).send('Commenting failed');
      }

      return res.status(201).json({ message: 'Comment Added Successfully', data: result, Id: result.insertId });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// Like to a blog post ...
async function LikeToBlog (req, res) {
  const { blogId, userId } = req.body;

  if(!blogId || !userId) {
    return res.status(400).send('Some data are required. Fill Those');
  }

  try {
    addLikeQuery = 'INSERT INTO bloglikes (blogId, userId, liked, likedDate) VALUES (?, ?, ?, ?)';
    pool.query(addLikeQuery, [blogId, userId, 1, new Date()], (error, result) => {
      if(error) {
        console.log(error);
        return res.status(400).send(error);
      }

      if(result.affectedRows === 0) {
        return res.status(400).send('Liking failed');
      }

      return res.status(201).send('Like Added Successfully');
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
} 

// Dislike a blog post ...
async function DislikeToBlog (req, res) {
  const { blogId, userId } = req.body;

  if(!blogId || !userId) {
    return res.status(400).send('Some data are required. Fill Those');
  }

  try {
    addLikeQuery = 'DELETE FROM bloglikes WHERE blogId = ? AND userId = ? AND liked = ?';
    pool.query(addLikeQuery, [blogId, userId, 1], (error, result) => {
      if(error) {
        console.log(error);
        return res.status(400).send(error);
      }

      if(result.affectedRows === 0) {
        return res.status(400).send('Disliking failed');
      }

      return res.status(200).send('Like Removed Successfully');
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
} 

// fetch a user like state (liked or not) for a specific blog post ...
async function fetchUserLikeStateForBlog (req, res) {
  const { blogId, userId } = req.params;

  if(!blogId || !userId) {
    return res.status(400).send('Blog ID and User ID are required');
  }

  try {
    const fetchLikeStateQuery = 'SELECT liked FROM bloglikes WHERE blogId = ? AND userId = ?';
    pool.query(fetchLikeStateQuery, [blogId, userId], (error, result) => {
      if(error) {
        console.error(error);
        return res.status(400).send(error);
      }

      if(result.length === 0) {
        return res.status(404).send('No Results found');
      }

      return res.status(200).send('Result Found');
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

module.exports = { getAllBlogs, getSpecificBlogPost, createNewBlog, updateBlog, deleteBlog, fetchBlogLikeCount, fetchBlogComments, LikeToBlog, addCommentToBlog, DislikeToBlog, fetchUserLikeStateForBlog };

// // create blog
// exports.createBlog = async (req, res) => {
//   const { title, content, category, author } = req.body;
//   const imagePath = req.file ? /uploads/blogs/${req.file.filename} : null;

//   if (!title || !content || !category || !author) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const sql = 'INSERT INTO blogs (title, content, category, author, image, published_at) VALUES (?, ?, ?, ?, ?, NOW())';
//     const values = [title, content, category, author, imagePath];

//     const promisePool = pool.promise();
//     const [result] = await promisePool.execute(sql, values);

//     res.status(201).json({ message: 'Blog created successfully', blogId: result.insertId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // view blogs (with optional pagination)
// exports.getBlogs = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     const promisePool = pool.promise();

//     const [blogs] = await promisePool.query('SELECT * FROM blogs LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)]);
//     const [[{ total }]] = await promisePool.query('SELECT COUNT(*) AS total FROM blogs');

//     res.json({ blogs, total });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// // update blog
// exports.updateBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, category, author } = req.body;
//     const newImage = req.file ? /uploads/blogs/${req.file.filename} : null;

//     const promisePool = pool.promise();

//     const [rows] = await promisePool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     const currentBlog = rows[0];
//     const updatedTitle = title || currentBlog.title;
//     const updatedContent = content || currentBlog.content;
//     const updatedCategory = category || currentBlog.category;
//     const updatedAuthor = author || currentBlog.author;
//     const updatedImage = newImage || currentBlog.image;

//     const query = `
//       UPDATE blogs 
//       SET title = ?, content = ?, category = ?, author = ?, image = ? 
//       WHERE id = ?`;

//     await promisePool.execute(query, [updatedTitle, updatedContent, updatedCategory, updatedAuthor, updatedImage, id]);

//     res.json({ message: 'Blog updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// // delete blog
// exports.deleteBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const promisePool = pool.promise();

//     const [rows] = await promisePool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     await promisePool.execute('DELETE FROM blogs WHERE id = ?', [id]);

//     res.json({ message: 'Blog deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };