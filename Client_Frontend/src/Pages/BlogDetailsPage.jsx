import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';
import { useChangeDateFormat, useConCatName } from '../hooks/customHooks';
import setTimeStatus from '../scripts/setTimeStatus';
import generateBlogReadingTime from '../scripts/generateBlogReadingTime';
import fetchLoggedUserData from '../scripts/fetchLoggedUserData';
import baseURL from '../config/axiosPortConfig';
import SessionTimeout from "../protected/SessionTimeout";


function BlogDetailsPage() {
  const { blogId } = useParams();

  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [blogLikeCount, setBlogLikeCount] = useState(0);
  const [loadComments, setLoadComments] = useState(false);
  const [loadBlogComments, setLoadBlogComments] = useState(false);
  const [blogReadTime, setBlogReadTime] = useState('');
  const [loggedUser, setLoggedUser] = useState({});
  const [loggedUserId, setLoggedUserId] = useState('');
  const [comments, setComments] = useState([]);
  const [blogTagsData, setBlogTagsData] = useState([]);
  const [noOfComments, setNoOfComments] = useState(0);
  const [comment, setComment] = useState('');
  const [followAuthor, setFollowAuthor] = useState(false);
  const [likedBlog, setLikedBlog] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  // Load blog data first regardless of user login
  if (blogId) {
    fetchBlogData(blogId);
    fetchBlogLikeCount(blogId);
    fetchBlogComments(blogId);
  }

  // Then check for logged in user
  const loadUserData = async () => {
    try {
      const loggedUserData = await fetchLoggedUserData();
  
      if (loggedUserData && loggedUserData.user && loggedUserData.user[0]) {
        setLoggedUser(loggedUserData.user[0]);
        setLoggedUserId(loggedUserData.user[0].userId);
        
        // Only fetch like state if user is logged in
        if (blogId && loggedUserData.user[0].userId) {
          fetchLikeStateforUsertoBlog(blogId, loggedUserData.user[0].userId);
        }
      } else {
        // User is not logged in - this is a valid state
        setLoggedUser({});
        setLoggedUserId('');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Don't redirect, just clear user data
      setLoggedUser({});
      setLoggedUserId('');
    }
  };

  loadUserData();
}, [blogId]);  
// Fetch related posts based on category
  const fetchRelatedPosts = useCallback(async (category, currentBlogId) => {
    try {
      const res = await axios.get(`${baseURL}/api/blogs?category=${encodeURIComponent(category)}`);
      if (res.status === 200 && Array.isArray(res.data.data)) {
        // Exclude the current blog from related
        const filtered = res.data.data.filter(post => post.blogId !== currentBlogId);
        setRelatedPosts(filtered.slice(0, 4)); // Show up to 4 related
      } else {
        setRelatedPosts([]);
      }
    } catch (err) {
      setRelatedPosts([]);
    }
  }, []);
  
  const fetchBlogData = useCallback(async (id) => {
    setLoading(true);
    try {
      const blogResponse = await axios.get(`${baseURL}/api/blogs/${id}`);
      if(blogResponse.status === 200 && blogResponse.data.data[0]) {
        const blogData = blogResponse.data.data[0];
        setBlogPost(blogData);

        const fullBlogString = `${blogData.title} ${blogData.introduction} ${blogData.subTitle1} ${blogData.subContent1} ${blogData.subTitle2} ${blogData.subContent2} ${blogData.subTitle3} ${blogData.subContent3} ${blogData.subTitle4} ${blogData.subContent4} ${blogData.subTitle5} ${blogData.subContent5} ${blogData.subTitle6} ${blogData.subContent6} ${blogData.subTitle7} ${blogData.subContent7} ${blogData.subTitle8} ${blogData.subContent8} ${blogData.subTitle9} ${blogData.subContent9} ${blogData.subTitle10} ${blogData.subContent10} ${blogData.Quote1} ${blogData.Quote2} ${blogData.Quote3}`;
        setBlogReadTime(generateBlogReadingTime(fullBlogString));

        // get the blog tags ...
        const blogTags = blogData.tags ? blogData.tags.split(',').map(tag => tag.trim()) : [];
        setBlogTagsData(blogTags);

        // Fetch related posts after blog data is loaded
        if (blogData.category && blogData.blogId) {
          fetchRelatedPosts(blogData.category, blogData.blogId);
        }
      } else {
        toast.error('Blog post not found');
        setBlogPost(null);
        setRelatedPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Error loading blog post');
      setBlogPost(null);
      setRelatedPosts([]);
    } finally {
      setLoading(false);
    }
  }, [fetchRelatedPosts]);

  const fetchLikeStateforUsertoBlog = useCallback(async (idBlog, idUser) => {
    try {
      const userLikeStateForBlogResponse = await axios.get(`${baseURL}/api/blogs/state/${idBlog}/${idUser}`);
      // console.log(userLikeStateForBlogResponse.data);
      if(userLikeStateForBlogResponse.status == 200) {
        setLikedBlog(true);
      } else {
        setLikedBlog(false);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [likedBlog]);

  const fetchBlogLikeCount = useCallback(async (id) => {
    try {
      const blogLikeCountResponse = await axios.get(`${baseURL}/api/blogs/like-count/${id}`);
      // console.log(blogLikeCountResponse.data.likeCount);
      if(blogLikeCountResponse.status == 200) {
        setBlogLikeCount(blogLikeCountResponse.data.likeCount);
      } else {
        console.log('Unable to fetch blog like count');
        setBlogLikeCount(0);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [blogLikeCount]);

  const fetchBlogComments = useCallback(async (id) => {
    try {
      const blogCommentsResponse = await axios.get(`${baseURL}/api/blogs/comments/${id}`);
      if(blogCommentsResponse.status == 200) {
        const blogRelatedcomments = blogCommentsResponse.data.data;
        if(blogRelatedcomments.length == 0) {
          setNoOfComments(0);
          setComments([]);
          setLoadComments(false);
        } else {
          const sortedComments = [...blogRelatedcomments].sort((a, b) => {
            return new Date(b.commentedDate) - new Date(a.commentedDate);
          });
          setNoOfComments(blogRelatedcomments.length);
          setComments(sortedComments);
          setLoadComments(true);
        }
      } else {
        console.log('Unable to fetch blog comments');
        setComments([]);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [noOfComments, comments, loadComments]);

  const handleLoadComments = () => {
    setLoadBlogComments(true);
  }

  const handleAddComment = useCallback(async () => {
    if(!comment) {
      toast.error('Please Add a comment, if you want to proceed');
      return;
    }

    if(!loggedUserId || !blogId) {
      toast.error('An Error Occured. Please try again');
      return;
    }

    try {
      const addCommentResponse = await axios.post(`${baseURL}/api/blogs/comments/add`, { blogId: blogId, comment: comment, userId: loggedUserId },{withCredentials: true});
      // console.log(addCommentResponse.data);
      if(addCommentResponse.status == 201) {
        const commentRelatedData = {
          Id: addCommentResponse.data.Id,
          userId: loggedUserId,
          comment: comment,
          commentedDate: new Date(),
          firstName: loggedUser.firstName,
          lastName: loggedUser.lastName,
          email: loggedUser.email
        };
        comments.push(commentRelatedData);
        const sortedUpdatedComments = [...comments].sort((a, b) => {
          return new Date(b.commentedDate) - new Date(a.commentedDate);
        });
        setComments(sortedUpdatedComments);
        setNoOfComments(noOfComments + 1);
      } else {
        toast.error('Error occured while adding comment');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [comment, loggedUserId, blogId, comments, noOfComments]);

  const handleFollowAuthor = () => {
    if(followAuthor == true) {
      setFollowAuthor(false);
    } else {
      setFollowAuthor(true);
    }
  } 
  const handleShareClick = () => {
    setSharePopupOpen(true);
  };

  const handleCopyBlogLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  }; 
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleLikeState = async () => {
    if(likedBlog == true) {
      setLikedBlog(false);
      setBlogLikeCount(blogLikeCount - 1);
      await handleDislikeBlog();
    } else {
      setLikedBlog(true);
      setBlogLikeCount(blogLikeCount + 1);
      await handleLikeBlog();
    }
  }

  const handleLikeBlog = useCallback(async () => {
    if(!loggedUserId || !blogId) {
      toast.error('Something Went Wrong');
      return;
    }

    try {
      const likeBlogResponse = await axios.post(`${baseURL}/api/blogs/likes/add`, { blogId: blogId, userId: loggedUserId },{withCredentials: true});
      // console.log(likeBlogResponse.data);
      if(likeBlogResponse.status == 201) {
        // console.log('Liked Blog');
      } else {
        console.log('Error Occured');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [loggedUserId, blogId]); 

  const handleDislikeBlog = useCallback(async () => {
    if(!loggedUserId || !blogId) {
      toast.error('Something Went Wrong');
      return;
    }

    try {
      const dislikeBlogResponse = await axios.post(`${baseURL}/api/blogs/likes/remove`, { blogId: blogId, userId: loggedUserId }, {withCredentials: true});
      // console.log(dislikeBlogResponse.data);
      if(dislikeBlogResponse.status == 200) {
        // console.log('Disliked Blog');
      } else {
        console.log('Error Occured');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [loggedUserId, blogId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-2 bg-gray-200 rounded-full mb-4"></div>
          <div className="w-48 h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Session timeout logic will run in background */}
        <SessionTimeout />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Post Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button Bar */}
      <ToastContainer/>
      {/* Session timeout logic will run in background */}
      <SessionTimeout />
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <img 
          src={blogPost.coverImage ? `${baseURL}/uploads/blogs/covers/${blogPost.coverImage}` : ''}  
          alt={blogPost.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 max-w-5xl mx-auto px-6 py-12">
          <span className="inline-block px-3 py-1 bg-white text-black text-sm font-medium rounded-full mb-4">
            {blogPost.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {blogPost.title}
          </h1>
          <div className="flex flex-wrap items-center text-white gap-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{useChangeDateFormat(blogPost.addedAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{blogReadTime ? blogReadTime : ''}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp size={16} className="mr-2" />
              <span>{blogLikeCount ? blogLikeCount : 0} likes</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-2" />
              <span>{noOfComments ? noOfComments : 0} comments</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Author Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-30">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
          <img 
            src={blogPost.author.image} 
            alt={blogPost.author} 
            className="w-16 h-16 rounded-full object-cover border-2 border-white"
          />
          <div>
            <h3 className="font-bold text-lg">{blogPost.author}</h3>
            <p className="text-gray-600 text-sm">{blogPost.authorPosition}, {blogPost.authorCompany}</p>
          </div>
          <button className="ml-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors" onClick={handleFollowAuthor}>
            {followAuthor ? 'following' : 'follow'}
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose lg:prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blogPost.introduction }} />
          <br/>
          {blogPost.subTitle1 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle1 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent1 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent1 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle2 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle2 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent2 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent2 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle3 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle3 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent3 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent3 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle4 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle4 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent4 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent4 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle5 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle5 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent5 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent5 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle6 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle6 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent6 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent6 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle7 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle7 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent7 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent7 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle8 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle8 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent8 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent8 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle9 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subTitle9 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent9 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subContent9 }} />
              <br/>
            </div>
          )}
          {blogPost.subTitle10 && (
            <div>
              <div dangerouslySetInnerHTML={{ __html: blogPost.subTitle10 }} />
              <br/>
            </div>
          )}
          {blogPost.subContent10 && (
            <div>
              <div className='font-bold' dangerouslySetInnerHTML={{ __html: blogPost.subContent10 }} />
              <br/>
            </div>
          )}
        </article>
        
        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          {blogTagsData.length === 0 ? (
            <p className='text-center'>No Tags Found for this Blog!</p>
          ) : (
            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4">Tagged with</h3>
              <div className="flex flex-wrap gap-2">
                {blogTagsData.map((tag, index) => (
                  <Link 
                    key={index} 
                    to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Engagement Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" 
                onClick={() => {
                  if (!loggedUserId) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Login Required',
                      text: 'Please login to like posts',
                      confirmButtonColor: '#3085d6',
                    }).then((result) => {
                      if(result.isConfirmed) {
                        navigate('/login');
                      }
                    });
                    return;
                  }
                  handleLikeState();
                }}
              >
                {likedBlog ? (
                  <div className='flex justify-content-center'>
                    <ThumbsUp size={18} className="text-blue-500 fill-blue-500 mt-1"/>
                    <span className='ml-3'>Liked</span>
                  </div>
                ) : (
                  <div className='flex justify-content-center'>
                    <ThumbsUp size={18} className="mt-1"/>
                    <span className='ml-3'>Like</span>
                  </div>
                )}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={handleShareClick}>
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
            {sharePopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="relative bg-white border border-gray-200 rounded shadow-lg p-12 w-full max-w-lg mx-2">
                <button
                  onClick={() => setSharePopupOpen(false)}
                  className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                  aria-label="Close"
                >×</button>
                <div className="mb-4 text-xl font-bold text-gray-700 text-center">Share this blog</div>
                <div className="flex gap-6 mb-6 justify-center">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(blogPost.title + ' - ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on WhatsApp"
                    className="text-green-500 hover:text-green-700 text-4xl"
                  >
                    <svg width="32" height="32" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 012.13 12.04C2.13 6.495 6.626 2 12.175 2c2.652 0 5.144 1.037 7.019 2.921A9.823 9.823 0 0122.35 12.04c0 5.549-4.496 10.044-10.044 10.044zm8.413-18.457A11.815 11.815 0 0012.175 0C5.453 0 0 5.453 0 12.04c0 2.124.557 4.199 1.613 6.032L.057 24l6.09-1.6a11.89 11.89 0 005.998 1.561h.001c6.722 0 12.175-5.453 12.175-12.04 0-3.241-1.262-6.287-3.557-8.678z"/></svg>
                  </a>
                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(blogPost.title)}&body=${encodeURIComponent(shareUrl)}`}
                    title="Share via Email"
                    className="text-blue-500 hover:text-blue-700 text-4xl"
                  >
                    <svg width="32" height="32" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/></svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                    className="text-blue-700 hover:text-blue-900 text-4xl"
                  >
                    <svg width="32" height="32" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                  </a>
                  {/* X (Twitter) */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogPost.title + ' - ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on X"
                    className="text-black hover:text-gray-700 text-4xl"
                  >
                    <svg width="32" height="32" fill="currentColor"><path d="M22.162 5.656c.015.211.015.423.015.634 0 6.451-4.91 13.888-13.888 13.888-2.762 0-5.332-.809-7.496-2.211.383.045.766.06 1.164.06 2.293 0 4.402-.766 6.087-2.064-2.146-.045-3.953-1.457-4.58-3.404.3.045.6.075.915.075.436 0 .872-.06 1.278-.166-2.236-.451-3.92-2.422-3.92-4.797v-.06c.646.36 1.387.583 2.174.614-1.293-.872-2.146-2.35-2.146-4.027 0-.892.241-1.726.646-2.445 2.36 2.893 5.89 4.797 9.87 4.997-.075-.36-.12-.736-.12-1.112 0-2.7 2.192-4.892 4.892-4.892 1.406 0 2.678.6 3.57 1.564 1.112-.211 2.146-.614 3.08-1.164-.364 1.136-1.136 2.088-2.146 2.678 1-.12 1.96-.383 2.85-.766-.646.982-1.462 1.842-2.406 2.53z"/></svg>
                  </a>
                  {/* Copy Link */}
                  <button
                    onClick={handleCopyBlogLink}
                    title="Copy link"
                    className="text-purple-600 hover:text-purple-800 text-4xl"
                  >
                    <svg width="32" height="32" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full px-4 py-2 border rounded text-base mb-4"
                />
                <button
                  onClick={handleCopyBlogLink}
                  className="w-full bg-purple-600 text-white text-base py-2 rounded hover:bg-purple-700 font-semibold"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
            {/* <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Subscribe to Newsletter
            </button> */}
          </div>
          
          {/* Comments Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-xl mb-6">Comments ({noOfComments ? noOfComments : 0})</h3>
            
            {/* Comment Form */}
            <div className="mb-8">
              {loggedUserId ? (
                <>
                  <textarea
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none h-32"
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <button 
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors" 
                      onClick={handleAddComment}
                    >
                      Post Comment
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-2">Please login to comment</p>
                  <Link 
                    to="/login" 
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Login here
                  </Link>
                </div>
              )}
            </div>
            
            {/* Comments */}
            <div className="space-y-6">
              {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="https://source.unsplash.com/random/40x40?portrait=1" 
                    alt="Commenter" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium">Rajith Perera</h4>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Great insights on remote work challenges in Sri Lanka. I've experienced the internet infrastructure issues firsthand. Would love to see more about how companies are addressing the digital divide.
                </p>
              </div> */}
              
              {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="https://source.unsplash.com/random/40x40?portrait=2" 
                    alt="Commenter" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium">Tharushi Silva</h4>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  As someone working in HR, I've seen the hybrid model becoming increasingly popular. The challenge is creating fair policies between remote-capable and on-site roles. Would be interested in case studies of companies doing this well.
                </p>
              </div> */}
            </div>
            
            { loadComments == true && (
              <button className="w-full mt-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={handleLoadComments}>
                Load Comments
              </button>
            )}

          {loadBlogComments ? (
            comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.Id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="https://source.unsplash.com/random/40x40?portrait=1" 
                      alt="Commenter" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className='ml-10'>
                      <h4 className="font-medium">{useConCatName(comment.firstName, comment.lastName)}</h4>
                      <p className="text-xs text-gray-500">{setTimeStatus(comment.commentedDate)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {comment.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p>No Comments Found!</p>
              </div>
            )
          ) : null }
          </div>
        </div>
      </div>
      
      {/* Related Articles */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.length === 0 ? (
              <p className="col-span-2 text-center text-gray-500">No related articles found.</p>
            ) : (
              relatedPosts.map(post => (
                <article 
                  key={post.blogId}
                  className="group flex gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img 
                      src={post.coverImage ? `${baseURL}/uploads/blogs/covers/${post.coverImage}` : ''}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500">{post.category}</span>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-gray-600 transition-colors">
                      <Link to={`/blog/${post.blogId}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{useChangeDateFormat(post.addedAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{generateBlogReadingTime(
                        `${post.title} ${post.introduction || ''} ${post.subContent1 || ''}`
                      )}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Looking for Career Opportunities?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our latest job listings or upload your CV to be considered for upcoming positions matching your skills and experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs" className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Browse Jobs
            </Link>
            <Link to="/dashboard" className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Upload Your CV
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer would go here, reusing from your original code */}
    </div>
  );
}

export default memo(BlogDetailsPage);