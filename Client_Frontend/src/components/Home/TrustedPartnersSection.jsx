import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrustedPartnersSection = () => {
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);

  useEffect(() => {
    const animateLeftScroll = () => {
      if (leftScrollRef.current) {
        if (leftScrollRef.current.scrollLeft >= leftScrollRef.current.scrollWidth / 2) {
          leftScrollRef.current.scrollLeft = 0;
        } else {
          leftScrollRef.current.scrollLeft += 1;
        }
      }
    };

    const animateRightScroll = () => {
      if (rightScrollRef.current) {
        if (rightScrollRef.current.scrollLeft <= 0) {
          rightScrollRef.current.scrollLeft = rightScrollRef.current.scrollWidth / 2;
        } else {
          rightScrollRef.current.scrollLeft -= 1;
        }
      }
    };

    const leftInterval = setInterval(animateLeftScroll, 30);
    const rightInterval = setInterval(animateRightScroll, 30);

    return () => {
      clearInterval(leftInterval);
      clearInterval(rightInterval);
    };
  }, []);

  const partners = [
    { id: 1, name: "CBL", logo: "https://d1l8km4g5s76x5.cloudfront.net/Production/exb_doc/2015/16038/thumb_2015_16038_15864_4687.png", category: "Food & Beverage" },
    { id: 2, name: "Global Finance", logo: "data:image/png;base64,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", category: "Finance" },
    { id: 3, name: "Health Plus", logo: "https://www.hac.lk/uploads/brand/pelwatte-LSrs5cqkat.png", category: "Healthcare" },
    { id: 4, name: "Edu Alliance", logo: "https://upload.wikimedia.org/wikipedia/en/0/0a/Union_Assurance_logo.png", category: "Education" },
    { id: 5, name: "Build Masters", logo: "https://i.ibb.co/pvn864CX/image.png", category: "Construction" }
  ];
  
  // Duplicate partners array for smooth infinite scrolling
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Trusted Partners
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 transform scale-x-75 rounded-full mx-auto w-24"></span>
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
            We collaborate with industry leaders to bring you the best opportunities across Sri Lanka
          </p>
        </div>
        
        {/* First row - Left to Right */}
        <div className="mb-8 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-indigo-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-50 to-transparent z-10"></div>
          
          <div 
            ref={leftScrollRef}
            className="flex overflow-x-hidden whitespace-nowrap py-4"
          >
            <div className="flex space-x-8 inline-block">
              {duplicatedPartners.map((partner, index) => (
                <div 
                  key={`left-${partner.id}-${index}`} 
                  className="bg-white p-6 rounded-lg shadow-md w-56 inline-block transform transition duration-500 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="mb-4 overflow-hidden rounded-md flex items-center justify-center h-20">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-indigo-600">{partner.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Second row - Right to Left */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-indigo-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-50 to-transparent z-10"></div>
          
          <div 
            ref={rightScrollRef}
            className="flex overflow-x-hidden whitespace-nowrap py-4"
          >
            <div className="flex space-x-8 inline-block">
              {duplicatedPartners.reverse().map((partner, index) => (
                <div 
                  key={`right-${partner.id}-${index}`} 
                  className="bg-white p-6 rounded-lg shadow-md w-56 inline-block transform transition duration-500 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="mb-4 overflow-hidden rounded-md flex items-center justify-center h-20">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-indigo-600">{partner.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <Link 
            to="/trusted-partners" 
            className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-300 shadow-md"
          >
            View All Partners <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrustedPartnersSection;