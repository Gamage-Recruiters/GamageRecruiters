const {pool} = require('../config/dbConnection');

// create blog
exports.createBlog = async (req, res) => {
  const { title, content, category, author } = req.body;
  const imagePath = req.file ? `/uploads/blogs/${req.file.filename}` : null;

  if (!title || !content || !category || !author) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const sql = 'INSERT INTO blogs (title, content, category, author, image, published_at) VALUES (?, ?, ?, ?, ?, NOW())';
    const values = [title, content, category, author, imagePath];

    const promisePool = pool.promise();
    const [result] = await promisePool.execute(sql, values);

    res.status(201).json({ message: 'Blog created successfully', blogId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// view blogs (with optional pagination)
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const promisePool = pool.promise();

    const [blogs] = await promisePool.query('SELECT * FROM blogs LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)]);
    const [[{ total }]] = await promisePool.query('SELECT COUNT(*) AS total FROM blogs');

    res.json({ blogs, total });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// update blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, author } = req.body;
    const newImage = req.file ? `/uploads/blogs/${req.file.filename}` : null;

    const promisePool = pool.promise();

    const [rows] = await promisePool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const currentBlog = rows[0];
    const updatedTitle = title || currentBlog.title;
    const updatedContent = content || currentBlog.content;
    const updatedCategory = category || currentBlog.category;
    const updatedAuthor = author || currentBlog.author;
    const updatedImage = newImage || currentBlog.image;

    const query = `
      UPDATE blogs 
      SET title = ?, content = ?, category = ?, author = ?, image = ? 
      WHERE id = ?`;

    await promisePool.execute(query, [updatedTitle, updatedContent, updatedCategory, updatedAuthor, updatedImage, id]);

    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const promisePool = pool.promise();

    const [rows] = await promisePool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await promisePool.execute('DELETE FROM blogs WHERE id = ?', [id]);

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};