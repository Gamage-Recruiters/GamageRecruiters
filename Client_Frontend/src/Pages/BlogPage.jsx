import { Link } from 'react-router-dom';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: "Future of Remote Work in Sri Lanka",
    excerpt: "Exploring how Sri Lankan companies are adapting to hybrid work models and global employment trends...",
    category: "Industry Trends",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "https://source.unsplash.com/random/800x600?office"
  },
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
  },
];

const categories = ['All', 'Industry Trends', 'Career Advice', 'HR Insights', 'Market News'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      {/* <nav className="bg-black text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">Gamage Recruiters</Link>
          <div className="flex items-center space-x-8">
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="hover:text-gray-300">Sign In</button>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <span className="uppercase text-sm font-semibold text-gray-400">Featured Article</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Navigating Sri Lanka's Evolving Job Market
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Comprehensive analysis of current employment trends and strategic career planning
            </p>
            <div className="mt-8 flex items-center space-x-4 text-sm">
              <span className="bg-white text-black px-3 py-1 rounded-full">Market Report</span>
              <span>March 18, 2024</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-200 pb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <article 
              key={post.id}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">{post.date}</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  <Link to={`/blog/${post.id}`} className="hover:text-gray-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{post.readTime}</span>
                  <span className="mx-2">•</span>
                  <Link to={`/blog/${post.id}`} className="font-medium hover:text-gray-900">
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-24 bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Informed</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Subscribe to our weekly newsletter for the latest career insights and market updates
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Gamage Recruiters</h3>
              <p className="text-gray-400 text-sm">
                Connecting talent with opportunity across Sri Lanka
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/tools" className="hover:text-white">Career Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            © 2024 Gamage Recruiters. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}