import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Search, Filter, Users, Star, ChevronDown, X, Bookmark, Share2 } from 'lucide-react';

// Sample events data - in a real app, this would come from your API
const featuredEvents = [
  {
    id: 1,
    title: "Leadership Mastery Workshop",
    category: "Leadership",
    date: "April 10, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Business Center, New York",
    image: "https://images.pexels.com/photos/8761534/pexels-photo-8761534.jpeg",
    color: "from-blue-500 to-purple-600",
    speaker: "Dr. Emma Richards",
    price: "$349",
    spots: "Limited to 25 attendees",
    rating: 4.9,
    description: "Master the art of modern leadership with practical strategies for team motivation and organizational success."
  },
  {
    id: 2,
    title: "Digital Marketing Innovation",
    category: "Marketing",
    date: "April 18, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Tech Hub, San Francisco",
    image: "https://images.pexels.com/photos/8349230/pexels-photo-8349230.jpeg",
    color: "from-green-500 to-teal-600",
    speaker: "Marcus Johnson",
    price: "$299",
    spots: "15 spots remaining",
    rating: 4.7,
    description: "Stay ahead of the curve with cutting-edge digital marketing techniques and tools for 2025 and beyond."
  },
  {
    id: 3,
    title: "Financial Planning Seminar",
    category: "Finance",
    date: "April 25, 2025",
    time: "1:00 PM - 5:00 PM",
    location: "Grand Hotel, Chicago",
    image: "https://images.pexels.com/photos/9034869/pexels-photo-9034869.jpeg",
    color: "from-amber-500 to-orange-600",
    speaker: "Sarah Williams, CFA",
    price: "$199",
    spots: "Virtual option available",
    rating: 4.8,
    description: "Plan your financial future with expert guidance on investments, retirement, and wealth building strategies."
  }
];

const upcomingEvents = [
  {
    id: 4,
    title: "Data Science Fundamentals",
    category: "Technology",
    date: "May 5, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Online (Virtual)",
    image: "https://images.pexels.com/photos/17485657/pexels-photo-17485657/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-depicts-how-ai-could-adapt-to-an-infinite-amount-of-uses-it-was-created-by-nidia-dias-as-part-of-the-visualising-ai-pr.png",
    color: "from-indigo-500 to-blue-600",
    speaker: "Dr. Alex Chen",
    price: "$249",
    spots: "Unlimited virtual seats",
    rating: 4.6
  },
  {
    id: 5,
    title: "Public Speaking Masterclass",
    category: "Communication",
    date: "May 12, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Conference Center, Austin",
    image: "https://images.pexels.com/photos/3761509/pexels-photo-3761509.jpeg",
    color: "from-red-500 to-pink-600",
    speaker: "James Wilson",
    price: "$275",
    spots: "8 spots remaining",
    rating: 4.9
  },
  {
    id: 6,
    title: "Project Management Workshop",
    category: "Business",
    date: "May 20, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Business District, Seattle",
    image: "https://images.pexels.com/photos/3182796/pexels-photo-3182796.jpeg",
    color: "from-cyan-500 to-blue-600",
    speaker: "Lisa Rodriguez, PMP",
    price: "$325",
    spots: "12 spots remaining",
    rating: 4.8
  },
  {
    id: 7,
    title: "Sustainable Business Practices",
    category: "Sustainability",
    date: "June 3, 2025",
    time: "1:00 PM - 5:00 PM",
    location: "Green Center, Portland",
    image: "https://images.pexels.com/photos/7438102/pexels-photo-7438102.jpeg",
    color: "from-emerald-500 to-green-600",
    speaker: "Dr. Michael Green",
    price: "$199",
    spots: "20 spots remaining",
    rating: 4.7
  },
  {
    id: 8,
    title: "AI for Business Innovation",
    category: "Technology",
    date: "June 10, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Tech Campus, Boston",
    image: "https://images.pexels.com/photos/31120849/pexels-photo-31120849/free-photo-of-young-architects-collaborating-on-a-project.jpeg",
    color: "from-violet-500 to-purple-600",
    speaker: "Sophia Lee, PhD",
    price: "$399",
    spots: "Limited to 30 attendees",
    rating: 4.9
  },
  {
    id: 9,
    title: "Creative Problem Solving",
    category: "Innovation",
    date: "June 18, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Innovation Hub, Miami",
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    color: "from-yellow-500 to-amber-600",
    speaker: "David Thompson",
    price: "$249",
    spots: "15 spots remaining",
    rating: 4.6
  }
];
// Categories for filtering
const categories = [
    "All", "Leadership", "Marketing", "Finance", "Technology", 
    "Communication", "Business", "Sustainability", "Innovation"
  ];
  
  const WorkshopsAndSeminarsPage = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
  
    useEffect(() => {
      // Simulate loading delay for animation purposes
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }, []);
  
    // Filter events based on search and category
    const filteredEvents = upcomingEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.speaker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeFilter === "All" || event.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  
    const loadMore = () => {
      setVisibleCount(prev => Math.min(prev + 3, filteredEvents.length));
    };
  
    const toggleEventDetails = (id) => {
      setExpandedEvent(expandedEvent === id ? null : id);
    };
  
    return (
      <div className="bg-white min-h-screen">
        {/* Hero Section with Video Background */}
        <div className="relative h-96 overflow-hidden">
          {showVideo ? (
            <div className="absolute inset-0 bg-black">
              <video 
                autoPlay 
                muted 
                loop 
                className="w-full h-full object-cover opacity-70"
              >
                <source src="/api/placeholder/1920/1080" type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="absolute inset-0 bg-grid-white/10 bg-grid-16"></div>
            </div>
          )}
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                Workshops & Seminars
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
              Expand your horizons, enhance your skills, and connect with industry leaders
            </p>
            <div className="flex space-x-4 animate-fade-in-up animation-delay-400">
              <button 
                onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-purple-700 font-medium rounded-full hover:bg-opacity-90 transform transition duration-300 hover:scale-105 shadow-lg"
              >
                Explore Events
              </button>
              <button 
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white hover:bg-opacity-10 transform transition duration-300 hover:scale-105"
              >
                Subscribe to Updates
              </button>
            </div>
          </div>
  
          {/* Animated Wave Effect */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20L48 26.7C96 33.3 192 46.7 288 53.3C384 60 480 60 576 46.7C672 33.3 768 6.7 864 6.7C960 6.7 1056 33.3 1152 40C1248 46.7 1344 33.3 1392 26.7L1440 20V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V20Z" fill="white"/>
            </svg>
          </div>
        </div>
  
        {/* Featured Events Section */}
        <div id="featured" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Featured Events
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Don't miss our most popular workshops and seminars led by world-class industry experts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {featuredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className={`group relative overflow-hidden rounded-xl shadow-xl transform transition-all duration-1000 hover:-translate-y-2 hover:shadow-2xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${event.color} opacity-80 z-10`}></div>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="h-96 w-full object-cover transform transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold inline-block w-fit mb-3">
                    {event.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:underline decoration-2 underline-offset-4">{event.title}</h3>
                  <p className="text-white text-opacity-90 mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock size={16} className="mr-2 flex-shrink-0" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users size={16} className="mr-2 flex-shrink-0" />
                      {event.spots}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                        <Users size={14} />
                      </div>
                      <span className="text-sm">{event.speaker}</span>
                    </div>
                    <span className="font-bold">{event.price}</span>
                  </div>
                  <button className="mt-4 w-full py-2.5 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg font-medium transition-all duration-300 transform group-hover:scale-105">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Search and Filter Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search by title, category, or speaker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
  
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === category
                      ? 'bg-purple-600 text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
  
       {/* Upcoming Events Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Upcoming Workshops & Seminars
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
            Browse our upcoming events and register before they fill up
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.slice(0, visibleCount).map((event, index) => (
            <div 
                key={event.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                expandedEvent === event.id ? 'md:col-span-2 md:row-span-2' : ''
                }`}
            >
                <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-b ${event.color} opacity-30`}></div>
                <img
                    src={event.image}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-1.5 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-opacity-100 transition-all">
                    <Bookmark size={16} />
                    </button>
                    <button className="p-1.5 bg-white bg-opacity-80 backdrop-blur-sm rounded-full text-gray-700 hover:bg-opacity-100 transition-all">
                    <Share2 size={16} />
                    </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold">
                    {event.category}
                </div>
                </div>

                <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                    <div className="flex items-center bg-purple-100 px-2 py-1 rounded text-xs font-semibold text-purple-700">
                    <Star size={12} className="mr-1 fill-current text-yellow-500" />
                    {event.rating}
                    </div>
                </div>

                <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-2 text-purple-600" />
                    {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-2 text-purple-600" />
                    {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-2 text-purple-600" />
                    {event.location}
                    </div>
                </div>

                {expandedEvent === event.id && (
                    <div className="mt-4 mb-4 text-gray-700 animate-fade-in">
                    <p className="mb-3">{event.description || "Join us for this exceptional workshop where you'll learn valuable skills from industry experts."}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {event.tags?.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                        </span>
                        ))}
                    </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                    <div className="flex -space-x-2 mr-2">
                        {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img
                            src={`/avatars/person-${i + 1}.jpg`}
                            alt="Attendee"
                            className="h-full w-full object-cover"
                            />
                        </div>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">{event.attendees || "24"} attending</span>
                    </div>
                    
                    <button 
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    className="text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                    {expandedEvent === event.id ? "Show less" : "Read more"}
                    </button>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-gray-700">
                    <span className="font-bold text-gray-900">${event.price}</span>
                    {event.discounted && (
                        <span className="ml-2 line-through text-gray-400 text-sm">${event.originalPrice}</span>
                    )}
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                    Register Now
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>

        {filteredEvents.length > visibleCount && (
            <div className="mt-10 text-center">
            <button 
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="inline-flex items-center px-6 py-3 border border-purple-300 text-base font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            >
                Load More
                <ChevronDown size={16} className="ml-2" />
            </button>
            </div>
        )}
        </div>

    </div>
);
};

export default WorkshopsAndSeminarsPage;