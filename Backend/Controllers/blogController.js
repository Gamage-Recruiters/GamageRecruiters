const {pool} = require('../config/dbConnection');

// Get all Bolg Posts ...
async function getAllBlogs(req, res) {
  try {
    const blogsQuery = 'SELECT * FROM blogs';
    pool.query(blogsQuery, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      }

      if(result.length == 0) {
        return res.status(404).send('No Blogs Found');
      }

      return res.status(200).json({ message: 'Blogs Found', data: result });
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
} 

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

      if(result.length == 0) {
        return res.status(404).send('Blog not found');
      }

      return res.status(200).json({ message: 'Blog Found', data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

async function createNewBlog (req, res) {
  const { title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Qoute1, Qoute2, Qoute3 } = req.body;

  if(!title || !introduction || !author || !authorPosition || !authorCompany) {
    return res.status(400).send('Some fields are required. Fill Those');
  }

  try {
    // If existing, access the file names of the cv and image ...
    const blogImageName = req.files?.blog?.[0]?.filename || null;
    console.log(blogImageName);

    const addBlogQuery = 'INSERT INTO blogs (title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Qoute1, Qoute2, Qoute3, blogImage, addedAt) VALUES (?, ?, ?, ? , ?, ?, ?, ?, ? , ?, ?, ?, ?, ? , ?, ?, ?, ?, ? , ?, ?, ?, ?, ? , ?, ?, ?, ?, ? , ?)';
    const values = [title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Qoute1, Qoute2, Qoute3, blogImageName, new Date()];
    pool.query(addBlogQuery, values, (error, result) => {
      if(error) {
        console.error(error);
        return res.status(400).send(error);
      }

      if(result.affectedRows == 0) {
        return res.status(400).send('Failed to add Blog');
      }

      return res.status(200).json({ message: 'Blog Added Successfully', data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

async function updateBlog (req, res) {
  const { blogId } = req.params;
  const { title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Qoute1, Qoute2, Qoute3 } = req.body;

  if(!title || !introduction || !author || !authorPosition || !authorCompany || !blogId) {
    return res.status(400).send('Some fields are required. Fill Those');
  }

  try {
    // If existing, access the file names of the cv and image ...
    const blogImageName = req.files?.blog?.[0]?.filename || null;
    console.log(blogImageName); 

    let updateBlogQuery;
    let values

    if(blogImageName) {
      updateBlogQuery = 'UPDATE blogs SET title = ?, introduction = ?, subTitle1 = ?, subContent1 = ?, subTitle2 = ?, subContent2 = ?, subTitle3 = ?, subContent3 = ?, subTitle4 = ?, subContent4 = ?, subTitle5 = ?, subContent5 = ?, subTitle6 = ?, subContent6 = ?, subTitle7 = ?, subContent7 = ?, subTitle8 = ?, subContent8 = ?, subTitle9 = ?, subContent9 = ?, subTitle10 = ?, subContent10 = ?, tags = ?, author = ?, authorPosition = ?, authorCompany = ?, Qoute1 = ?, Qoute2 = ?, Qoute3 = ?, blogImage = ?, addedAt = ? WHERE blogId = ?';
      values = [title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Qoute1, Qoute2, Qoute3, blogImageName, new Date(), blogId];
    } else {
      updateBlogQuery = 'UPDATE blogs SET title = ?, introduction = ?, subTitle1 = ?, subContent1 = ?, subTitle2 = ?, subContent2 = ?, subTitle3 = ?, subContent3 = ?, subTitle4 = ?, subContent4 = ?, subTitle5 = ?, subContent5 = ?, subTitle6 = ?, subContent6 = ?, subTitle7 = ?, subContent7 = ?, subTitle8 = ?, subContent8 = ?, subTitle9 = ?, subContent9 = ?, subTitle10 = ?, subContent10 = ?, tags = ?, author = ?, authorPosition = ?, authorCompany = ?, Qoute1 = ?, Qoute2 = ?, Qoute3 = ?, addedAt = ? WHERE blogId = ?';
      values = [title, introduction, subTitle1, subContent1, subTitle2, subContent2, subTitle3, subContent3, subTitle4, subContent4, subTitle5, subContent5, subTitle6, subContent6, subTitle7, subContent7, subTitle8, subContent8, subTitle9, subContent9, subTitle10, subContent10, tags, author, authorPosition, authorCompany, Qoute1, Qoute2, Qoute3, new Date(), blogId];
    }
    
    pool.query(updateBlogQuery, values, (error, result) => {
      if(error) {
        console.error(error);
        return res.status(400).send(error);
      }

      if(result.affectedRows == 0) {
        return res.status(400).send('Failed to update Blog');
      }

      return res.status(200).send('Blog updated Successfully');
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

async function deleteBlog (req, res) {
  const { blogId } = req.params;

  if(!blogId) {
    return res.status(400).send('Blog ID is required');
  }

  try {
    const deleteBlogQuery = 'DELETE FROM blogs WHERE blogId = ?';
    pool.query(deleteBlogQuery, blogId, (error, result) => {
      if(error) {
        console.error(error);
        return res.status(400).send(error);
      }

      if(result.affectedRows == 0) {
        return res.status(400).send('Failed to update Blog');
      }

      return res.status(200).send('Blog Deleted Successfully');
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

module.exports = { getAllBlogs, getSpecificBlogPost, createNewBlog, updateBlog, deleteBlog };

// // create blog
// exports.createBlog = async (req, res) => {
//   const { title, content, category, author } = req.body;
//   const imagePath = req.file ? `/uploads/blogs/${req.file.filename}` : null;

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
//     const newImage = req.file ? `/uploads/blogs/${req.file.filename}` : null;

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