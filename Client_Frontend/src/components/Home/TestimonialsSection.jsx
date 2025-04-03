import { useState } from 'react';
import { ArrowRight, MapPin, Briefcase, DollarSign, Calendar, Clock } from 'lucide-react';

const TestimonialsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const testimonials = [
    {
      name: "Damayantha Surampika",
      role: "Senior Marketing Executive",
      company: "Gamage Recruiters",
      quote: "I am beyond grateful to Gamage Recruiters for connecting me with the perfect career opportunity. Their guidance and support helped me secure a role as a Senior Marketing Executive at a reputed firm, where I can truly showcase my skills. The recruitment team understood my strengths and aspirations, making the entire process smooth and stress-free. Thank you for paving the way for my professional growth!",
      image: "https://i.ibb.co/PvCfxjd/gamage.png"
    },
    {
      name: "Sapthika Sandaruwani",
      role: "HR Coordinator",
      company: "Gamage Recruiters",
      quote: "Finding a job that aligns with my passion was made possible by Gamage Recruiters. They not only provided me with an opportunity but also mentored me throughout the selection process. Today, I am excelling as an HR Coordinator, thanks to their continuous support and encouragement. I truly appreciate their efforts in shaping my career!",
      image: "https://i.ibb.co/PvCfxjd/gamage.png"
    },
    {
      name: "Rasika",
      role: "Software Engineer",
      company: "Gamage Recruiters",
      quote: "I had been searching for the right job for months, but it was Gamage Recruiters that finally helped me land my dream job as a Software Engineer. Their dedication and professionalism ensured I was matched with a company that values my expertise. I highly recommend them to anyone seeking a fulfilling career path. Thank you for making this journey so rewarding!",
      image: "https://i.ibb.co/PvCfxjd/gamage.png"
    },
  ];

  const toggleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Success Stories
          </h2>
          <p className="mt-4 text-xl leading-8 text-gray-600">
            Hear from professionals who found their dream careers through our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-8 transform transition duration-500 hover:-translate-y-2 hover:shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-indigo-600">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>

              {expandedIndex !== index ? (
                <p className="text-gray-600 italic line-clamp-4">"{testimonial.quote}"</p>
              ) : (
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              )}
              
              <div 
                className="flex items-center text-indigo-600 font-medium mt-2" 
                onClick={() => toggleReadMore(index)} 
                style={{ cursor: 'pointer' }}
              >
                {expandedIndex !== index ? "Read more..." : "Read less..."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;