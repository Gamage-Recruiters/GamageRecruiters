import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Image, Calendar, Clock, Tag, Save, 
  Send, X, Plus, HelpCircle, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

function AddNewBlog() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    readTime: '5 min read',
    content: '',
    tags: [],
    status: 'draft'
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const categories = [
    'Industry Trends', 'Technology', 'Tourism', 
    'Finance', 'Culture', 'Business', 'Health'
  ];

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
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e, status) => {
    e.preventDefault();
    // Implement your submission logic here
    console.log({
      ...formData,
      status,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    // You would typically send this data to your backend here
    alert(`Blog post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
  };

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Blog Post</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create and publish a new article</p>
          </div>
        </div>
        <div className="flex space-x-3">
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
            Publish
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
                  src="https://source.unsplash.com/random/100x100?portrait" 
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
                  Amara Fernando
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Senior HR Consultant
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
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">Schedule Publication</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Set a future date to automatically publish</div>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
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
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">Feature on Homepage</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Highlight this post on the main page</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AddNewBlog;