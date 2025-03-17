import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  // Simulate fetching blog post data
  useEffect(() => {
    // This would normally be an API call
    const fetchPost = () => {
      setLoading(true);
      
      // Mock data for demonstration
      const post = {
        id: parseInt(id),
        title: "Future of Remote Work in Sri Lanka",
        category: "Industry Trends",
        date: "March 15, 2024",
        readTime: "5 min read",
        author: {
          name: "Amara Fernando",
          role: "Senior HR Consultant",
          image: "https://source.unsplash.com/random/100x100?portrait"
        },
        image: "https://source.unsplash.com/random/1200x600?office",
        content: `
          <p class="mb-4">The landscape of work in Sri Lanka is undergoing a significant transformation, accelerated by global events and technological advancements. As we navigate through 2024, remote and hybrid work models continue to reshape how organizations operate and how professionals approach their careers.</p>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">The Current State of Remote Work</h2>
          
          <p class="mb-4">According to recent surveys, approximately 62% of Sri Lankan companies now offer some form of remote work arrangement, a substantial increase from just 18% in 2019. This shift is particularly notable in the IT, finance, and business services sectors, where digital infrastructure enables seamless remote operations.</p>
          
          <p class="mb-4">The COVID-19 pandemic served as a catalyst, but the persistence of remote work arrangements suggests deeper benefits beyond crisis management. Companies report reduced operational costs, access to wider talent pools, and in many cases, improved productivity.</p>
          
          <blockquote class="border-l-4 border-gray-800 pl-4 italic my-6 text-gray-600">
            "The traditional office-centric approach is evolving into a more flexible, results-oriented work culture. Companies that embrace this change are positioning themselves to thrive in the future economy." — Sri Lanka Association of HR Professionals
          </blockquote>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">Benefits and Challenges</h2>
          
          <p class="mb-4">For employees, remote work offers reduced commute times in congested urban centers like Colombo, improved work-life balance, and the ability to work for international companies without relocation. Many professionals report higher job satisfaction and reduced stress levels.</p>
          
          <p class="mb-4">However, challenges persist. Companies struggle with maintaining corporate culture, ensuring consistent productivity monitoring, and addressing the inequality between roles that can and cannot be performed remotely. Employees sometimes report feelings of isolation, difficulty separating work and personal life, and concerns about career progression in a remote environment.</p>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">Infrastructure Considerations</h2>
          
          <p class="mb-4">One significant factor influencing remote work adoption in Sri Lanka is internet infrastructure. While urban centers enjoy relatively reliable connectivity, rural areas often face challenges with consistent high-speed internet access. Power outages remain a concern in some regions, potentially disrupting remote work.</p>
          
          <p class="mb-4">Forward-thinking companies are addressing these challenges by providing stipends for home office setups, including backup power solutions and dedicated internet connections. Some organizations are exploring hub-and-spoke models with smaller regional offices or co-working space partnerships to provide alternative workspaces.</p>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">The Future Outlook</h2>
          
          <p class="mb-4">Looking ahead, the hybrid model appears to be gaining the most traction among Sri Lankan businesses. This approach combines in-office presence with remote work flexibility, aiming to capture the benefits of both models while mitigating their respective drawbacks.</p>
          
          <p class="mb-4">As international companies increasingly hire remote workers from Sri Lanka, local companies face both competition for talent and opportunities to adopt global best practices. This international exposure is likely to accelerate the evolution of work models and professional expectations across the country.</p>
          
          <p class="mb-4">The legal framework is also evolving, with discussions about updating labor laws to address remote work arrangements, including considerations for work hours, health and safety requirements for home offices, and tax implications.</p>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">Preparing for Success</h2>
          
          <p class="mb-4">For professionals looking to thrive in this changing landscape, developing self-management skills, digital literacy, and effective virtual communication abilities is crucial. For employers, investing in secure digital infrastructure, reimagining management approaches to focus on outcomes rather than presence, and intentionally fostering company culture across distributed teams will be key differentiators.</p>
          
          <p class="mb-6">As Sri Lanka continues to position itself as a knowledge economy hub in South Asia, the evolution of work models will play a significant role in shaping its economic future and competitiveness on the global stage.</p>
        `,
        tags: ["Remote Work", "HR Trends", "Workplace Culture", "Technology", "Employment"],
        views: 1243,
        likes: 89,
        comments: 23
      };
      
      setBlogPost(post);
      
      // Mock related posts
      setRelatedPosts([
        {
          id: 2,
          title: "Top 5 Tech Skills in Demand for 2024",
          excerpt: "Discover the most sought-after technical skills in the Sri Lankan job market this year...",
          category: "Career Advice",
          date: "March 12, 2024",
          readTime: "4 min read",
          image: "https://source.unsplash.com/random/800x600?technology"
        },
        {
          id: 3,
          title: "Building Effective Workplace Cultures",
          excerpt: "Strategies for creating productive and positive work environments in modern organizations...",
          category: "HR Insights",
          date: "March 10, 2024",
          readTime: "6 min read",
          image: "https://source.unsplash.com/random/800x600?teamwork"
        }
      ]);
      
      setLoading(false);
    };
    
    fetchPost();
  }, [id]);
  
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
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/blog" className="flex items-center text-gray-700 hover:text-black transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to Blog</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bookmark size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <img 
          src={blogPost.image} 
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
              <span>{blogPost.date}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{blogPost.readTime}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp size={16} className="mr-2" />
              <span>{blogPost.likes} likes</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-2" />
              <span>{blogPost.comments} comments</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Author Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-30">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
          <img 
            src={blogPost.author.image} 
            alt={blogPost.author.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-white"
          />
          <div>
            <h3 className="font-bold text-lg">{blogPost.author.name}</h3>
            <p className="text-gray-600 text-sm">{blogPost.author.role}</p>
          </div>
          <button className="ml-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Follow
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose lg:prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </article>
        
        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4">Tagged with</h3>
          <div className="flex flex-wrap gap-2">
            {blogPost.tags.map(tag => (
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
            <h3 className="font-bold text-xl mb-6">Comments ({blogPost.comments})</h3>
            
            {/* Comment Form */}
            <div className="mb-8">
              <textarea
                placeholder="Share your thoughts..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none h-32"
              />
              <div className="flex justify-end mt-4">
                <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Post Comment
                </button>
              </div>
            </div>
            
            {/* Comments */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
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
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
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
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
              Load More Comments
            </button>
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
            <Link to="/upload-cv" className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Upload Your CV
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer would go here, reusing from your original code */}
    </div>
  );
}