import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Image, Calendar, Clock, Tag, Save, 
  Send, X, Plus, HelpCircle, ChevronDown, Quote, Type, 
  Heading1, Heading2, Bookmark, Layout, Camera, Paperclip,
  FileText, Check, AlertTriangle, User
} from 'lucide-react';

const BlogEditor = () => {
  const fileInputRef = useRef(null);
  const coverImageRef = useRef(null);
  const authorImageRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    introduction: '',
    category: '',
    tags: '',
    author: '',
    authorPosition: '',
    authorCompany: '',
    Quote1: '',
    Quote2: '',
    Quote3: '',
    subTitle1: '', subContent1: '',
    subTitle2: '', subContent2: '',
    subTitle3: '', subContent3: '',
    subTitle4: '', subContent4: '',
    subTitle5: '', subContent5: '',
    subTitle6: '', subContent6: '',
    subTitle7: '', subContent7: '',
    subTitle8: '', subContent8: '',
    subTitle9: '', subContent9: '',
    subTitle10: '', subContent10: ''
  });
  
  const [visibleSections, setVisibleSections] = useState({
    section1: true,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
    section7: false,
    section8: false,
    section9: false,
    section10: false,
  });
  
  const [files, setFiles] = useState({
    blog: null,
    blogCover: null,
    authorImage: null
  });
  
  const [previewImages, setPreviewImages] = useState({
    blog: null,
    blogCover: null,
    authorImage: null
  });
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
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

  const toggleSection = (section) => {
    setVisibleSections({
      ...visibleSections,
      [section]: !visibleSections[section]
    });
  };
  
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages({
          ...previewImages,
          [fileType]: reader.result
        });
      };
      reader.readAsDataURL(file);
      setFiles({
        ...files,
        [fileType]: file
      });
    }
  };
  
  const handleSubmit = async (e, status = 'published') => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Add files if they exist
      if (files.blog) {
        formDataToSend.append('blog', files.blog);
      }
      
      if (files.blogCover) {
        formDataToSend.append('blogCover', files.blogCover);
      }

      if (files.authorImage) {
        formDataToSend.append('authorImage', files.authorImage);
      }
      
      // Send data to backend
      const response = await fetch('http://localhost:8000/api/blogs/add', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to submit blog post');
      }
      
      const data = await response.json();
      setSuccessMessage(data.message || 'Blog post published successfully!');
      
      // Reset form or redirect
      // window.location.href = '/blogs';
      
    } catch (error) {
      console.error('Error submitting blog:', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create New Article</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Share your knowledge and insights with the world</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={(e) => handleSubmit(e, 'draft')} 
              disabled={loading}
              className="hidden sm:flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </button>
            <button 
              onClick={(e) => handleSubmit(e, 'published')} 
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publish Article
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Layout className="h-5 w-5 text-indigo-500 mr-2" />
                    Cover Image
                  </h2>
                </div>
                
                <div 
                  className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center ${previewImages.blogCover ? 'p-4' : 'p-8'}`}
                  onClick={() => coverImageRef.current.click()}
                >
                  {previewImages.blogCover ? (
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImages({...previewImages, blogCover: null});
                          setFiles({...files, blogCover: null});
                        }} 
                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img 
                        src={previewImages.blogCover} 
                        alt="Cover Preview" 
                        className="w-full h-56 md:h-64 object-cover rounded-lg" 
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 cursor-pointer">
                      <Camera className="h-12 w-12 mx-auto text-gray-400" />
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload your cover image
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Recommended: 1600x900 pixels (16:9 ratio)
                      </p>
                    </div>
                  )}
                  <input 
                    ref={coverImageRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'blogCover')}
                  />
                </div>
              </div>
            </div>
            
            {/* Title & Meta */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Type className="h-5 w-5 text-indigo-500 mr-2" />
                  Article Details
                </h2>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Article Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      placeholder="Enter an attention-grabbing title..."
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-lg transition-all"
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="relative">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category*
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
                        required
                      />
                      <ChevronDown 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" 
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      />
                    </div>
                    {showCategoryDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-64 overflow-y-auto">
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
                  
                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags (comma separated)
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        placeholder="e.g. startup, innovation, leadership"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Add up to 5 tags to categorize your article
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                  Article Content
                </h2>
                
                {/* Introduction */}
                <div className="mb-6">
                  <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Introduction* <span className="text-xs text-gray-500">(Grab the reader's attention)</span>
                  </label>
                  <textarea
                    id="introduction"
                    name="introduction"
                    rows="4"
                    placeholder="Start with a compelling introduction..."
                    value={formData.introduction}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                {/* Content Sections */}
                <div className="space-y-6">
                  {/* Section 1 */}
                  {visibleSections.section1 && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Section 1</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="subTitle1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Subheading
                          </label>
                          <input
                            type="text"
                            id="subTitle1"
                            name="subTitle1"
                            placeholder="Section title..."
                            value={formData.subTitle1}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="subContent1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content
                          </label>
                          <textarea
                            id="subContent1"
                            name="subContent1"
                            rows="4"
                            placeholder="Write your content..."
                            value={formData.subContent1}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Section 2 */}
                  {visibleSections.section2 && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Section 2</h3>
                        <button 
                          onClick={() => toggleSection('section2')}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="subTitle2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Subheading
                          </label>
                          <input
                            type="text"
                            id="subTitle2"
                            name="subTitle2"
                            placeholder="Section title..."
                            value={formData.subTitle2}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="subContent2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content
                          </label>
                          <textarea
                            id="subContent2"
                            name="subContent2"
                            rows="4"
                            placeholder="Write your content..."
                            value={formData.subContent2}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Section 3 */}
                  {visibleSections.section3 && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Section 3</h3>
                        <button 
                          onClick={() => toggleSection('section3')}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="subTitle3" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Subheading
                          </label>
                          <input
                            type="text"
                            id="subTitle3"
                            name="subTitle3"
                            placeholder="Section title..."
                            value={formData.subTitle3}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="subContent3" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content
                          </label>
                          <textarea
                            id="subContent3"
                            name="subContent3"
                            rows="4"
                            placeholder="Write your content..."
                            value={formData.subContent3}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Add More Sections */}
                  <div>
                    <button
                      type="button"
                      className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        if (!visibleSections.section2) {
                          toggleSection('section2');
                        } else if (!visibleSections.section3) {
                          toggleSection('section3');
                        } else if (!visibleSections.section4) {
                          toggleSection('section4');
                        } else if (!visibleSections.section5) {
                          toggleSection('section5');
                        }
                      }}
                    >
                      <Plus className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">Add Section</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quotes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Quote className="h-5 w-5 text-indigo-500 mr-2" />
                  Notable Quotes
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="Quote1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quote #1
                    </label>
                    <textarea
                      id="Quote1"
                      name="Quote1"
                      rows="2"
                      placeholder="Add a memorable quote from your article..."
                      value={formData.Quote1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="Quote2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quote #2
                    </label>
                    <textarea
                      id="Quote2"
                      name="Quote2"
                      rows="2"
                      placeholder="Add another quotable moment..."
                      value={formData.Quote2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="Quote3" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quote #3
                    </label>
                    <textarea
                      id="Quote3"
                      name="Quote3"
                      rows="2"
                      placeholder="Add a third impactful quote..."
                      value={formData.Quote3}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl shadow-md text-white p-6">
              <h3 className="font-semibold text-lg mb-3">Publishing Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100">Current Status:</span>
                  <span className="px-2 py-1 bg-indigo-700 bg-opacity-50 rounded text-sm">Draft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100">Required Fields:</span>
                  <span className="text-indigo-100">{formData.title && formData.introduction && formData.category && formData.author && formData.authorPosition && formData.authorCompany ? 'Complete' : 'Incomplete'}</span>
                </div>
                <div className="mt-4 pt-3 border-t border-indigo-400 border-opacity-30">
                  <div className="text-sm text-indigo-100">
                    <div className="flex items-center mb-1">
                      <span className={formData.title ? 'text-green-300' : 'text-indigo-200'}>
                        {formData.title ? '✓' : '•'} Title
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className={formData.introduction ? 'text-green-300' : 'text-indigo-200'}>
                        {formData.introduction ? '✓' : '•'} Introduction
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className={formData.category ? 'text-green-300' : 'text-indigo-200'}>
                        {formData.category ? '✓' : '•'} Category
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={formData.author && formData.authorPosition && formData.authorCompany ? 'text-green-300' : 'text-indigo-200'}>
                        {formData.author && formData.authorPosition && formData.authorCompany ? '✓' : '•'} Author Details
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Featured Image Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                  <Paperclip className="h-5 w-5 text-indigo-500 mr-2" />
                  Featured Image
                </h3>
                
                <div 
                  className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center ${previewImages.blog ? 'p-3' : 'p-6'}`}
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewImages.blog ? (
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImages({...previewImages, blog: null});
                          setFiles({...files, blog: null});
                        }} 
                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img 
                        src={previewImages.blog} 
                        alt="Featured Preview" 
                        className="w-full h-40 object-cover rounded-lg" 
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 cursor-pointer">
                      <Image className="h-10 w-10 mx-auto text-gray-400" />
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload image
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Will be displayed within content
                      </p>
                    </div>
                  )}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'blog')}
                  />
                </div>
              </div>
            </div>
            
            {/* Author Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                  <User className="h-5 w-5 text-indigo-500 mr-2" />
                  Author Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-indigo-200 dark:border-indigo-800">
                      <img 
                        src={previewImages.authorImage }
                        alt="Author" 
                        className="w-full h-full object-cover"
                      />
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => authorImageRef.current.click()}
                      >
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <input 
                        ref={authorImageRef}
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFiles(prev => ({ ...prev, authorImage: file }));
                            setPreviewImages(prev => ({
                              ...prev,
                              authorImage: URL.createObjectURL(file)
                            }));
                          }
                        }}
                      />

                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Author details:
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name*
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      placeholder="Author's full name"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="authorPosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Position/Title*
                    </label>
                    <input
                      type="text"
                      id="authorPosition"
                      name="authorPosition"
                      placeholder="e.g. Senior HR Consultant"
                      value={formData.authorPosition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="authorCompany" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company/Organization*
                    </label>
                    <input
                      type="text"
                      id="authorCompany"
                      name="authorCompany"
                      placeholder="e.g. ABC Consulting"
                      value={formData.authorCompany}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Publishing Options */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Publishing Options</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">Schedule Publication</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Set future publish date</div>
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
                      <div className="text-xs text-gray-500 dark:text-gray-400">Enable reader feedback</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">Feature Article</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Highlight on homepage</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">Send Notifications</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Alert subscribers</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons (Mobile) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:hidden">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={(e) => handleSubmit(e, 'draft')} 
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </button>
                <button 
                  onClick={(e) => handleSubmit(e, 'published')} 
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;