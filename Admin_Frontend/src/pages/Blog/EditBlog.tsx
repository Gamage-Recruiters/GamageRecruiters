import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Image, Calendar, Clock, Tag, Save, 
  Send, X, Plus, HelpCircle, ChevronDown, Trash2
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function EditBlog() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    readTime: '',
    content: '',
    tags: [],
    status: 'draft',
    author: {
      name: '',
      title: '',
      image: ''
    },
    date: '',
    featuredImage: ''
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [originalPublishDate, setOriginalPublishDate] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [featureOnHomepage, setFeatureOnHomepage] = useState(false);
  
  const categories = [
    'Industry Trends', 'Technology', 'Tourism', 
    'Finance', 'Culture', 'Business', 'Health'
  ];

  // Fetch existing blog data
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        // Mock data for demonstration
        const mockData = {
          id: blogId,
          title: 'How AI is Transforming HR Practices in 2025',
          category: 'Technology',
          readTime: '7 min read',
          content: 'In the rapidly evolving landscape of human resources, artificial intelligence has emerged as a game-changer...\n\nOrganizations are increasingly adopting AI-powered tools to streamline recruitment processes, enhance employee experience, and make data-driven decisions. This shift is not just about automation but about reimagining the entire HR function.\n\nIn this article, we explore how AI is revolutionizing HR practices in 2025 and beyond, with real-world examples and practical insights for HR professionals.',
          tags: ['AI', 'Human Resources', 'Future of Work', 'Technology'],
          status: 'published',
          author: {
            name: 'Amara Fernando',
            title: 'Senior HR Consultant',
            image: 'https://source.unsplash.com/random/100x100?portrait'
          },
          date: 'January 15, 2025',
          featuredImage: 'https://source.unsplash.com/random/1200x600?technology',
          allowComments: true,
          featureOnHomepage: false,
          publishedDate: '2025-01-15'
        };
        
        // Set the form data from fetched data
        setFormData(mockData);
        setPreviewImage(mockData.featuredImage);
        setAllowComments(mockData.allowComments);
        setFeatureOnHomepage(mockData.featureOnHomepage);
        setOriginalPublishDate(mockData.publishedDate);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setIsLoading(false);
      }
    };
    
    fetchBlogData();
  }, [blogId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          featuredImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e, status) => {
    e.preventDefault();
    // Implement your submission logic here
    const updatedBlogData = {
      ...formData,
      status,
      allowComments,
      featureOnHomepage,
      scheduledDate: scheduleDate || null
    };
    
    console.log('Updated blog data:', updatedBlogData);
    // You would typically send this data to your backend here
    alert(`Blog post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
    navigate('/blog');
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      // Implement delete logic here
      console.log(`Deleting blog post with ID: ${blogId}`);
      alert('Blog post deleted successfully!');
      navigate('/blog');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-5xl mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/blog" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formData.status === 'published' 
                ? `Published on ${formData.date}` 
                : 'Currently saved as draft'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleDelete} 
            className="flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button 
            onClick={(e) => handleSubmit(e, 'draft')} 
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </button>
          <button 
            onClick={(e) => handleSubmit(e, 'published')} 
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <Send className="h-4 w-4 mr-2" />
            Update & Publish
          </button>
        </div>
      </div>
      
      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <form className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter a compelling title..."
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-lg transition-all"
              required
            />
          </div>
          
          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Featured Image
            </label>
            <div className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center ${previewImage ? 'pt-0' : 'py-10'}`}>
              {previewImage ? (
                <div className="relative">
                  <button 
                    onClick={() => setPreviewImage(null)} 
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-64 object-cover rounded-lg mx-auto mb-4" 
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Image className="h-12 w-12 mx-auto text-gray-400" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop an image, or 
                    <label className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1">
                      browse
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Recommended: 1200x600 pixels, PNG or JPG
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Category & Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="relative">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="category"
                  name="category"
                  placeholder="Select a category"
                  value={formData.category}
                  onChange={handleInputChange}
                  onClick={() => setShowCategoryDropdown(true)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                />
                <ChevronDown 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" 
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                />
              </div>
              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  {categories.map((category) => (
                    <div 
                      key={category} 
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setFormData({...formData, category});
                        setShowCategoryDropdown(false);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Read Time */}
            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Read Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                >
                  <option value="2 min read">2 min read</option>
                  <option value="3 min read">3 min read</option>
                  <option value="5 min read">5 min read</option>
                  <option value="7 min read">7 min read</option>
                  <option value="10 min read">10 min read</option>
                  <option value="15 min read">15 min read</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              {/* Simple toolbar */}
              <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-1">
                {[
                  { icon: 'B', title: 'Bold' },
                  { icon: 'I', title: 'Italic' },
                  { icon: 'U', title: 'Underline' },
                  { icon: 'T', title: 'Heading' },
                  { icon: '-', title: 'List' },
                  { icon: '"', title: 'Quote' },
                  { icon: '<>', title: 'Code' },
                  { icon: <HelpCircle className="h-4 w-4" />, title: 'Help' }
                ].map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    title={item.title}
                    className="p-2 mx-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 font-medium"
                  >
                    {typeof item.icon === 'string' ? item.icon : item.icon}
                  </button>
                ))}
              </div>
              
              {/* Editor */}
              <textarea
                id="content"
                name="content"
                rows="15"
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-0 border-0"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              You can use HTML tags or Markdown syntax for formatting
            </p>
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="flex items-center">
                <div className="relative flex">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    id="currentTag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag"
                    className="pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add up to 5 tags to categorize your article
            </p>
          </div>
          
          {/* Author Information Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Author Information</h3>
            <div className="flex items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-800">
                <img 
                  src={formData.author.image || "https://source.unsplash.com/random/100x100?portrait"}
                  alt="Author" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Plus className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Using your profile:
                </div>
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {formData.author.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.author.title}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Additional Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Publishing Options</h3>
        <div className="space-y-4">
          {/* Original publish date display if previously published */}
          {originalPublishDate && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Originally published on: <span className="font-medium">{formData.date}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">Schedule Publication</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Set a future date to automatically publish</div>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">Allow Comments</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Let readers engage with your content</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={allowComments}
                onChange={() => setAllowComments(!allowComments)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">Feature on Homepage</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Highlight this post on the main page</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={featureOnHomepage}
                onChange={() => setFeatureOnHomepage(!featureOnHomepage)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          {/* Last updated information */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Revision History Section (New) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revision History</h3>
        <div className="space-y-3">
          {[
            { date: 'March 18, 2025', user: 'Amara Fernando', action: 'Updated content and added new section' },
            { date: 'February 5, 2025', user: 'Amara Fernando', action: 'Minor edits to improve readability' },
            { date: 'January 15, 2025', user: 'Amara Fernando', action: 'Initial publication' }
          ].map((revision, index) => (
            <div key={index} className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{revision.date}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {revision.user} - {revision.action}
                </div>
              </div>
              <button className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default EditBlog;