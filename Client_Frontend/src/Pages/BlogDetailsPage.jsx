import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';
import { useChangeDateFormat, useConCatName } from '../hooks/customHooks';
import setTimeStatus from '../scripts/setTimeStatus';
import generateBlogReadingTime from '../scripts/generateBlogReadingTime';
import fetchLoggedUserData from '../scripts/fetchLoggedUserData';


export default function BlogDetailsPage() {
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

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const loggedUserData = await fetchLoggedUserData();
      console.log('Logged User', loggedUserData);
  
      if (loggedUserData) {
        console.log(loggedUserData.userId);
        setLoggedUser(loggedUserData);
        setLoggedUserId(loggedUserData.userId);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Require',
          text: 'Please login first!',
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if(result.isConfirmed) {
            navigate('/login');
          }
        });
      }
    };
  
    loadUserData();

    if (blogId) {
      fetchBlogData(blogId);
      fetchBlogLikeCount(blogId);
      fetchBlogComments(blogId);
    }
  }, [blogId]);  
  
  // Simulate fetching blog post data
  // useEffect(() => {
  //   const loggedUserData = await fetchLoggedUserData();
  //   console.log('Logged User', loggedUserData);
  //   console.log(loggedUserData.userId);
  //   if(loggedUserData) {
  //     setLoggedUser(loggedUserData);
  //     setLoggedUserId(loggedUserData.userId);
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Login Require',
  //       text: 'Please login first!',
  //       confirmButtonColor: '#3085d6',
  //     }).then((result) => {
  //       if(result.isConfirmed) {
  //         navigate('/login');
  //       }
  //     });
  //   }

  //   if(blogId) {
  //     fetchBlogData(blogId);
  //     fetchBlogLikeCount(blogId);
  //     fetchBlogComments(blogId);
  //   }
  //   // This would normally be an API call
  //   // const fetchPost = () => {
  //   //   setLoading(true);
      
  //   //   // Mock data for demonstration
  //   //   // const post = {
  //   //   //   id: parseInt(id),
  //   //   //   title: "Future of Remote Work in Sri Lanka",
  //   //   //   category: "Industry Trends",
  //   //   //   date: "March 15, 2024",
  //   //   //   readTime: "5 min read",
  //   //   //   author: {
  //   //   //     name: "Amara Fernando",
  //   //   //     role: "Senior HR Consultant",
  //   //   //     image: "https://miro.medium.com/v2/resize:fit:1400/1*NeRvhd48SzhZhQoyLwDsog.jpeg"
  //   //   //   },
  //   //   //   image: "https://miro.medium.com/v2/resize:fit:1400/1*NeRvhd48SzhZhQoyLwDsog.jpeg",
  //   //   //   content: `
  //   //   //     <p class="mb-4">The landscape of work in Sri Lanka is undergoing a significant transformation, accelerated by global events and technological advancements. As we navigate through 2024, remote and hybrid work models continue to reshape how organizations operate and how professionals approach their careers.</p>
          
  //   //   //     <h2 class="text-2xl font-bold mt-8 mb-4">The Current State of Remote Work</h2>
          
  //   //   //     <p class="mb-4">According to recent surveys, approximately 62% of Sri Lankan companies now offer some form of remote work arrangement, a substantial increase from just 18% in 2019. This shift is particularly notable in the IT, finance, and business services sectors, where digital infrastructure enables seamless remote operations.</p>
          
  //   //   //     <p class="mb-4">The COVID-19 pandemic served as a catalyst, but the persistence of remote work arrangements suggests deeper benefits beyond crisis management. Companies report reduced operational costs, access to wider talent pools, and in many cases, improved productivity.</p>
          
  //   //   //     <blockquote class="border-l-4 border-gray-800 pl-4 italic my-6 text-gray-600">
  //   //   //       "The traditional office-centric approach is evolving into a more flexible, results-oriented work culture. Companies that embrace this change are positioning themselves to thrive in the future economy." — Sri Lanka Association of HR Professionals
  //   //   //     </blockquote>
          
  //   //   //     <h2 class="text-2xl font-bold mt-8 mb-4">Benefits and Challenges</h2>
          
  //   //   //     <p class="mb-4">For employees, remote work offers reduced commute times in congested urban centers like Colombo, improved work-life balance, and the ability to work for international companies without relocation. Many professionals report higher job satisfaction and reduced stress levels.</p>
          
  //   //   //     <p class="mb-4">However, challenges persist. Companies struggle with maintaining corporate culture, ensuring consistent productivity monitoring, and addressing the inequality between roles that can and cannot be performed remotely. Employees sometimes report feelings of isolation, difficulty separating work and personal life, and concerns about career progression in a remote environment.</p>
          
  //   //   //     <h2 class="text-2xl font-bold mt-8 mb-4">Infrastructure Considerations</h2>
          
  //   //   //     <p class="mb-4">One significant factor influencing remote work adoption in Sri Lanka is internet infrastructure. While urban centers enjoy relatively reliable connectivity, rural areas often face challenges with consistent high-speed internet access. Power outages remain a concern in some regions, potentially disrupting remote work.</p>
          
  //   //   //     <p class="mb-4">Forward-thinking companies are addressing these challenges by providing stipends for home office setups, including backup power solutions and dedicated internet connections. Some organizations are exploring hub-and-spoke models with smaller regional offices or co-working space partnerships to provide alternative workspaces.</p>
          
  //   //   //     <h2 class="text-2xl font-bold mt-8 mb-4">The Future Outlook</h2>
          
  //   //   //     <p class="mb-4">Looking ahead, the hybrid model appears to be gaining the most traction among Sri Lankan businesses. This approach combines in-office presence with remote work flexibility, aiming to capture the benefits of both models while mitigating their respective drawbacks.</p>
          
  //   //   //     <p class="mb-4">As international companies increasingly hire remote workers from Sri Lanka, local companies face both competition for talent and opportunities to adopt global best practices. This international exposure is likely to accelerate the evolution of work models and professional expectations across the country.</p>
          
  //   //   //     <p class="mb-4">The legal framework is also evolving, with discussions about updating labor laws to address remote work arrangements, including considerations for work hours, health and safety requirements for home offices, and tax implications.</p>
          
  //   //   //     <h2 class="text-2xl font-bold mt-8 mb-4">Preparing for Success</h2>
          
  //   //   //     <p class="mb-4">For professionals looking to thrive in this changing landscape, developing self-management skills, digital literacy, and effective virtual communication abilities is crucial. For employers, investing in secure digital infrastructure, reimagining management approaches to focus on outcomes rather than presence, and intentionally fostering company culture across distributed teams will be key differentiators.</p>
          
  //   //   //     <p class="mb-6">As Sri Lanka continues to position itself as a knowledge economy hub in South Asia, the evolution of work models will play a significant role in shaping its economic future and competitiveness on the global stage.</p>
  //   //   //   `,
  //   //   //   tags: ["Remote Work", "HR Trends", "Workplace Culture", "Technology", "Employment"],
  //   //   //   views: 1243,
  //   //   //   likes: 89,
  //   //   //   comments: 23
  //   //   // };
      
  //   //   // setBlogPost(post);
      
  //   //   // Mock related posts
  //   //   // setRelatedPosts([
  //   //   //   {
  //   //   //     id: 2,
  //   //   //     title: "Top 5 Tech Skills in Demand for 2024",
  //   //   //     excerpt: "Discover the most sought-after technical skills in the Sri Lankan job market this year...",
  //   //   //     category: "Career Advice",
  //   //   //     date: "March 12, 2024",
  //   //   //     readTime: "4 min read",
  //   //   //     image: "https://www.activtrak.com/wp-content/uploads/2023/09/blog-header-7-steps-productive-remote-work-environment.jpg"
  //   //   //   },
  //   //   //   {
  //   //   //     id: 3,
  //   //   //     title: "Building Effective Workplace Cultures",
  //   //   //     excerpt: "Strategies for creating productive and positive work environments in modern organizations...",
  //   //   //     category: "HR Insights",
  //   //   //     date: "March 10, 2024",
  //   //   //     readTime: "6 min read",
  //   //   //     image: "https://source.unsplash.com/random/800x600?teamwork"
  //   //   //   }
  //   //   // ]);
      
  //   //   setLoading(false);
  //   // };
    
  //   // fetchPost();
  // }, [blogId]);

  const fetchBlogData = async (id) => {
    setLoading(true);
    try {
      const blogResponse = await axios.get(`http://localhost:8000/api/blogs/${id}`);
      // console.log(blogResponse.data);
      if(blogResponse.status == 200) {
        setBlogPost(blogResponse.data.data[0]);
        setLoading(false);
        const blog = blogResponse.data.data[0];
        const fullBlogString = `${blog.title} ${blog.introduction} ${blog.subTitle1} ${blog.subContent1} ${blog.subTitle2} ${blog.subContent2} ${blog.subTitle3} ${blog.subContent3} ${blog.subTitle4} ${blog.subContent4} ${blog.subTitle5} ${blog.subContent5} ${blog.subTitle6} ${blog.subContent6} ${blog.subTitle7} ${blog.subContent7} ${blog.subTitle8} ${blog.subContent8} ${blog.subTitle9} ${blog.subContent9} ${blog.subTitle10} ${blog.subContent10} ${blog.Quote1} ${blog.Quote2} ${blog.Quote3}`
        setBlogReadTime(generateBlogReadingTime(fullBlogString));
        // get the blog tags ...
        blogTags = blog.tags.split(', ');
      } else {
        console.log('Unable to fetch blog data');
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  } 

  const fetchBlogLikeCount = async (id) => {
    try {
      const blogLikeCountResponse = await axios.get(`http://localhost:8000/api/blogs/like-count/${id}`);
      console.log(blogLikeCountResponse.data.likeCount);
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
  }

  const fetchBlogComments = async (id) => {
    try {
      const blogCommentsResponse = await axios.get(`http://localhost:8000/api/blogs/comments/${id}`);
      console.log(blogCommentsResponse.data.data);
      if(blogCommentsResponse.status == 200) {
        const blogRelatedcomments = blogCommentsResponse.data.data;
        console.log(blogRelatedcomments);
        console.log(blogRelatedcomments.length);
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
  }

  const handleLoadComments = () => {
    setLoadBlogComments(true);
  }

  const handleAddComment = async () => {
    console.log(comment, loggedUserId, blogId);

    if(!comment) {
      toast.error('Please Add a comment, if you want to proceed');
      return;
    }

    if(!loggedUserId || !blogId) {
      toast.error('An Error Occured. Please try again');
      return;
    }

    try {
      const addCommentResponse = await axios.post('http://localhost:8000/api/blogs/comments/add', { blogId: blogId, comment: comment, userId: loggedUserId });
      console.log(addCommentResponse.data);
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
        console.log(commentRelatedData);
        comments.push(commentRelatedData);
        const sortedUpdatedComments = [...comments].sort((a, b) => {
          return new Date(b.commentedDate) - new Date(a.commentedDate);
        });
        setComments(sortedUpdatedComments);
        console.log(comments);
        setNoOfComments(noOfComments + 1);
      } else {
        toast.error('Error occured while adding comment');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const handleFollowAuthor = () => {
    setFollowAuthor(true);
  }
  
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
      
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <img 
          src={blogPost.coverImage ? `http://localhost:8000/uploads/blogs/covers/${blog.coverImage}` : ''} 
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
          {blogTagsData.length == 0 ? (<p className='text-center'>No Tags Found for this Blog!</p>) : (
            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4">Tagged with</h3>
              <div className="flex flex-wrap gap-2">
                {blogTags.map(tag => (
                  <Link 
                    key={tag} 
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
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ThumbsUp size={18} />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Subscribe to Newsletter
            </button>
          </div>
          
          {/* Comments Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-xl mb-6">Comments ({noOfComments ? noOfComments : 0})</h3>
            
            {/* Comment Form */}
            <div className="mb-8">
              <textarea
                placeholder="Share your thoughts..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none h-32"
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end mt-4">
                <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors" onClick={handleAddComment}>
                  Post Comment
                </button>
              </div>
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
            {relatedPosts.map(post => (
              <article 
                key={post.id}
                className="group flex gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-gray-500">{post.category}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-gray-600 transition-colors">
                    <Link to={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
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