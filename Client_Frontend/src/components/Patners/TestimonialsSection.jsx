import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    company: "CBL Group",
    logo: "https://d1l8km4g5s76x5.cloudfront.net/Production/exb_doc/2015/16038/thumb_2015_16038_15864_4687.png",
    quote: "I've had the privilege of working with Gamage Recruiters, and I must commend their exceptional professionalism and collaborative work partnership throughout the talent acquisition process. Their unique and disciplined approach ensures they find the best fit for the role. Having worked with them for a considerable time, I wholeheartedly recommend Gamage Recruiters for executive hires without hesitation.",
    author: "Chamila Senarathne",
    position: "General Manager HR - CBL Food Cluster",
    rating: 5
  },
  {
    id: 2,
    company: "GNEXT",
    logo: "https://i.ibb.co/yFwBn1mQ/Whats-App-Image-2025-08-21-at-09-23-24.jpg",
    quote: "Your recruitment service was instrumental in fulfilling our urgent and critical hiring needs. It allowed us to discreetly recruit for senior positions without alerting the market, ensuring confidentiality throughout the process. Additionally, your ability to source qualified candidates with specialized expertise in our specific industry was invaluable. This tailored approach not only saved us time but also ensured that we secured the right talent for key roles.",
    author: "Amali Rathnapala",
    position: "Manager HR-GNEXT",
    rating: 5
  },
  {
    id: 3,
    company: "Transocean DUTY FREE (PVT) LTD",
    logo: "https://i.ibb.co/mFHfsjFg/Trans-Ocean.png",
    quote: "Working with Gamage Recruiters has been an outstanding experience. Their team demonstrated exceptional professionalism, efficiency, and dedication in understanding our recruitment needs and delivering top-tier candidates. Their seamless process and industry expertise ensured that we onboarded highly skilled professionals who have contributed significantly to our company’s success. I highly recommend Gamage Recruiters to any organization seeking a reliable and results-driven recruitment partner.",
    author: "R.Jayasinghe",
    position: "Director - Transocean DUTY FREE (PVT) LTD",
    rating: 5
  },
  {
    id: 4,
    company: "MeedRO",
    logo: "https://i.ibb.co/rG3Q2PPw/Screenshot-2025-07-30-113339.png",
    quote: "Gamage Recruiters exceeded our expectations in every way. Their deep understanding of the maritime industry and commitment to finding the right talent made our hiring process smooth and efficient. They provided us with highly qualified professionals who perfectly matched our requirements. Their proactive approach, attention to detail, and excellent communication made the entire process effortless. We truly appreciate their support and look forward to working with them again in the future.",
    author: "P. Senanayaka",
    position: "Chairman & Director - MeedRo",
    rating: 5
  },
  {
    id: 5,
    company: "Gnanam Food (PVT)Ltd",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCgHY4mRTDRj0DEKOsx98NfZdLfhD_knYSyw&s",
    quote: "Working with Gamage Recruiters was a game-changer! They didn’t just send resumes — they delivered top-tier talent with precision and speed. Sharp, professional, and truly in sync with our hiring goals. Highly recommended!",
    author: "Patchamuthu Satheesan",
    position: "Manager Operations-Gnanam Food ",
    rating: 5
  },
  {
      id: 6,
      company: "David Pieris Group of Companies",
      logo: "https://i.ibb.co/v4s4h15c/images.png",
      quote: "As an HR Manager, I am pleased to recommend Gamage Recruiters for their exceptional services. My experience with their team has been outstanding, marked by professionalism, efficiency, and a deep understanding of recruitment needs. They consistently provided highly qualified candidates, tailored to our requirements, while maintaining clear and timely communication throughout the process. Their commitment to excellence and attention to detail ensured a seamless hiring experience. I am fully satisfied with their services and confidently recommend them to any organization seeking a reliable, results-driven recruitment partner.",
      author: "Manager",
      position: "Human Resources DP Logistics Pvt Ltd",
      rating: 5
    },
    {
      id: 7,
      company: "Aminovit Private Ltd",
      logo: "https://i.ibb.co/C31tytQk/images.jpg",
      quote: "We've had a smooth and professional experience working with Gamage Recruiters. Their responsiveness, understanding of our requirements, and quality of shortlisted candidates have been commendable. We appreciate their support in helping us find the right talent efficiently.",
      author: "Hasini Dayananda",
      position: "Executive - HR & Administration Aminovit Pvt Ltd",
      rating: 5
    }
];

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const autoplayRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const navigateTestimonial = (dir) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(dir);

    setTimeout(() => {
      if (dir === 'next') {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      } else {
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
      setIsAnimating(false);
    }, 400);
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!isPaused) {
      autoplayRef.current = setInterval(() => {
        navigateTestimonial('next');
      }, 6000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isPaused]);

  // Pause auto-rotation on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-50 to-transparent opacity-20"></div>
      <div className="absolute -top-12 right-12 w-64 h-64 rounded-full bg-indigo-600 opacity-10"></div>
      <div className="absolute top-1/4 -left-12 w-48 h-48 rounded-full bg-blue-600 opacity-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-800 opacity-10"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            What Our Partners Say
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-indigo-300 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear directly from the industry leaders who trust us with their talent acquisition needs.
          </p>
        </div>

        <div className="relative mt-20" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Large quote icon */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-indigo-300 opacity-20">
            <Quote size={120} />
          </div>

          {/* Testimonial cards container */}
          <div className="relative h-auto min-h-[24rem] md:h-96 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute w-full transition-all duration-500 ease-in-out ${index === activeTestimonial
                  ? 'opacity-100 translate-x-0 z-20'
                  : direction === 'next'
                    ? index === (activeTestimonial + 1) % testimonials.length
                      ? 'opacity-0 translate-x-full z-10'
                      : 'opacity-0 -translate-x-full z-0'
                    : index === (activeTestimonial - 1 + testimonials.length) % testimonials.length
                      ? 'opacity-0 -translate-x-full z-10'
                      : 'opacity-0 translate-x-full z-0'
                  }`}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-bl-full opacity-50"></div>

                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-white p-2 shadow-md mr-4 flex items-center justify-center">
                        <img
                          src={testimonial.logo}
                          alt={testimonial.company}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{testimonial.company}</h3>
                        <div className="flex mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial text with responsive styling */}
                  <div className="mb-8 max-h-[200px] md:max-h-none overflow-y-auto">
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">"{testimonial.quote}"</p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-indigo-600">{testimonial.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigateTestimonial('prev')}
                        className="w-10 h-10 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft size={20} className="text-indigo-600" />
                      </button>
                      <button
                        onClick={() => navigateTestimonial('next')}
                        className="w-10 h-10 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                      >
                        <ChevronRight size={20} className="text-indigo-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-8 w-full max-w-md mx-auto bg-blue-800 bg-opacity-50 h-1 rounded-full overflow-hidden">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-full bg-white transition-all duration-300 ${index === activeTestimonial ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{
                  width: `${(1 / testimonials.length) * 100}%`,
                  marginLeft: `${(index / testimonials.length) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeTestimonial ? 'next' : 'prev');
                  setActiveTestimonial(index);
                }}
                className={`w-3 h-3 mx-1 rounded-full transition-colors ${index === activeTestimonial
                  ? 'bg-white'
                  : 'bg-blue-200 bg-opacity-50 hover:bg-blue-100'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animation for floating particles */}
      <style >{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}