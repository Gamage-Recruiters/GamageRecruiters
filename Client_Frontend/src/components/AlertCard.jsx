import React, { useState, useEffect, useRef } from "react";


{/* Alert Card Section */}
<div className="mt-8 mx-auto max-w-7xl px-6 lg:px-8">
  <AlertCard />
</div>
const alerts = [
  {
    title: "Get Instant IT Recruitment ",
    subtitle: "Proven Track Record",
    description: "Successfully placed IT candidates across industries, ensuring client satisfaction.",
    color: "bg-blue-50 border-l-4 border-blue-500",
    textColor: "text-blue-900"
  },
  {
    title: "Get Instant Healthcare Recruitment ",
    subtitle: "Customized Recruitment Solutions",
    description: "Tailored hiring strategies for healthcare roles, matching organizational culture.",
    color: "bg-green-50 border-l-4 border-green-500",
    textColor: "text-green-900"
  },
  {
    title: "Get Instant Engineering Recruitment ",
    subtitle: "Speed and Efficiency",
    description: "Rapid placement of qualified mechanical & automation engineers.",
    color: "bg-amber-50 border-l-4 border-amber-500",
    textColor: "text-amber-900"
  },
  {
    title: "Get Instant Digital Marketing Recruitment ",
    subtitle: "Extensive Talent Pool",
    description: "Access pre-screened digital marketing experts for your team.",
    color: "bg-purple-50 border-l-4 border-purple-500",
    textColor: "text-purple-900"
  },
  {
    title: "Get Instant Internship ",
    subtitle: "Proven Internship Programs",
    description: "Get groomed talent through structured internship placements.",
    color: "bg-indigo-50 border-l-4 border-indigo-500",
    textColor: "text-indigo-900"
  },
];

export default function AlertCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const cardWidth = 320;
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      scrollTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % alerts.length);
      }, 3000);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentIndex, isPaused]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentIndex * (cardWidth + 16), // 16px for margin
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const handlePrev = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setCurrentIndex(prev => (prev - 1 + alerts.length) % alerts.length);
  };

  const handleNext = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setCurrentIndex(prev => (prev + 1) % alerts.length);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="flex overflow-hidden snap-x snap-mandatory py-4 px-2 scrollbar-hide"
        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {alerts.map((alert, idx) => (
          <div 
            key={idx}
            className={`${alert.color} p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex-shrink-0 w-72 mx-2 snap-start`}
          >
            <div className="flex-grow">
              <h3 className={`text-lg font-bold mb-2 ${alert.textColor}`}>{alert.title}</h3>
              <div className={`font-semibold mb-2 ${alert.textColor}`}>{alert.subtitle}</div>
              <p className="text-sm text-gray-700 mb-4">{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}