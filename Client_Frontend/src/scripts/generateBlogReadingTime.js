const generateBlogReadingTime = (blog) => {
    // Split the blog content into words
    const words = blog.split(/\s+/).filter(word => word.length > 0);
    
    // Calculate the reading time in minutes (assuming an average reading speed of 200 words per minute)
    const readingTime = Math.ceil(words.length / 200);
    
    // Return the reading time in a human-readable format
    return `${readingTime} min read`;
}

export default generateBlogReadingTime;